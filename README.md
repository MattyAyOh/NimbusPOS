
Custom POS System for Nimbus

One webpage, split into two parts

Left part is "Room Buttons", right part is "Room Bill"

Pressing a Room Button changes the Room Bill to the corresponding Room

Current System:
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
```

Start the server:

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
