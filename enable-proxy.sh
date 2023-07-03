#!/bin/zsh

proxy_url=http://01uklopxy00.pst.cso.att.com:8080
echo "export $proxy_url to HTTP_PROXY,HTTPS_PROXY,http_proxy,https_proxy no_proxy=localhost"
export PATH=$HOME/development/flutter/bin:$PATH
export HTTP_PROXY=${proxy_url}
export HTTPS_PROXY=${proxy_url}
export http_proxy=$HTTP_PROXY
export https_proxy=$HTTPS_PROXY
export no_proxy=localhost
echo "set git config http.proxy, https.proxy"
git config --global http.proxy ${proxy_url}
git config --global https.proxy ${proxy_url}
echo "set npm config proxy to $proxy_url"
npm config set proxy ${proxy_url}