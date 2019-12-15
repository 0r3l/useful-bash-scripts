#!/bin/sh

function main() {
  read_bastion_ip
  while [ -z "$bastion_env" ]; do read_bastion_ip; done
  remoteLs
  read_to_path_optional
  echo "fetching requested file..."
  scp -i ~/.ssh/id_rsa ${username}@${bastion_ip}:${from_path} ${to_path}
}

function remoteLs(){
 echo "connecting to remote machine..."
 ssh ${username}@${bastion_ip} /bin/bash << EOF
    cd ${from_path}
    ls -ltr
EOF
while [ -z "$file_name" ]; do read -p "Enter file name from remote machine : " file_name ; done
from_path="${from_path}/${file_name}"
}

function read_to_path_optional(){
  default_to_path=~/ftp/
  read -p "Enter to copy to (local) [${default_to_path}] : " to_path
  to_path=${to_path:-${default_to_path}}
}

function read_bastion_ip(){
  read -p "Enter env (bstg | bprod | mptest) : " bastion_env
  case "$bastion_env" in
    mptest) bastion_ip=52.170.99.9 from_path="~/marketplace-e2e/logs"  username="iotlogin" ;;
    bstg) bastion_ip=54.183.232.173 from_path="/data/db-backup" username="deploy" ;;
    bprod) bastion_ip=13.57.95.208 from_path="/data/db-backup"  username="deploy" ;;
    *) echo "invalid env"; exit;;
  esac
}

main
