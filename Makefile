.PHONY: dev-electron dev-web package test check less

all: dev-web

############################################
# Real build targets.
############################################

node_modules:
	yarn

build/bootstrap-custom.css: node_modules src/bootstrap-custom/bootstrap.less
	yarn run lessc src/bootstrap-custom/bootstrap.less build/bootstrap-custom.css

############################################
# Helpers.
############################################

dev-electron: node_modules
	yarn run electron-dev

dev-web: node_modules
	yarn run start

package: node_modules
	yarn run electron-pack

test: node_modules
	CI="yes" yarn run test

less:
	yarn run lessc src/bootstrap-custom/bootstrap.less build/bootstrap-custom.css

# A simple target to run all the CI server tests.
# TODO: Doesn't detect compile warnings yet.
check:
	yarn run flow check
	yarn run lint
	CI="yes" yarn run test
