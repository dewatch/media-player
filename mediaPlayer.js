
var play = document.getElementById('play');
var aud = document.getElementById('audio');
var bar = document.getElementById('bar');
var now = document.getElementById('now');
var voiceBar = document.getElementById('voiceBar');
var voice = document.getElementById('voice');
var speedBar = document.getElementById('speedBar');
var speed = document.getElementById('speed');
var speedNormal = document.getElementById('speedNormal');
var words = document.getElementById('words');
var wordScreen = document.getElementById('wordScreen');
var wordsScreen = document.getElementById('wordsScreen');
var lrc = '';
var LRC = {};
var word = '';
var Scroll;
// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// var source = audioCtx.createMediaElementSource(aud);
// var gainNode = audioCtx.createGain();
// source.connect(gainNode);
// gainNode.connect(audioCtx.destination);

// function barRun() {
//     setInterval("process()", 1000 );
// }

aud.addEventListener('timeupdate', process);

function process() {
    now.style.width = (aud.currentTime/aud.duration).toFixed(3) * 100 + '%';
    var currentTime = timeFormat(aud.currentTime);
    var total = timeFormat(aud.duration);
    document.getElementById('start').innerHTML = currentTime;
    document.getElementById('end').innerHTML = total;
    showWords(LRC);
}



function timeFormat(value) {
    var minute = Math.floor(value / 60);
    var second = Math.round(value % 60);
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;
    return minute + ':' +second;
}

function statusChange() {
    if(play.status === 'pause'){
        aud.play();
        // barRun();
        play.status = 'play';
        play.innerHTML = 'pause';
    }else if (play.status === 'play') {
        aud.pause();
        play.status = 'pause';
        play.innerHTML = 'play';
    }
}

bar.addEventListener('click', function (event) {
    var x1 = bar.getBoundingClientRect().left;
    var x2 = event.pageX;
    var x = (x2 - x1) / bar.offsetWidth;
    now.style.width = x.toFixed(3) * 100 +'%';
    aud.currentTime = x * aud.duration;
    aud.play();
    // barRun();
    if(play.status === 'pause'){
        play.status = 'play';
        play.innerHTML = 'pause';
    }
}, false);

play.status = 'pause';
play.addEventListener('click' ,statusChange);

voiceBar.addEventListener('click',function (event) {
    var x1 = voiceBar.getBoundingClientRect().left;
    var x2 = event.pageX;
    var x = (x2 - x1 ) / voiceBar.offsetWidth;
    voice.style.width = x.toFixed(3) * 100 + '%';
    aud.volume = x ;
});

speedBar.addEventListener('click',function (event) {
    var x1 = speedBar.getBoundingClientRect().left;
    var x2 = event.pageX;
    var x = (x2 - x1 ) / speedBar.offsetWidth;
    speed.style.width = x.toFixed(3) * 100 + '%';
    aud.playbackRate = x * 2;
});

speedNormal.addEventListener('click', function () {
    speed.style.width = 50 + '%';
    aud.playbackRate = 1;
});

wordsScreen.addEventListener('click', function () {
    wordScreen.style.display = 'block';
    wordScreen.innerHTML = word;
    Scroll = document.querySelectorAll('li');
    console.log(Scroll);
});



function getLRC() {
    var xml = new XMLHttpRequest();
    xml.open('GET', 'music/Fearless/Taylor Swift - Fearless.lrc');
    xml.onreadystatechange = function () {
        if(xml.readyState === 4 && xml.status === 200){
            lrc = xml.responseText;
            // console.log(lrc);
            LRC = analyseLRC(lrc);
            console.log(LRC);
        }
    };
    xml.send();
}

getLRC();


function analyseLRC(lrc) {
    var lrcObj = {};
    var lyrics = lrc.split('\n');
    for(i = 0; i < lyrics.length; i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr) continue;
        var clause = lyric.replace(timeReg,'');
        word = word + '<li class = "scroll">' + clause + '</li>';
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
}

var m = 1;
var prev = '';
var Prev = '';
function showWords(LRC) {
    var x = Math.round(aud.currentTime);
    console.log(LRC[x]);
    if( LRC[x] !== undefined && prev !== LRC[x] ){
        words.innerHTML = LRC[x];
        prev = LRC[x];
        var item1 = Scroll[m];
        item1.setAttribute('class', 'blue');
        if(Prev) Prev.removeAttribute('class', 'blue');
        var n = m * 10;
        if(m > 5){
            wordScreen.style.marginTop = '-'+ n +'px';
        }
        Prev = Scroll[m];
        m++;
    }
}



