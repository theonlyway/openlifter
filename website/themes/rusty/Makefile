.PHONY: all css clean

all: css

# Build Bootstrap code from the main OpenLifter node_modules/ repo.
# The resultant rusty.css is ignored by the repo .gitignore.
css:
	mkdir -p static/css
	yarn run node-sass --linefeed lf --output-style compressed website/themes/rusty/src/rusty.scss -o website/themes/rusty/static/css/

clean:
	rm -f static/css/rusty.css
