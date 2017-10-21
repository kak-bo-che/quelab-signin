# Quelab Signin Form
The UI for the login page is written in [React](https://reactjs.org/). It is
implemented as a single page web app using a [tornado python HTTP backend](http://www.tornadoweb.org).
Sign in events are asynchronously accumulated and displayed via a websocket interface to a
local [MQTT](http://mqtt.org) [server](https://mosquitto.org).

## Installation

### Python
```bash
pip install -r requirements.txt
```

### Nodejs
The static webpage is built using webpack, which requires that nodejs v8 be installed
```
install node8
cd web
NODE_ENV=production npm run build -- -p
```

## Systemd Unit File

```ini
[Unit]
Description=Quelab Signing Page
After=multi-user.target

[Service]
User=doorctrl
Group=doorctrl
WorkingDirectory=/home/doorctrl/quelab-signin/
ExecStart=/usr/bin/python3 /home/doorctrl/quelab-signin/signin-tornado.py

[Install]
WantedBy=multi-user.target
```

### Installation
login page will be running at http://localhost:8888/

```bash
sudo cp quelab-signin.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable quelab-signin.service
sudo systemctl start quelab-signin.service
```