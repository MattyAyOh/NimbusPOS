FROM ruby:latest

RUN apt-get update -qq
RUN apt-get install -y nodejs

ADD Gemfile* /app/
WORKDIR /app
RUN bundle install

ADD . /app/

RUN useradd -m myuser
USER myuser

CMD rails s -b 0.0.0.0 -p $PORT
