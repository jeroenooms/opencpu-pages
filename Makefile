###
# sudo apt-get install ruby-full jekyll discount
# sudo gem install rdiscount
#

all: build

build:
	@echo "Compiling and Compressing Less and CSS files with Recess..."
	@recess --compress _assets/pages.less > css/pages.css
	@echo "Running jekyll..."
	@jekyll _site
	@echo "Done."
