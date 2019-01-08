.PHONY: dev-electron dev-web package test check

all: dev-web

node_modules:
	yarn

dev-electron: node_modules
	yarn run electron-dev

dev-web: node_modules
	yarn run start

package: node_modules
	yarn run electron-pack

test: node_modules
	CI="yes" yarn run test

# A simple target to run all the CI server tests.
# TODO: Doesn't detect compile warnings yet.
check:
	yarn run flow check
	yarn run lint
	CI="yes" yarn run test
