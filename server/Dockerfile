FROM ruby:latest

RUN apt-get update -qq

# Install Ruby dependencies
ADD Gemfile* /app/
WORKDIR /app
RUN bundle install

ADD . /app/

# Heroku doesn't let us run as `root`, so we need to run as a different user
RUN useradd -m application
RUN chown -R application /app
USER application

# Always `bundle exec ...` our commands,
# to make sure we're using the right versions of our dependencies.
ENTRYPOINT ["bundle", "exec"]

# Default startup command
CMD rails s -b 0.0.0.0 -p $PORT
