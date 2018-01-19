#!/usr/bin/env bash

ARGS=$*

function main() {
  set -e  # Exit if any command fails
  verify_commands_installed
  cd $(dirname $0)
  if [[ ${ARGS} == *--prod* ]]; then
    start_prod_server
  else
    start_dev_server
  fi
}

function verify_commands_installed() {
  if ! command_exists ng || ! command_exists nodemon; then
    echo "Ensure both ng and nodemon are installed globally:"
    echo "    npm install -g @angular/cli nodemon"
    exit 1
  fi
}

function command_exists() {
  command -v "$1" >/dev/null
}

function start_prod_server() {
  if ! command_exists sudo && ! cygwin_run_as_administrator; then
    echo "Cygwin must be run as administrator"
    exit 1
  fi

  ng build --prod --aot

  if command_exists sudo; then
    echo -e "\nUsing system port requires sudo privileges"
    sudo PORT=443 node server.js
  else
    PORT=443 node server.js
  fi
}

function cygwin_run_as_administrator() {
  id --groups | grep --quiet --extended-regexp '\<(114|544)\>'
  return $?
}

function start_dev_server() {
  nodemon &
  trap "kill $!" EXIT SIGINT SIGKILL  # Kill all child process if this process is stopped/ends
  ng serve --open
}

main
