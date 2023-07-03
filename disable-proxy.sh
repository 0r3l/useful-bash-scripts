function disableproxy() {
  echo "export <empty> to HTTP_PROXY,HTTPS_PROXY,http_proxy,https_proxy no_proxy=localhost"
  export HTTP_PROXY=
  export HTTPS_PROXY=
  export http_proxy=$HTTP_PROXY
  export https_proxy=$HTTPS_PROXY
  echo "unset git config http.proxy, https.proxy"
  git config --global --unset http.proxy
  git config --global --unset https.proxy
  echo "delete npm config proxy"
  npm config delete proxy
}

disableproxy
