---
layout: post
title: "The 'rsvg' Package: High Quality Image Rendering in R"
category: posts
description: "The new rsvg package renders (vector based) SVG images into high-quality bitmap arrays. The resulting image can be written to e.g. png, jpeg or webp format."
cover: "containers.jpg"
thumb: "tiger.png"
---

The new [rsvg](https://cran.r-project.org/web/packages/rsvg/index.html) package renders (vector based) SVG images into high-quality bitmap arrays. The resulting image is an array of 3 dimensions: height * width * 4 (RGBA) and can be written to png, jpeg or webp format:

{% highlight r %}
# create an svg image
library(svglite)
library(ggplot2)
svglite("plot.svg", width = 10, height = 7)
qplot(mpg, wt, data = mtcars, colour = factor(cyl))
dev.off()

# render it into a bitmap array
library(rsvg)
bitmap <- rsvg("plot.svg")
dim(bitmap)
## [1] 504 720   4

# write to format
png::writePNG(bitmap, "bitmap.png")
jpeg::writeJPEG(bitmap, "bitmap.jpg", quality = 1)
webp::write_webp(bitmap, "bitmap.webp", quality = 100)
{% endhighlight %}

The advantage of storing your plots in svg format is they can be rendered later into an arbitrary resolution and format ***without loss of quality***! Each rendering fucntion takes a `width` and `height` parameter. When neither width or height is set bitmap resolution matches that of the input svg. When either width or height is specified, the image is scaled proportionally. When both width and height are specified, the image is stretched into the requested size. For example suppose we need to render the plot into ultra HD so that it is crisp as toast when printed a conference poster:

{% highlight r %}
# render it into a bitmap array
bitmap <- rsvg("plot.svg", width = 3840)
png::writePNG(bitmap, "plot_4k.png", dpi = 144)
browseURL("plot_4k.png")
{% endhighlight %}

Rather than actually dealing with the bitmap array in R, rsvg also allows you to directly render the image to various output formats, which is slighly faster. 

{% highlight r %}
# render straight to output format
rsvg_pdf("plot.svg", "out.pdf")
rsvg_ps("plot.svg", "out.ps")
rsvg_svg("plot.svg", "out.svg")
rsvg_png("plot.svg", "out.png")
rsvg_webp("plot.svg", "out.svg")
{% endhighlight %}

Added bonus is that librsvg does not only do a really good job rendering, it is also super fast. It would even be fast enough to render the svg [tiger](http://dev.w3.org/SVG/tools/svgweb/samples/svg-files/tiger.svg) on the fly at 10~20fps!

{% highlight r %}
download.file("http://dev.w3.org/SVG/tools/svgweb/samples/svg-files/tiger.svg", "tiger.svg")
system.time(bin <- rsvg_raw("tiger.svg"))
#   user  system elapsed
#  0.048   0.003   0.057
system.time(rsvg_webp("tiger.svg", "tiger.webp"))
#    user  system elapsed
#  0.097   0.006   0.115
{% endhighlight %}

Note the `webp` format is the new high-quality image format by Google which I will talk about in [another post](../webp-release).
