#!/usr/bin/env bash

sudo apt-get update

echo "
----------------------
NGINX
----------------------
"

sudo apt-get install -y nginx
sudo systemctl enable nginx

echo "
----------------------
USERS/GROUPS
----------------------
"

if id www > /dev/null 2>&1 #if the user www exists
then
	echo "user exists"
else #init user www and group www-dev
	sudo groupadd -f www-dev
	sudo useradd -G www-dev www
	sudo usermod -a -G www-dev $USER
fi

echo "
----------------------
GIT
----------------------
"

sudo apt-get install git

sudo rm -rf /var/www/production #clear folder
sudo mkdir -p /var/www/production
cd /var/www/production

if [ ${PWD} != /var/www/production ]; then #check to make sure we are in correct directory
	exit 1
fi

sudo git clone https://github.com/Lunatic-Labs/LU-Overview.git .

echo "
----------------------
NVM
----------------------
"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install

exec bash #let us use node/npm

sudo chown -R www:www-dev /var/www/production #change permissions to www-dev
sudo chmod -R g+rwx /var/www/production

echo "
----------------------
PM2
----------------------
"

npm install -g pm2

#uglyness because it will not automaticly execute the command
pm2 startup systemd | grep sudo | bash

echo "
----------------------
NODE MODULES
----------------------
"

cd /var/www/production/client
npm install

cd /var/www/production/server
npm install
cd /var/www/production

echo "
----------------------
STARTING
----------------------
"

pm2 start

sudo /usr/sbin/nginx -c /var/www/production/nginx.conf #configure nginx to use config