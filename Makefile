.PHONY: dev-electron dev-web package

all: package

node_modules:
	yarn

dev-electron: node_modules
	yarn run electron-dev

dev-web: node_modules
	yarn run start

package: node_modules
	yarn run electron-pack
