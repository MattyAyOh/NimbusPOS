FROM ruby:latest

RUN apt-get update -qq

# Install Ruby dependencies
ADD Gemfile* /app/
WORKDIR /app
RUN bundle install

ADD . /app/

# Always `bundle exec ...` our commands,
# to make sure we're using the right versions of our dependencies.
ENTRYPOINT ["bundle", "exec"]

# Default startup command
CMD rails s -b 0.0.0.0 -p $PORT
