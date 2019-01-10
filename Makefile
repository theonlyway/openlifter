.PHONY: build-deps dev-electron dev-web package test check less

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

build-deps: node_modules build/bootstrap-custom.css

dev-electron: build-deps
	yarn run electron-dev

dev-web: build-deps
	yarn run start

package: build-deps
	yarn run electron-pack

test: build-deps
	CI="yes" yarn run test

less:
	yarn run lessc src/bootstrap-custom/bootstrap.less build/bootstrap-custom.css

# A simple target to run all the CI server tests.
# TODO: Doesn't detect compile warnings yet.
check:
	yarn run flow check
	yarn run lint
	CI="yes" yarn run test
