---
layout: post
title: "OpenCPU Gem for Ruby"
category: posts
description: "Wrapper Gem for the OpenCPU API"
cover: "containers.jpg"
---

The guys from [roqua.nl](http://roqua.nl/) are working on a [OpenCPU wrapper Gem](https://github.com/roqua/opencpu/). This simple API client provides a pretty nice basis for building R web applications with Ruby. A minimal example from the readme:

{% highlight ruby %}
client.execute :digest, :hmac, { key: 'foo', object: 'bar', algo: 'md5' }
# => ['0c7a250281315ab863549f66cd8a3a53']
{% endhighlight %}

Which performs the following JSON RPC request:

{% highlight r %}
digest::hmac(key="foo", object="bar", algo="md5")
{% endhighlight %} 

They are accepting [pull requests](https://github.com/roqua/opencpu/#contributing)!
