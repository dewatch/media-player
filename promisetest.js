function p1() {
    return new Promise((resolve ,reject) =>{
        resolve("success!");
    });
}

function p2() {
    return new Promise((resolve, reject) => {
        reject("failed!");
    });
}

var promise1 = new Promise(resolve => {
    resolve("I'm");
});
var promise2 = new Promise(resolve => {
    resolve("still");
});
var promise3 = new Promise(resolve => {
    resolve("alive");
});

p1().then(function (value) {
    console.log(value);
    alert(value);
});


p2().catch(function (reason) {
    console.log(reason);
    alert(reason);
});

Promise.all([promise1, promise2, promise3]).then(function (value) {
    alert(value);
});

var player1 = new Promise(resolve => {
    setTimeout(function(){
        resolve("player1 win the race!");
    },200);
});

var player2 = new Promise(reject => {
    setTimeout(function(){
        reject("player2 win the race!");
    },300);
});

Promise.race([player1, player2]).then(function (value) {
    alert(value);
}).finally(function () {
    alert("Congratulations!");
});
