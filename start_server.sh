#!/usr/bin/env bash

ARGS=$*

function main() {
  set -e  # Exit if any command fails
  cd $(dirname $0)
  if [[ ${ARGS} == *--prod* ]]; then
    start_prod_server
  else
    start_dev_server
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

  ./build.sh

  if command_exists sudo; then
    echo -e "\nUsing system port requires sudo privileges"
    sudo NODE_ENV=production node server.js
  else
    NODE_ENV=production node server
  fi
}

function cygwin_run_as_administrator() {
  id --groups | grep --quiet --extended-regexp '\<(114|544)\>'
}

function start_dev_server() {
  mkdir --parent logs
  touch logs/server.log logs/error.log
  $(npm bin)/nodemon > >(tee -a logs/server.log) 2> >(tee -a logs/error.log >&2) &
  trap "kill $!" EXIT SIGINT SIGKILL  # Kill all child process if this process is stopped/ends
  $(npm bin)/ng serve --open > >(tee -a logs/server.log) 2> >(tee -a logs/error.log >&2)
}

main
