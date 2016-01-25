---
layout: post
title: "Using webp in R: A New Format for Lossless and Lossy Image Compression"
category: posts
description: ""
cover: "containers.jpg"
thumb: "pancake.jpg"
---

A while ago I blogged about [brotli](../brotli-benchmarks), a new general purpose compression algorithm promoted by Google as an alternative to gzip. The same company also happens to be working on a new format for images called [webp](https://developers.google.com/speed/webp), which is actually a derivative of the VP8 video format. Google claims webp provides superior compression for both lossless (png) and lossy (jpeg) bitmaps, and even though the format is currently only supported in Google Chrome, it seems indeed promising.

The [webp](https://cran.rstudio.com/web/packages/webp/) R package allows for reading/writing webp bitmap arrays so that we can convert between other bitmap formats. For example, let's take this photo of a delicious and nutritious [feelgoodbyfood](https://www.instagram.com/feelgoodbyfood/) spelt-pancake with coconut sprinkles and homemade espresso (see [here](https://www.feelgoodbyfood.nl/7x-winters-ontbijt) for 7 other healthy winter breakfasts!)

<img src="../../images/pancake.jpg" class="img-responsive">

We read the jpeg file into a bitmap and then write it to webp:

{% highlight r %}
library(webp)
library(jpeg)
library(curl)
curl_download("https://www.opencpu.org/images/pancake.jpg", "pancake.jpg")
bitmap <- readJPEG("pancake.jpg")
write_webp(bitmap, "pancake.webp")

# Only works in Google Chrome
browseURL("pancake.webp")
{% endhighlight %}

Of course it works the other way around as well. To read the webp image back into a bitmap and write it to png:

{% highlight r %}
library(png)
bitmap2 <- read_webp("pancake.webp")
writePNG(bitmap2, "pancake.png")
browseURL("pancake.png")
{% endhighlight %}

## Rendering graphics to webp

The best way to write plots in webp format is using an svg device and then render to bitmap with the [rsvg package](../svg-release):

{% highlight r %}
# create an svg image
library(svglite)
library(ggplot2)
svglite("plot.svg", width = 10, height = 7)
qplot(mpg, wt, data = mtcars, colour = factor(cyl))
dev.off()

# render it into a high definition bitmap image
library(rsvg)
rsvg_webp("plot.svg", "plot.webp", width = 1920)
browseURL("plot.webp")
{% endhighlight %}

The `write_webp` function has a `quality` parameter (integer between 1 and 100) which can be used to tune the quality-size trade-off for lossy compression. A `quality=100` equals lossless compression; the default `quality=80` provides considerable size reduction with negligible loss of quality.

{% highlight r %}
library(rsvg)
library(webp)
tiger <- rsvg("http://dev.w3.org/SVG/tools/svgweb/samples/svg-files/tiger.svg", height = 720)
write_webp(tiger, "tiger100.webp", quality = 100)
write_webp(tiger, "tiger80.webp", quality = 80)
write_webp(tiger, "tiger50.webp", quality = 50)
{% endhighlight %}

Unfortunately webp will probably not become mainstream until it gets implemented by all browsers. But performance seems pretty good so perhaps it could actually be useful for large image compression in scientific applications.
