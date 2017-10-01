from flask import Flask, request, send_from_directory

app = Flask(__name__, static_path='/vendor')
@app.route('/')
def root():
    return app.send_static_file('index.html')

# @app.route('/<path:path>')
# def static_proxy(path):
#   # send_static_file will guess the correct MIME type
#   return app.send_static_file(path)

# @app.route('/')
# def root():
#     return app.send_static_file('index.html')

# @app.route("/api/signin", methods=['POST'])
# def signin():
#     # username is member
#     if request.form.get('is_member'):
#         member = '(Member) '
#     app.logger.info('Web form login: {}{}'.format(member, request.form['username']))
#     return 'Web form login: {}{}'.format(member, request.form['username'])