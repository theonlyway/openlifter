.PHONY: build-deps dev-electron dev-web package test check less gitlab-pages clean veryclean

all: dev-web

############################################
# Real build targets.
############################################

node_modules:
	yarn

############################################
# Helpers.
############################################

build-deps: node_modules

dev-electron: build-deps
	yarn run electron-dev

dev-web: build-deps
	yarn run start

package: build-deps
	yarn run electron-pack

test: build-deps
	CI="yes" yarn run test

release: gitlab-pages
	echo "Built into public/. Don't forget to set a git tag!"

# Builds the project into public/. Overwrites git files -- need to reset after.
gitlab-pages:
	make less
	yarn run build
	rm -rf public/
	cp --dereference -r build/ public

# A simple target to run all the CI server tests.
# TODO: Doesn't detect compile warnings yet.
check:
	yarn run lint
	CI="yes" yarn run test

clean:
	rm -rf build
	$(MAKE) -C website clean

veryclean: clean
	rm -rf node_modules
