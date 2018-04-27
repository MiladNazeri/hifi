const htmlclean = require('htmlclean');
const fs = require('fs');
const path = require('path');
const pretty = require('pretty');
const cheerio = require('cheerio')

// required directories
let dir_out = path.join(__dirname, 'out');
let dir_grav = path.join(__dirname, 'out', 'grav');
let dir_css = path.join(__dirname, 'out', 'grav', 'css');
let dir_js = path.join(__dirname, 'out', 'grav', 'js');
let dir_md = path.join(__dirname, 'out', 'grav', 'md');
let dir_twig = path.join(__dirname, 'out', 'grav', 'twig');

// array to itterate over and create if doesn't exist
let dirArray = [dir_grav, dir_css, dir_js, dir_md, dir_twig];

dirArray.forEach(function(dir){
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
})

// read jsdoc output folder
let files = fs.readdirSync(dir_out);
files.forEach(function (file){
    let curSource = path.join(dir_out, file);
    if (path.extname(curSource) == ".html") {
        // clean up the html source
        let loadedHtml = prepareHtml(curSource);

        // extract the title and the main div
        let htmlTitle = loadedHtml("title").text().split(": ").pop();
        let mainDiv = loadedHtml("#main").html();
        let mainDivNoTitle = mainDiv.replace(/\<h1.+?\>.+?\<\/h1\>/g, "");
        let mainDivStripLinks = mainDivNoTitle.replace(/\.html/g, "");

        // create the .md file and corresponding folder
        let mdSource = makeMdSource(htmlTitle);
        let destinationDirectory = path.join(dir_md, htmlTitle);
        if (!fs.existsSync(destinationDirectory)) {
            fs.mkdirSync(destinationDirectory);
        }
        let destinationMDFile = path.join(destinationDirectory, `${htmlTitle}.md`);
        fs.writeFileSync(destinationMDFile, mdSource);

        // create the twig template
        let twigBasePartial = makeTwigFile(mainDivStripLinks);
        let destinationFile = path.join(dir_twig, `${htmlTitle}.html.twig`);
        fs.writeFileSync(destinationFile, twigBasePartial);
    }
})

function prepareHtml(source){
    let htmlBefore = fs.readFileSync(source, {encoding: 'utf8'});
    let htmlAfter = htmlclean(htmlBefore);
    let htmlAfterPretty = pretty(htmlAfter);
    return cheerio.load(htmlAfterPretty);
}

function makeMdSource(title){
    return (
`---
title: '${title}'
taxonomy:
    category:
        - docs
visible: true
---
`
    )
}

function makeTwigFile(contentHtml){
    return (
`
{% extends 'partials/base_noGit.html.twig' %}
{% set tags = page.taxonomy.tag %}
{% if tags %}
    {% set progress = page.collection({'items':{'@taxonomy':{'category': 'docs', 'tag': tags}},'order': {'by': 'default', 'dir': 'asc'}}) %}
{% else %}
    {% set progress = page.collection({'items':{'@taxonomy':{'category': 'docs'}},'order': {'by': 'default', 'dir': 'asc'}}) %}
{% endif %}

{% block navigation %}
    <div id="navigation">
    {% if not progress.isFirst(page.path) %}
        <a class="nav nav-prev" href="{{ progress.nextSibling(page.path).url }}"> <img src="{{ url('theme://images/left-arrow.png') }}"></a>
    {% endif %}

    {% if not progress.isLast(page.path) %}
        <a class="nav nav-next" href="{{ progress.prevSibling(page.path).url }}"><img src="{{ url('theme://images/right-arrow.png') }}"></a>
    {% endif %}
    </div>
{% endblock %}

{% block content %}
    <div id="body-inner">
    <h1>{{ page.title }}</h1>
    ${contentHtml}
    </div>
{% endblock %}
`
    )
}