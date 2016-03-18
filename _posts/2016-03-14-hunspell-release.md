---
layout: post
title: "Hunspell: Spell Checker and Text Parser for R"
category: posts
description: "Hunspell is the spell checker of LibreOffice, OpenOffice, Mozilla Firefox, Google Chrome, and it is also used by proprietary software packages, like Mac OS X, InDesign, memoQ, Opera and SDL Trados. The R package makes the most important functionality directly available from R, on all platforms without additional dependencies."
cover: "containers.jpg"
thumb: "spelling.png"
---

Hunspell is the spell checker library used in LibreOffice, OpenOffice, Mozilla Firefox, Google Chrome, Mac OS X, InDesign, and a few more. Base R has some spell checking functionality via the `aspell` function which wraps the aspell or hunspell command line program on supported systems. The new hunspell [R package](https://cran.r-project.org/web/packages/hunspell) on the other hand directly links to the hunspell c++ library and works on all platforms without installing additional dependencies.

### Basic tools

The `hunspell_check` function takes a vector of words and checks each individual word for correctness.

```r
library(hunspell)
words <- c("beer", "wiskey", "wine")
hunspell_check(words)
## [1]  TRUE FALSE  TRUE
```

The `hunspell_find` function takes a character vector with text (in plain, latex or man format) and returns a list with incorrect words for each line.

```r
bad_words <- hunspell_find("spell checkers are not neccessairy for langauge ninja's")
print(bad_words)
## [1] "neccessairy" "langauge"    "ninja's"    
```

Finally `hunspell_suggest` is used to suggest correct alternatives for each (incorrect) input word.

```r
hunspell_suggest(bad_words[[1]])
## [[1]]
## [1] "necessary"    "necessarily"  "necessaries"  "recessionary" "accessory"    "incarcerate" 
##
## [[2]]
## [1] "language"  "Langeland" "Lagrange"  "Lange"     "gaugeable" "linkage"   "Langland" 
##
## [[3]]
## [1] "ninjas"   "Janina's" "Nina's"   "ninja"    "Janine's" "meninx"   "nark's"
```

### Parsing text

The first challenge in spell-checking is extracting individual words from formatted text. The `hunspell_find` function supports three parsers via the `format` parameter: plain text, latex and man. For example to check the [OpenCPU paper](http://arxiv.org/abs/1406.4806) for spelling errors we use the latex source code:

```r
download.file("http://arxiv.org/e-print/1406.4806v1", "1406.4806v1.tar.gz",  mode = "wb")
untar("1406.4806v1.tar.gz")
text <- readLines("content.tex", warn = FALSE)
words <- hunspell_find(text, format = "latex")
sort(unique(unlist(words)))
```

Base R also has a few filters to extract words from R, Sweave or Rd code, see `RdTextFilter`, `SweaveTeXFilter` in tools. For example to check your R package manual for typos (assuming you are in the pkg source dir)

```r
for(file in list.files("man", full.names = TRUE)){
  cat("\nFile", file, ":\n  ")
  txt <- tools::RdTextFilter(file, keepSpacing = FALSE)
  cat(sQuote(sort(unique(unlist(hunspell_find(txt))))), sep =", ")
}
```  

### Morphological analysis

A cool feature in hunspell is the morphological analysis. The `hunspell_analyze` function will show you how a word breaks down into a valid stem plus affix. Hunspell uses a special dictionary format to determine if a stem+affix combination is valid in a given language. 

For example suppose we take a few variations of the word *love*. To get the possible stems+affix for each word: 

```r
hunspell_analyze(c("love", "loving", "lovingly", "loved", "lover", "lovely", "love"))
## [1] " st:love"
## [1] " st:loving"    " st:love fl:G"
## [1] " st:lovingly"
## [1] " st:loved"     " st:love fl:D"
## [1] " st:lover"     " st:love fl:R"
## [1] " st:lovely"    " st:love fl:Y"
## [1] " st:love"
```

Alternatively the `hunspell_stem` returns only the stem. Not sure how you would use this but it's certainly cool.

### Thanks!

Thanks to Daniel Falbel for [suggesting](https://discuss.ropensci.org/t/r-interface-with-hunspell/327) this package on the rOpenSci forums!
