FROM selenium/standalone-chrome
# ...alternatively, consider `selenium/standalone-firefox`

USER root

RUN apt-get update -qq

# nokogiri requirements
# See http://www.nokogiri.org/tutorials/installing_nokogiri.html
RUN apt-get install -y \
  build-essential \
  liblzma-dev \
  patch \
  zlib1g-dev

# Get an up-to-date ruby version
WORKDIR /src
ADD https://github.com/postmodern/ruby-install/archive/v0.7.0.tar.gz /src/
RUN tar -xzvf /src/v0.7.0.tar.gz
WORKDIR /src/ruby-install-0.7.0/
RUN make install
RUN ruby-install ruby 2.5.3
ENV PATH $PATH:/opt/rubies/ruby-2.5.3/bin/

# Install Ruby dependencies
RUN gem install bundler
ADD Gemfile* /spec/
WORKDIR /spec
RUN bundle install

USER seluser

ADD . /spec/

# Always `bundle exec ...` our commands,
# to make sure we're using the right versions of our dependencies.
ENTRYPOINT ["bundle", "exec"]

# Default startup command
CMD rspec
