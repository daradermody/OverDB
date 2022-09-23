#!/usr/bin/env bash

main() {
  cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
  kill_server
  start_server
  #wait_for_server
  #print_status
}

kill_server() {
  PID=$(server_id)
  if [[ -n $PID ]] ; then
    echo -n "Stopping server... "
    sudo kill $PID
    echo "Stopped!"
  fi
}

start_server() {
  echo "Starting server... "
  (sudo PATH=$PATH bash -c "yarn start" &)
}

wait_for_server() {
  while [[ -z $(server_id) ]] ; do
    ((c++)) && ((c==10)) && break
    sleep 1
  done
}

print_status() {
  if [[ -z $(server_id) ]] ; then
    echo "Could not start"
    echo
  fi
}

server_id() {
  sudo lsof -i :80 | awk '{print $2}' | tail -1
}

if [[ $0 == "$BASH_SOURCE" ]] ; then
  main
fi
