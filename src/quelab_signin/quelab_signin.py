import os
import logging
import json
import tornado.ioloop
import tornado.web
import paho.mqtt.publish as publish
from datetime import datetime, timezone
from .wildapricot import WildApricotApi, WildApricotError

from tornado.log import enable_pretty_logging
enable_pretty_logging()

class SignInError(Exception):
    # you would think tornado.web.HTTPError would be better, but you would be wrong
    # https://groups.google.com/forum/#!topic/python-tornado/XTpKcw_G--g
    # write_error does not receive custom kwargs from HTTPError
    def __init__(self, code, reason):
        self.code = code
        self.reason = reason

class SigninHandler(tornado.web.RequestHandler):
    def initialize(self, api_key, mqtt_host):
        self.app_log = logging.getLogger("tornado.application")
        self.mqtt_host = mqtt_host
        self.mqtt_topic = 'quelab/door/entry'
        self.wa_api = WildApricotApi(api_key)

    def write_error(self, status_code, **kwargs):
        self.set_header("Content-Type", "text/plain")
        self.set_status(status_code)
        if "message" in kwargs:
            self.write(kwargs["message"])

    def handle_member(self, first_name, last_name):
        if first_name and last_name:
            contact = self.wa_api.find_contact_by_name(first_name, last_name)
            if not contact:
                raise SignInError(404, "Member not found {} {}".format(first_name, last_name))
            avatar = self.wa_api.get_contact_avatar(contact)
            contact['avatar'] = avatar
            contact['signin_time'] = datetime.now(tz=timezone.utc).isoformat()
            publish.single(self.mqtt_topic, json.dumps(contact), hostname=self.mqtt_host)
        else:
            raise WildApricotError()

    def post(self):
        first_name = self.get_argument('firstName')
        last_name = self.get_argument('lastName')
        username = first_name + ' ' + last_name


        try:
            self.handle_member(first_name, last_name)

        except SignInError as e:
            self.app_log.warning(e.reason)
            member = 'Non Member'
            response = "Welcome: ({}) {}".format(member, username)
            self.write(response)

        except WildApricotError as e:
            message = "Both first and last name are required"
            self.write_error(404, message=message)
            self.app_log.warning(message)
        else:
            member = 'Member'
            response = "Welcome: ({}) {}".format(member, username)
            self.write(response)
            self.app_log.info(response)



