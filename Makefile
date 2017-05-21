# INSTALL ON OSX:
# See https://pages.github.com/versions/
# Use github-bundle for the right versions: https://help.github.com/articles/using-jekyll-with-pages/#installing-jekyll
# sudo gem install bundler
# 
# Run inside repo (once)
# bundle install

all: build

build:
	@echo "Compiling and Compressing Less and CSS files with Recess..."
	@recess --compress _assets/pages.less > css/pages.css
	@echo "Running jekyll..."
	@open "file://$(PWD)/_site/blog.html"
	@bundle exec jekyll build --watch
	@echo "Done."

serve:
	rm -Rf _site
	bundle exec jekyll serve --watch --incremental
