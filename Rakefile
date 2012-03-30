# encoding: utf-8

require 'rubygems'
require 'bundler'
begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end
require 'rake'

require 'jeweler'
Jeweler::Tasks.new do |gem|
  # gem is a Gem::Specification... see http://docs.rubygems.org/read/chapter/20 for more options
  gem.name = "geo-autocomplete"
  gem.homepage = "http://github.com/kristianmandrup/geo-autocomplete"
  gem.license = "MIT"
  gem.summary = %Q{Geo-autocomplete for Rails 3.1+}
  gem.description = %Q{Geo-autocomplete wrapped as a Rails 3 engine for easy use}
  gem.email = "kmandrup@gmail.com"
  gem.authors = ["Kristian Mandrup"]
  # dependencies defined in Gemfile
end
Jeweler::RubygemsDotOrgTasks.new

