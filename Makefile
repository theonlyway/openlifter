.PHONY: dev-electron dev-web package test

all: package

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
