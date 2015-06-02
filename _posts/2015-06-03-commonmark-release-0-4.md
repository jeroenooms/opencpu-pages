---
layout: post
title: "New package commonmark: yet another markdown parser?"
category: posts
description: "Last week the commonmark package was released on CRAN. The package implements some very thin R bindings to John Macfarlane’s (author of pandoc) cmark library, which provides functions for parsing CommonMark documents to an abstract syntax tree (AST), manipulating the AST, and rendering the document to HTML, groff man, CommonMark, or an XML representation of the AST"
cover: "containers.jpg"
thumb: "markdown-everywhere/jpg"
---

Last week the [commonmark](http://cran.r-project.org/web/packages/commonmark/index.html) package was released on CRAN. The package implements some very thin R bindings to John Macfarlane's (author of pandoc) `cmark` library. From the cmark [readme](https://github.com/jgm/cmark#readme):

> cmark is the C reference implementation of CommonMark, a rationalized version of Markdown syntax with a spec. It provides a shared library (libcmark) with functions for parsing CommonMark documents to an abstract syntax tree (AST), manipulating the AST, and rendering the document to HTML, groff man, CommonMark, or an XML representation of the AST.

Each of the R wrapping functions parses markdown and renders it to one of the output formats:

{% highlight r %}
md <- "
## Test
My list:
  - foo
  - bar"
{% endhighlight %}

The `markdown_html` function converts markdown to HTML:

{% highlight r %}
library(commonmark)
cat(markdown_html(md))
{% endhighlight %}

{% highlight html %}
<h2>Test</h2>
<p>My list:</p>
<ul>
<li>foo</li>
<li>bar</li>
</ul>
{% endhighlight %}

The `markdown_xml` function gives the parse tree in xml format:

{% highlight r %}
cat(markdown_xml(md))
{% endhighlight %}

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE CommonMark SYSTEM "CommonMark.dtd">
<document>
  <header level="2">
    <text>Test</text>
  </header>
  <paragraph>
    <text>My list:</text>
  </paragraph>
  <list type="bullet" tight="true">
    <item>
      <paragraph>
        <text>foo</text>
      </paragraph>
    </item>
    <item>
      <paragraph>
        <text>bar</text>
      </paragraph>
    </item>
  </list>
</document>
{% endhighlight %}

Most of the value in commonmark and is probably in the latter. There already exist a few nice markdown converters for R including the popular [rmarkdown](http://rmarkdown.rstudio.com/) package, which uses pandoc to convert markdown to several presentation formats. 

The formal commonmark spec makes markdown suitable for more strict documentation purposes, where we might currently be inclined to use json or xml. For example we could use it to parse `NEWS.md` files from R packages in a way that allows for archiving and indexing individual news items, without ambiguity over indentation rules and such.
