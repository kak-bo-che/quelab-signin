# Quelab Signin Form

Adapted directly from [Start Bootstrap - Bare](https://startbootstrap.com/template-overviews/bare/).

Uses python tornado on the backend to log signin requests.

## Installation

```bash
pip install tornado
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
login page will be running at http://localhost:8888

```bash
sudo cp quelab-signin.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable quelab-signin.service
sudo systemctl start quelab-signin.service
```