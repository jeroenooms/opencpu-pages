# INSTALL ON OSX:
# See https://pages.github.com/versions/
# sudo gem install jekyll -v 2.4
# sudo gem install rdiscount -v 2.1.8
# sudo gem jekyll-redirect-from rdiscount
# brew install node
# npm install -g recess

### UBUNTU 13.10 or higher:
# sudo apt-get install npm nodejs nodejs-legacy
# sudo apt-get install ruby-full jekyll discount
# sudo gem install rdiscount
# sudo npm install -g recess

all: build

build:
	@echo "Compiling and Compressing Less and CSS files with Recess..."
	@recess --compress _assets/pages.less > css/pages.css
	@echo "Running jekyll..."
	@jekyll build --future true
	@echo "Done."
