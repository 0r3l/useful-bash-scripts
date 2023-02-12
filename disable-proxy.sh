function disableproxy() {
  export HTTP_PROXY=
  export HTTPS_PROXY=
  export http_proxy=$HTTP_PROXY
  export https_proxy=$HTTPS_PROXY
  git config --global --unset http.proxy
  git config --global --unset https.proxy
  npm config delete proxy
}

disableproxy
