#!/bin/sh

while true; do
  sleep 2;
  /usr/bin/inotifywait -qm --event modify --format '%e' ./nginx.conf | echo ""
  echo "nginx config reload"
  nginx -s reload
done &

nginx -g "daemon off;"