FROM ruby:latest

RUN apt-get update -qq

# Install the latest version of nodeJS
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Install `yarn` for managing JS dependencies
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn

# Install Ruby dependencies
ADD Gemfile* /app/
WORKDIR /app
RUN bundle install

# Install JS dependencies
ADD package.json yarn.lock /app/
RUN yarn install
RUN yarn check && yarn check --integrity

# Compile for production
ADD . /app/
RUN RAILS_ENV=production NODE_ENV=production rake assets:precompile

# Heroku doesn't let us run as `root`, so we need to run as a different user
RUN useradd -m application
RUN chown -R application /app
USER application

# Default startup command
CMD rails s -b 0.0.0.0 -p $PORT
