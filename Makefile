all: build

build:
	@echo "Compiling and Compressing Less and CSS files with Recess..."
	@recess --compress _assets/pages.less > pages.css
	@echo "Done."
