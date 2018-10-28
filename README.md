# Nimbus: Point of Sale

## Start the app (development):

```shell
docker-compose up -d
```

Set up the database:

```shell
docker-compose run web rake db:create db:migrate db:seed
```

## Deploy the application on an Ubuntu server:

SSH into the server, and run:

```
git clone https://github.com/mattyayoh/nimbuspos.git ~/nimbuspos
```

Then, follow the steps in the next section to start up the server.

## Update the application on an Ubuntu server:

SSH into the server, and run:

```
cd ~/nimbuspos/ && git pull
cd ~/nimbuspos/ && yarn
cd ~/nimbuspos/ && yarn build
rm -rf ~/nimbuspos/server/public/{asset-manifest.json,index.html,service-worker.js,favicon.ico,manifest.json,static}
mv ~/nimbuspos/build/* ~/nimbuspos/server/public/
rm ~/nimbuspos/server/tmp/pids/server.pid
cd ~/nimbuspos/server &&
bundle exec rake db:migrate
cd ~/nimbuspos/server &&
bundle exec rails s -p 80 -b 0.0.0.0 -d
```

## View application logs:
## Stop the app:
## Back up the database:
## Restore a backed-up database:
## Wipe the application database:
