import os
import logging
import tornado.ioloop
import tornado.web

from tornado.log import enable_pretty_logging
enable_pretty_logging()

class SigninHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.app_log = logging.getLogger("tornado.application")

    def post(self):
        username = self.get_argument('username')
        is_member = self.get_argument('is_member', 'Non Member')
        response = "Welcome: ({}) {}".format(is_member, username)
        self.write(response)
        self.app_log.info(response)

def set_logging():
    app_log = logging.getLogger("tornado.application")
    app_log.setLevel(logging.INFO)
    access_log = logging.getLogger("tornado.access")
    access_log.setLevel(logging.WARNING)

def make_app():
    set_logging()
    static_path='vendor'
    return tornado.web.Application([
        (r"/api/signin", SigninHandler),
        (r'/()',        tornado.web.StaticFileHandler, {'path': 'index.html'}),
        (r'/vendor/(.*)', tornado.web.StaticFileHandler, {'path': static_path}),

    ], autoreload=True)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
