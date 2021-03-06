---
layout: page
title: Projects and data
permalink: /projects/
---

This page gives an overview of my data science projects (current and past). For an overview of my academic research projects, please see [this page]({{ site.url }}/research).

## ParlRulesData
With [Tom Fleming](https://www.nuffield.ox.ac.uk/people/profiles/thomas-fleming/) (Oxford University) and [Radoslaw Zubek](https://radoslawzubek.com/) (Oxford University)

[ParlRulesData](https://ParlRulesData.org) is an online database of parliamentary rules, containing the formal rules of procedure for various parliaments over time. The data currently covers the UK House of Commons (1811-2019) and the Irish Dáil (1926-2016).


## PhD research data
As part of my PhD project on rules of debate and polarisation in the UK House of Commons, I gathered historical data covering the period 1811-2015. Some of of these data are available on this page (and more will be released soon).

### Session dates for the UK House of Commons, 1811-2015
Download in [JSON format]({{ site.url }}/data/UKHCSO_sessions1811_2015.json)

Download in [XML format]({{ site.url }}/data/UKHCSO_sessions1811_2015.xml)

### Polarisation in the UK House of Commons, 1811-2015
Building on a classification accuracy approach introduced by [Peterson and Spirling (2018)](https://www.cambridge.org/core/journals/political-analysis/article/classification-accuracy-as-a-substantive-quantity-of-interest-measuring-polarization-in-westminster-systems/45746D999CFCD1CB43E362392D7B2FB4), and my PhD work, the graph below shows levels of polarisation in the UK Parliament for the period 1811-2015. "Polarisation" is defined as how predictive language use is of party membership in a given session (measured on a 0-1 scale), and is estimated on the basis of records of parliamentary speeches from [Hansard](http://www.hansard-archive.parliament.uk). In simple terms, the measure is generated by fitting a training algorithm to a set of parliamentary speeches in a session with party labels, and taking the accuracy from predicting a held-out subset of speeches (which are also labelled). The data for the graph is available in .csv format [via this link]({{ site.url }}/data/polarisationUKHCSO.csv), or in .json [via this link]({{ site.url }}/data/polarisationUKHCSO.json). Please cite [this paper]({{ site.url }}/references/Goet2017.bib) if you intend to use these data for your research.

<iframe src="/graphs/polarisationUKHCSO.html" width="850" height="600" scrolling="no" frameBorder="0">
</iframe>

