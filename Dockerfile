FROM node:8

RUN groupadd -g 999 jenkins
RUN useradd -m -g 999 -u 999 jenkins
