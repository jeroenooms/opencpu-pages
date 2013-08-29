---
layout: post
title: "Knitr/Markdown OpenCPU App"
category: posts
description: A new little OpenCPU app allows you to knit and markdown in the browser. It has a fancy pants code editor which automatically updates the output after 3 seconds of inactivity.
cover: "containers.jpg"
---

A new little OpenCPU app allows you to knit and markdown in the browser. 
It has a fancy pants code editor which automatically updates the output after 3 seconds of inactivity.
It uses the <a href="http://ace.c9.io/">Ace</a> web editor with <a href="https://github.com/ajaxorg/ace-builds/blob/master/src/mode-r.js"><code>mode-r.js</code></a> (thanks to RStudio for making the latter available).

Like all OpenCPU apps, the source package lives in the <a href="https://github.com/opencpu">opencpu app repo</a> on github.
You can try it out on the <a href="https://public.opencpu.org/apps.html">public cloud server</a>, or run it locally:

{% highlight r %}
#install the package
library(devtools)
install_github("markdownapp", "opencpu")

#open it in opencpu
library(opencpu)
opencpu$browse("/library/markdownapp/www")
{% endhighlight %}


The app uses the knitr R package and a some standard javascript libraries.
What remains is a <a href="https://github.com/opencpu/markdownapp/blob/master/inst/www/index.html">few lines of javascript</a>
to call OpenCPU when the editor is inactive. The entire app was created in about an hour. Feel free to fork and modify :-)
