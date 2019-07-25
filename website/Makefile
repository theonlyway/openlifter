.PHONY: all rusty build clean

all: rusty
	hugo server --disableFastRender

build: rusty
	hugo --cleanDestinationDir

rusty:
	make -C themes/rusty

clean:
	rm -rf public
	make -C themes/rusty clean
