.PHONY: all rusty build clean releases

# Start the development server.
all: rusty releases
	hugo server --i18n-warnings --disableFastRender

# Build for deployment to a website.
build: rusty releases
	hugo --i18n-warnings --cleanDestinationDir

# Builds the "Rusty" theme.
rusty:
	make -C themes/rusty

# Puts the /releases directory into /website/static/releases.
# Normally we could just use a symlink, but Go (which Hugo is written in)
# does not support symlink traversal.
#
# The .gitignore knows to ignore /website/static/releases.
releases:
	rm -rf static/releases
	cp -r ../releases static/releases

clean:
	rm -rf public
	make -C themes/rusty clean
