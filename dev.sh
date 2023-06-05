#!/bin/bash


trap ctrl_c INT


function run() {
    docker compose --env-file ./.env up -d 
    docker compose logs -t -f app-supplier app-store app-documentation
}

function prompt_for_install_docker() {
    read -p "Do you want to install Docker? (yes/no) " ans
    if [[ $ans == 'yes' || $ans == 'no' ]];
    then
        return $([ $ans == 'yes' ])
    else
        request_for_install_docker
    fi
}



function install_docker() {
    [ $USER != 'root' ] && echo "run script with sudo command" && exit 0
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sh /tmp/get-docker.sh
    rm /tmp/get-docker.sh
    return 1
}

function fix_permissions() {
    sudo groupadd docker
    sudo usermod -aG docker $(logname)
    sudo chown "$(logname)":"$(logname)" /home/$(logname)/.docker -R
    sudo chmod g+rwx "/home/$(logname)/.docker" -R
    su $(logname)
}


function is_docker_installed() {
    return $([ ! -z $(which docker) ])
}

function ctrl_c() {
        echo 'Shutting Down Services'
        docker compose --env-file ./.env down
        exit 0
}
! is_docker_installed && prompt_for_install_docker === 'yes' && install_docker

is_docker_installed && run