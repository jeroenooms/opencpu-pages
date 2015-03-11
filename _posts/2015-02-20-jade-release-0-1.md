---
layout: post
title: "Jade: a clean, whitespace-sensitive template language for writing HTML"
category: posts
description: "Jade is a high performance template engine heavily influenced by Haml. The new rjade package implements convenient bindings from R to this popular JavaScript library."
cover: "containers.jpg"
thumb: "jade.png"
---

Jade is a high performance template engine heavily influenced by Haml. It is designed for writing HTML pages using a concise, modern syntax without the verbosity of old fashioned XML-like tags that we all want to forget about. The new [rjade](http://cran.r-project.org/web/packages/rjade/) package implements convenient bindings from R to this popular JavaScript library.

## An example template

Below an example of a Jade template, taken from the [jade homepage](http://jade-lang.com/). Notice that the notation of tags, classes and id's much resembles CSS selectors. The template also includes one variable called `youAreUsingJade`, which we can use to control the rendering output.

{% highlight html %}
doctype html
html(lang="en")
  head
    title= pageTitle
    script(type='text/javascript').
      if (foo) {
         bar(1 + 5)
      }
  body
    h1 Jade - node template engine
    #container.col
      if youAreUsingJade
        p You are amazing
      else
        p Get on it!
      p.
        Jade is a terse and simple
        templating language with a
        strong focus on performance
        and powerful features.
{% endhighlight %}

Converting a template to HTML text involves two steps. The first step compiles the template with some formatting options into a closure. The binding for this is implemented in `jade_compile`.

{% highlight r %}
# Compile a Jade template in R
library(rjade)
text <- readLines(system.file("examples/test.jade", package = "rjade"))
tpl <- jade_compile(text, pretty = TRUE)
{% endhighlight %}

The second step calls the closure with optionally some local variables to render the output to HTML.

{% highlight r %}
# Render the template
tpl()
{% endhighlight %}

The output looks like this:

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <script type="text/javascript">
      if (foo) {
         bar(1 + 5)
      }
    </script>
  </head>
  <body>
    <h1>Jade - node template engine</h1>
    <div id="container" class="col">
      <p>Get on it!</p>
      <p>
        Jade is a terse and simple
        templating language with a
        strong focus on performance
        and powerful features.
      </p>
    </div>
  </body>
</html>
{% endhighlight %}

Note how the HTML output changes when setting local variables:

{% highlight r %}
tpl(youAreUsingJade = TRUE)
{% endhighlight %}

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <script type="text/javascript">
      if (foo) {
         bar(1 + 5)
      }
    </script>
  </head>
  <body>
    <h1>Jade - node template engine</h1>
    <div id="container" class="col">
      <p>You are amazing</p>
      <p>
        Jade is a terse and simple
        templating language with a
        strong focus on performance
        and powerful features.
      </p>
    </div>
  </body>
</html>
{% endhighlight %}

That's it. Hover over to the [jade website](http://jade-lang.com/) to learn about the full power of this amazing templating language.

