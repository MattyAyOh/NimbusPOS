# Nimbus: Point of Sale

## Start the app (development):

Set up the database:

```shell
cd server
bundle exec rake db:create db:migrate db:seed
```

Run the server
```shell
cd server
rails s -p 3000
```

You'll need to edit `package.json`,
and change the `"proxy" option to match the server's port.

```
  "proxy": "http://localhost:3000/",
```

Finally...

```shell
yarn install
yarn start
```

## View application logs:
## Stop the app:
## Back up the database:
## Restore a backed-up database:
## Wipe the application database:
## Deploy the application to DigitalOcean (staging):
## Deploy the application to DigitalOcean (production):
