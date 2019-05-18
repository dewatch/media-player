
var play = document.getElementById('play');
var aud = document.getElementById('audio');
var bar = document.getElementById('bar');
var now = document.getElementById('now');
var voiceBar = document.getElementById('voiceBar');
var voice = document.getElementById('voice');
var speedBar = document.getElementById('speedBar');
var speed = document.getElementById('speed');
var speedNormal = document.getElementById('speedNormal');

// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// var source = audioCtx.createMediaElementSource(aud);
// var gainNode = audioCtx.createGain();
// source.connect(gainNode);
// gainNode.connect(audioCtx.destination);

function barRun() {
    setInterval("process()", 1000 );
}

function process() {
    now.style.width = (aud.currentTime/aud.duration).toFixed(3) * 100 + '%';
    var currentTime = timeFormat(aud.currentTime);
    var total = timeFormat(aud.duration);
    document.getElementById('start').innerHTML = currentTime;
    document.getElementById('end').innerHTML = total;
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
        barRun();
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
    barRun();
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