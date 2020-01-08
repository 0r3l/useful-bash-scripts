#!/bin/sh

function enableproxy() {
  export HTTP_PROXY=http://one.proxy.att.com:8080
  export HTTPS_PROXY=http://one.proxy.att.com:8080
  export http_proxy=$HTTP_PROXY
  export https_proxy=$HTTPS_PROXY
  git config --global http.proxy http://one.proxy.att.com:8080
  git config --global https.proxy http://one.proxy.att.com:8080
  npm config set proxy http://one.proxy.att.com:8080
}

enableproxy
