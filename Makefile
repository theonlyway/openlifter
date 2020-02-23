.PHONY: build-deps dev-electron dev-web package test check less build clean veryclean

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

# Builds the project into public/. Overwrites git files -- need to reset after.
release: build
	rm -rf public/
	cp --dereference -r build/ public
	echo "Built into public/. Don't forget to set a git tag!"

# Builds the project into build/.
build:
	make less
	yarn run build

# A simple target to run all the CI server tests.
check:
	yarn run tsc --noEmit
	yarn run lint
	CI="yes" yarn run test

clean:
	rm -rf build
	$(MAKE) -C website clean

veryclean: clean
	rm -rf node_modules
