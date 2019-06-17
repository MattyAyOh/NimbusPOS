# Nimbus: Point of Sale

## Roadmap

This project is long-running and storied,
from its initial design and implementation by Erika Smith in November 2017
through the great data extinction event of May 2019,
up to its current phase, outlined here.

In addition to tracking customer sales
every day at the Nimbus lounge in East Lansing, MI,
this software is a testbed for new technologies by Assemble LLC.

The overarching goal is "code-free" open-source web software.
This is easier said than done.

### History

* Nov 2017: Initial development begins as a Ruby on Rails application.
* Feb 2018: Front-end markup templates are removed and replaced by React
* May 2018: A clean break between front-end view logic, and a back-end API
* Jul 2018: Standardize on Mobx for managing client state
* Sep 2018: Add a page at `/bigscreen` as a customer-facing menu
* Apr 2019: Use a generic "Foundation" container to execute arbitrary API code
            This removes the admin dashboard provided by [Administrate].
* Apr 2019: Standardize on Luxon for handling dates and times
* May 2019: Standardize on Aviator for high-level URL logic
* Jun 2019: Build from scratch a new admin dashboard, focused on sales metrics

[Administrate]: https://administrate-prototype.herokuapp.com

### Current Situation

This application now runs on a virtual private server, hosted by DigitalOcean.
As our server is at the low-power end of their offerings,
we are consistently butting up against the machine's memory threshold.

There is no system in place for backing up data or restoring after a crash,
a fact that has already bitten us when we upgraded to the "Foundation" design.

The "Foundation" is an attempt to provide a generic API server
on top of an arbitrary database.
To achieve this, this codebase contains small amounts of Ruby-on-Rails code
in the `models/` and `db/` directories,
and on startup mounts those directories into the `foundation` docker container.
The foundation is a Ruby on Rails process that silently picks up our data model.

This architecture, while a hodge-podge of different approaches
that is not recommended for serious use,
has allowed us to move *nearly* all of the application's logic
into the front-end-oriented `src/` directory.
With the benefits of automatic reloading in development,
this seriously reduces the effort required to develop new features.
It also in many cases allows new feature development
to run against the production database,
with the flip of a single environment variable.

However, this approach has drawbacks.
It is, flatly, not secure.

Since the foundation will execute arbitrary code passed to it from the client,
an arbitrary code execution attack is a trivial exercise.
This has been judged as an acceptable risk, given the obscurity of the project
and the specific value of the application's contents,
which will likely not appeal to malicious attackers.

### Future Moves

To address the security, performance, and reliability concerns
of the Assemble Foundation docker image hosted on DigitalOcean,
we plan to migrate to a GraphQL interface provided by [Hasura].

Hasura gives us a clean, lightweight layer on top of our database.
It replaces the hodgepodge of Rails-in-JS code that we've built
with the industry-standard Graph Query Language.

This migration will be carried out in a few steps:

* [ ] Add Hasura to the project as a container in `docker-compose.yml`.
      Hasura will run in parallel with the existing Assemble Foundation,
      giving us two APIs to program against.
* [ ] [0/1] Replace each `network.watch` API call with a GraphQL `subscription`.
* [ ] [0/6] Replace each `network.run` API call
            with a GraphQL `query` or `mutation`.
* [ ] At this point, the GraphQL interface completely bypasses the Foundation.
      Remove the Assemble Foundation service from `docker-compose.yml`.

Following this change, the application will conform in large part to the
[three-factor application architecture].

Any server-side code to execute will be programmed and integrated
against Hasura webhooks.

From this point, we may elect to move to Heroku processes to host the site,
for the benefits of managed database backups and automated deployments.

[Hasura]: https://hasura.io/
[three-factor application architecture]: https://3factor.app

## Operational Notes

### Start the app (development):

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

### View application logs:
### Stop the app:
### Back up the database:
### Restore a backed-up database:
### Wipe the application database:
### Deploy the application to DigitalOcean (staging):
### Deploy the application to DigitalOcean (production):
