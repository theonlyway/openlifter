all: web

############################################
# Real build targets.
############################################

node_modules:
	yarn

############################################
# Helpers.
############################################

.PHONY: build-deps
build-deps: node_modules

# Launch a desktop version of OpenLifter with the Tauri runtime.
# Refer to https://tauri.studio/en/docs/getting-started/intro.
# Tauri sources HTML/CSS/JS files from public/, so we build that first.
.PHONY: tauri
tauri: release-web
	yarn tauri dev

# Build a release version of Tauri.
# Tauri sources HTML/CSS/JS files from public/, so we build that first.
#
# This embeds our web assets into a single binary with the Rust Tauri code.
# - The binary goes into src-tauri/target/release/[app name].
# - The installer goes into src-tauri/target/release/bundle.
release-tauri: release-web
	yarn tauri build

.PHONY: electron
electron: build-deps
	yarn run electron-dev

web: build-deps
	yarn run start

.PHONY: release-electron
release-electron: build-deps
	yarn run electron-pack

# Builds the project into public/. Overwrites git files -- need to reset after.
.PHONY: release-web
release-web: build
	rm -rf public/
	cp --dereference -r build/ public
	echo "Built into public/. Don't forget to set a git tag!"

# Builds the project into build/.
.PHONY: build
build: build-deps
	yarn run build

# Overwrites settings in package.json to allow the Beta site's Router
# to function correctly when deployed in production.
.PHONY: apply-beta-basename
apply-beta-basename:
	sed -i 's;"homepage": "./";"homepage": "https://www.openlifter.com/releases/beta/";' package.json
	sed -i 's;"router_basename": "/";"router_basename": "/releases/beta/";' package.json

# Runs JS tests.
.PHONY: test
test: build-deps
	CI="yes" yarn run test

# A simple target to run all the CI server tests.
.PHONY: check
check:
	yarn run tsc --noEmit
	yarn run lint
	CI="yes" yarn run test

.PHONY: clean
clean:
	rm -rf build
	$(MAKE) -C website clean
	cd src-tauri && cargo clean || true

.PHONY: veryclean
veryclean: clean
	rm -rf node_modules
