#!/bin/sh

function enableproxy() {
  proxy_url=http://sub.proxy.att.com:8080/
  export HTTP_PROXY=${proxy_url}
  export HTTPS_PROXY=${proxy_url}
  export http_proxy=$HTTP_PROXY
  export https_proxy=$HTTPS_PROXY
  export no_proxy=localhost  
  git config --global http.proxy ${proxy_url}
  git config --global https.proxy ${proxy_url}
  npm config set proxy ${proxy_url}
}

enableproxy
