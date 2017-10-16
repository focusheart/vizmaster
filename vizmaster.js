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
var mypages_json_url = "./mypages.json";
var pages_json_url = "./pages.json";
var pages = [];
var idx = 0;
var iso = null;
var is_pause = false;
var ctd_seconds = 0;

function show() {
    var url = pages[idx][0];
    msg("PAGE: <a target='_blank' href='"+url+"'>"+url+"</a>");
    win.src = url;
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
    idx = idx==0? (pages.length-1) : (idx-1);
    show();
}

function next() {
    idx = idx==(pages.length-1)? 0 : (idx+1);
    show();
}

function countdown() {
    if (is_pause) {
        // Do nothing if is paused
    } else {
        // Update the ctd
        if (ctd_seconds==0) {
            next();
        } else {
            ctd_seconds -= 1;
            document.getElementById('sbar-ctd').innerHTML = ctd_seconds;
        }
    }
    setTimeout("countdown();", 1000);
}

function on_window_resize() {
    win.width = window.innerWidth;
    win.height = window.innerHeight;
}

window.addEventListener( 'resize', on_window_resize, false );

fetch(mypages_json_url)
    .then(function(rsp) {
        if (rsp.ok) {
            rsp.json().then(function(json) {
                pages = json['pages'];
                document.getElementById('sbar').setAttribute('style', 'display:block');
                show();
                countdown();
            });
        } else {
            console.log("! error: " + rsp.status);
        }

    }, function(ex) {
        console.log(ex);

        // try another json file
        fetch(pages_json_url)
            .then(function(rsp) {
                return rsp.json();
            }).then(function(json) {
                pages = json['pages'];
                document.getElementById('sbar').setAttribute('style', 'display:block');
                show();
                countdown();
            });
    });