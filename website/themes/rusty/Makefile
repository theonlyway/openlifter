.PHONY: all css clean

all: css

# Build Bootstrap code from the main OpenLifter node_modules/ repo.
css:
	yarn run lessc website/themes/rusty/src/bootstrap.less website/themes/rusty/static/css/rusty.css --clean-css="--advanced"

clean:
	rm static/css/rusty.css
