import os
import logging
import json
import tornado.ioloop
import tornado.web
import paho.mqtt.publish as publish
from datetime import datetime, timezone
from wildapricot import WildApricotApi, WildApricotError

from tornado.log import enable_pretty_logging
enable_pretty_logging()
public_root = os.path.join(os.path.dirname(__file__), '../../web/dist')
class SignInError(Exception):
    # you would think tornado.web.HTTPError would be better, but you would be wrong
    # https://groups.google.com/forum/#!topic/python-tornado/XTpKcw_G--g
    # write_error does not receive custom kwargs from HTTPError
    def __init__(self, code, reason):
        self.code = code
        self.reason = reason

class SigninHandler(tornado.web.RequestHandler):
    def initialize(self, api_key, mqtt_host, mqtt_topic):
        self.app_log = logging.getLogger("tornado.application")
        self.mqtt_host = mqtt_host
        self.mqtt_topic = mqtt_topic
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
        is_member = self.get_argument('isMember', 'false')
        try:

            if is_member == 'true':
                self.handle_member(first_name, last_name)
                member = 'Member'
                response = "Welcome: ({}) {}".format(member, username)
            else:
                member = 'Non Member'
                response = "Welcome: ({}) {}".format(member, username)
            self.write(response)
            self.app_log.info(response)

        except WildApricotError as e:
            message = "Both first and last name are required for member sign in."
            self.write_error(404, message=message)
            self.app_log.warning(message)
        except SignInError as e:
            self.write_error(e.code, message=e.reason)
            self.app_log.warning(e.reason)


def set_logging():
    app_log = logging.getLogger("tornado.application")
    app_log.setLevel(logging.INFO)
    access_log = logging.getLogger("tornado.access")
    access_log.setLevel(logging.WARNING)

def make_app():
    api_key='4fy63rfn598ip4svqkse8ic7eb9rcv'
    mqtt_host = 'localhost'
    mqtt_topic = 'quelab/door/entry'
    set_logging()
    # static_path='vendor'
    return tornado.web.Application([
        (r"/api/signin", SigninHandler, {'api_key': api_key, 'mqtt_host': mqtt_host, 'mqtt_topic': mqtt_topic}),
        (r'/static/README.md()', tornado.web.StaticFileHandler, {'path': 'README.md'}),
        (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': public_root}),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': public_root })
    ], autoreload=True)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
