FROM ruby:latest

RUN apt-get update -qq
RUN apt-get install -y nodejs

ADD Gemfile* /app/
WORKDIR /app
RUN bundle install
