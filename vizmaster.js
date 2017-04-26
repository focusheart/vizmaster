/**
 * vizmaster
 *
 * Copyright 2016-2017 focusheart (@focusheart)
 * -----------------------------------------------
 *  author:  focusheart
 *  version: 0.1.0
 *  url:     http://vizmaster.focusheart.cn/
 *  source:  https://github.com/focusheart/vizmaster/
 */

var win = document.getElementById('vizmaster-win');
win.width = window.innerWidth;
win.height = window.innerHeight;

// [ url, seconds ]
var pages_json_url = "./pages.json";
var pages = [];
var idx = -1;
var iso = null;
var is_pause = false;
var ctd_seconds = 0;

function show_next() {
    if (!is_pause) {
        // Update idx
        idx += 1;
        if (idx >= pages.length) {
            idx = 0;
        }

        var url = pages[idx][0];
        msg("PAGE: <a target='_blank' href='"+url+"'>"+url+"</a>");
        win.src = url;
    }

    // show next page after dur
    iso = setTimeout("show_next();", pages[idx][1] * 1000);
    ctd_seconds = pages[idx][1];
}

function msg(s) {
    document.getElementById('sbar-msg').innerHTML = s;
}

function pause() {
    is_pause = !is_pause;
    document.getElementById('btn-pause').innerHTML = 
        is_pause? 'Paused' : 'Pause';
}

function prev() {
    idx = idx==0? (pages.length-2) : (idx-2);
    clearTimeout(iso);
    show_next();
}

function next() {
    idx = idx==(pages.length-1)? -1 : (idx);
    clearTimeout(iso);
    show_next();
}

function countdown() {
    document.getElementById('sbar-ctd').innerHTML = ctd_seconds;
    ctd_seconds -= 1;
    setTimeout("countdown();", 1000);
}

fetch(pages_json_url)
    .then(function(rsp) {
        return rsp.json();
    }).then(function(json) {
        pages = json['pages'];
        show_next();
        countdown();
    });