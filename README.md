# Nimbus: Point of Sale

Custom POS System for booking time-priced resources,
such as Karaoke rooms.

## Previous System

Manual Time Sheets: [NimbusTimeSheets.pdf](https://github.com/MattyAyOh/NimbusPOS/files/1456983/NimbusTimeSheets.pdf)
Data Entry: [export.pdf](https://github.com/MattyAyOh/NimbusPOS/files/1456982/export.pdf)

Rough Mockup:
![](https://i.imgur.com/tf3qA2u.png)

## Development

Install Docker:

```
brew cask install virtualbox
brew install docker docker-machine docker-compose
docker-machine create --driver VirtualBox default
docker-machine start
eval $(docker-machine env)
```

Set up the database:

```
./bin/docker-compose run --rm web rake db:create
./bin/docker-compose run --rm web rake db:migrate
./bin/docker-compose run --rm web rake db:seed
```

Start the app:

```
./bin/docker-compose up -d
```

Stream the logs (Rails, database, or both):

```
# Rails logs
./bin/docker-compose logs -f web
# Database logs
./bin/docker-compose logs -f db
# All logs
./bin/docker-compose logs -f
```

Stop server without wiping the database:

```
./bin/docker-compose stop
./bin/docker-compose rm -f web
```

Stop the server, wipe the database:

> After this, you'll need to repeat the "Set up the database" step
> before you run the app again.

```
./bin/docker-compose down
```

## Deploy

This app is hosted at https://nimbuspos.herokuapp.com.

Connect to an existing Heroku app:

```
git remote add heroku git@heroku.com:nimbuspos.git
```

or create a new Heroku app:

```
./bin/new_heroku_app my_new_heroku_app
```

Deploy with:

```
./bin/deploy
```

## Development

During development, run the frontend code natively for fast webpage reloads:

```
docker-compose up -d
cd frontend && yarn start
```

You'll need to edit `frontend/package.json`,
and change the `"proxy" option:

```
  "proxy": "http://localhost:3001/",
```
