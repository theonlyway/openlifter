.PHONY: all css clean

all: css

# Build Bootstrap code from the main OpenLifter node_modules/ repo.
css:
	yarn run node-sass --linefeed lf --output-style compressed website/themes/rusty/src/bootstrap.scss > static/css/rusty.css

clean:
	rm -f static/css/rusty.css
