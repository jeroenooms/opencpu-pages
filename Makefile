# The node/npm deb package changed recently
#
### UBUNTU 13.10 or higher:
# sudo apt-get install npm nodejs nodejs-legacy
#
### Ubuntu 13.04 or lower:
# sudo add-apt-repository ppa:chris-lea/node.js
# sudo apt-get update
# sudo apt-get install nodejs
#
### Then, on any system:
# sudo apt-get install ruby-full jekyll discount
# sudo gem install rdiscount
# sudo npm install -g recess

all: build

build:
	@echo "Compiling and Compressing Less and CSS files with Recess..."
	@recess --compress _assets/pages.less > css/pages.css
	@echo "Running jekyll..."
	@jekyll build
	@echo "Done."
