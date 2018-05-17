#!/bin/bash

cd /home/ubuntu/basic-fs

sudo npm i -g pm2
npm i -g pm2

pm2 start index.js
