---
layout: post
title: "Paper: The OpenCPU system - towards a universal interface for scientific computing through separation of concerns"
category: posts
description: "This paper takes a high-level and discusses some of the relevant domain logic of scientific computing, the benefits of using a standardized application protocol to interface statistical software, and the importance of clearly separating statistical computing from application and implementation logic"
cover: "containers.jpg"
---

This week a new paper appeared on [arXiv](http://arxiv.org/a/ooms_j_1) titled: [*The OpenCPU System: Towards a Universal Interface for Scientific Computing through Separation of Concerns*](http://arxiv.org/abs/1406.4806). It is based on a chapter of my thesis and provides a  conceptual introduction to embedded scientific computing and the OpenCPU system.

The article deliberately does not describe any software specifics. Instead, it takes a high-level view and discusses domain logic of scientific computing, the benefits of using a standardized application protocol to interface statistical methods, and the importance of clearly separating statistical computing from application and implementation logic. The R software and OpenCPU API are used to illustrate the advocated approach. However, it is emphasized that the API is designed to describe general logic of data analysis rather than that of a particular language, and the system should generalize quite naturally to other computational back-ends, such as Julia, Python or Matlab.

This paper is an accumulation of many experiences with building statistical web applications in academic and industry organizations over the past years. I hope it will be a good read for anyone who wishes to build stacks, applications, and pipelines with integrated analysis/visualization components, with or without OpenCPU. 

Go and grab the (open access) [pdf](http://arxiv.org/abs/1406.4806) from arXiv! 

