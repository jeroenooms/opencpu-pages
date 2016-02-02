---
layout: post
title: "Commonmark: Super Fast Markdown Rendering in R"
category: posts
description: "Commonmark is an initiative led by John MacFarlane at UC Berkeley (author of pandoc) to standardize the markdown syntax. Besides a specification, the commonmark team provides reference implementations for C and JavaScript."
cover: "containers.jpg"
thumb: "warpeace.jpg"
---

A few months ago I first announced the commonmark R package. Since then there have been a few more releases... time for an update!

### What is CommonMark?

Markdown is used in many places these days, however the original [spec](https://daringfireball.net/projects/markdown/syntax) actually leaves some ambiguity which makes it difficult to optimize and leads to inconsistencies between implementations. 
Commonmark is an initiative led by John MacFarlane at UC Berkeley (also the author of pandoc) to standardize the markdown syntax. 
Besides a [specification](http://spec.commonmark.org), the commonmark team provides reference implementations for C ([cmark](https://github.com/jgm/cmark)) and JavaScript ([commonmark.js](https://github.com/jgm/commonmark.js)).

The [commonmark R package](https://cran.r-project.org/web/packages/commonmark/index.html) wraps around cmark which converts markdown text into various formats, including html, latex and groff man. This makes commonmark very suitable for e.g. writing manual pages which are often stored in exactly these formats. In addition the package exposes the markdown parse tree in xml format to support customized output handling.

{% highlight r %}
# Load library
library(commonmark)

# Render some markdown
md <- readLines(curl::curl("https://raw.githubusercontent.com/yihui/knitr/master/NEWS.md"))
html <- markdown_html(md)
man <- markdown_man(md)
tex <- markdown_latex(md)

# Syntax tree
xml <- markdown_xml(md)

# Back to (standardized) markdown
cm <- markdown_commonmark(md)
{% endhighlight %}

Currently, commonmark only specifies the original markdown elements: italic, bold, headings, links, images, quotes, paragraphs, lists, horizontal rule, and code blocks. Extensions from pandoc that were introduced later on such as tables are not supported.

### CommonMark is fast

The cmark library is written in elegant C code and highly optimized. It [renders](https://github.com/jgm/cmark#readme) a Markdown version of *War and Peace* in the blink of an eye (127 milliseconds on a ten year old laptop, vs. 100-400 milliseconds for an eye blink). A simple benchmark in R confirms that our example above is converted to any of the formats in only a few milliseconds.

{% highlight r %}
library(microbenchmark)
microbenchmark(
  markdown_html = markdown_html(md),
  markdown_man = markdown_man(md),
  markdown_latex = markdown_latex(md)
)
# Unit: milliseconds
#            expr      min       lq     mean   median       uq      max neval
#   markdown_html 3.228492 3.243339 3.318437 3.263184 3.359420 3.902745   100
#    markdown_man 5.768978 5.803062 5.885971 5.862607 5.942159 6.177985   100
#  markdown_latex 5.906757 5.946995 6.049409 6.001677 6.107563 7.619014   100
{% endhighlight %}

The main benefit, besides Tolstoy saving some time on typesetting, is that cmark alows for shipping documents such as help pages in native markdown format and render them on-the-fly in html/latex/man without noticable performance overhead. This is very nice for editing and maintaining any sort of portable, dynamic documentation.

### Markdown in R documentation

Several people have independently had the idea to add support for markdown to R documentation which would be super awesome. Gábor has started a package called [maxygen](https://github.com/gaborcsardi/maxygen) which might [get merged](https://github.com/klutometis/roxygen/pull/431) into roxygen2 at some point. This allows for inserting emphasis, boldface, codeblocks, lists, links, and images in your roxygen fields using simple markdown notation rather than the ugly Rd format.

There has also been some [discussion](https://stat.ethz.ch/pipermail/r-devel/2015-May/071219.html) on the r-devel mailing list about extending support for markdown in R and CRAN, but that mostly seems to concern NEWS and README files.


