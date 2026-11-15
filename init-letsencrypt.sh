#!/bin/bash

source .env
domain=($ARTCONNECT_DOMAIN)
rsa_key_size=4096
data_path="./nginx/certbot"
staging=0 # ako se testira

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domain. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi


# download certbot konfiguracijskih datoteka
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/refs/heads/main/certbot/src/certbot/_internal/plugins/nginx/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/refs/heads/main/certbot/src/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi


# izrada dummy self-signed certifikata da se nginx kontejner moze pokrenuti
path="/etc/letsencrypt/live/$domain"
mkdir -p "$data_path/conf/live/$domain"
docker compose -f docker-compose-prod.yaml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo


# pokretanje nginx
docker compose -f docker-compose-prod.yaml up --force-recreate -d nginx
echo


# brisanje dummy certifikata
docker compose -f docker-compose-prod.yaml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domain && \
  rm -Rf /etc/letsencrypt/archive/$domain && \
  rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
echo


# staging mod za testiranje
if [ $staging != "0" ]; then staging_arg="--staging"; fi


# izrada pravih certifikata sa certbot
docker compose -f docker-compose-prod.yaml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    --register-unsafely-without-email \
    -d $domain \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo


# gasenje kontejnera
docker compose -f docker-compose-prod.yaml down

# preuzeto s https://github.com/wmnnd/nginx-certbot