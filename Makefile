.PHONY: build-deps dev-electron dev-web package test check less gitlab-pages clean reallyclean

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

# Builds the project into public/. Overwrites git files -- need to reset after.
gitlab-pages:
	make less
	rm -f src/bootstrap-custom/bootstrap-custom.css
	cp -f build/bootstrap-custom.css src/bootstrap-custom/bootstrap-custom.css
	yarn run build
	rm -rf public/
	cp --dereference -r build/ public

# A simple target to run all the CI server tests.
# TODO: Doesn't detect compile warnings yet.
check:
	yarn run flow check
	yarn run lint
	CI="yes" yarn run test

clean:
	rm -rf build
	$(MAKE) -C website clean

reallyclean: clean
	rm -rf node_modules
