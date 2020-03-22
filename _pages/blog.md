---
layout: page
title: Blog
permalink: /blog/
---
Welcome to my blog page. From time to time, I write on different topics related to data science and coding. You'll find my recent posts here. 
<br/><br/>
<br/><br/>

<ul>
	{% for post in site.posts %}
  <div class="post">
    <h3 class="post-title">
      <a href="{{ site.baseurl }}/{{ post.url }}">
        {{ post.title }}
      </a>
    </h3>

    <span class="post-date">{{ post.date | date_to_string }}</span>

  </div>
  {% endfor %}

</ul>