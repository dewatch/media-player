var EventEmitter = function () {
    this.listeners = {};
};

EventEmitter.prototype.listeners = null;

EventEmitter.prototype.on = function (type, callback) {
    if(!(type in this.listeners)){
        this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
};

EventEmitter.prototype.remove = function (type, callback){
    if(!(type in this.listeners)){
        return;
    }
    var stack = this.listeners[type];
    for(var i = 1; i < stack.length; i++){
        if(callback === stack[i]){
            stack.splice(i, 1);
            return this.remove(type, callback);
        }
    }
};

EventEmitter.prototype.emit = function (event) {
    if(!(event.type in this.listeners)){
        console.log('none');
        return;
    }
    var stack = this.listeners[event.type];
    event.target = this;
    for(var i = 0; i < stack.length; i++) {
        stack[i].call(this, event);
    }
};


var eventmitter = new EventEmitter();
function callback1 () {
    console.log('hello!');
}

function callback2 (){
    console.log('you are handsome!');
}
eventmitter.on('hello',callback1);

eventmitter.on('hello', callback2);

var event = new Event('hello');
eventmitter.emit(event);

eventmitter.remove('hello', callback2);

console.log("yoo!");
eventmitter.emit(event);