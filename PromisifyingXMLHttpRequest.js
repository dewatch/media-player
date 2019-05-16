function Promise(executor) {
    var self = this;
    self.date = undefined;
    self.status = "pending";
    self.onResolveCallback = [];
    self.onRejectCallback = [];

    function resolve(value) {
        if(value instanceof Promise){
            return value.then(resolve, reject);
        }
        setTimeout(function () {
            if(self.status === "pending") {
                self.status = "resolve";
                self.date = value;
                for(var i = 0; i < self.onResolveCallback.length; i++) {
                    self.onResolveCallback[i](value);
                }
            }
        })
    }

    function reject(value) {
        setTimeout(function () {
            if(self.status === "pending") {
                self.status = "reject";
                self.date = value;
                for(var i = 0; i < self.onRejectCallback.length; i++) {
                    self.onRejectCallback[i](value);
                }
            }
        })
    }

    try {
        executor(resolve, reject);
    }catch (e) {
        reject(e);
    }
}

function resolvePromise(promise2, x, resolve, reject){
    var then;
    var thenCallOrThrow = false;

    if(promise2 === x){
        return reject(new TypeError('chaining cycle detected for promise!'));
    }

    if(x instanceof Promise){
        if(x.status === 'pending'){
            x.then(function (value) { resolvePromise(promise2, value, resolve, reject) }, reject);
        }else{
            x.then(resolve, reject);
        }
        return
    }

    if((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))){
        try{
            then = x.then;
            if(typeof then === 'function'){
                then.call(x, function (y) {
                    if(thenCallOrThrow) return;
                    thenCallOrThrow = true;
                    return resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if(thenCallOrThrow) return;
                    thenCallOrThrow = true;
                    return reject(r);
                })
            }else{
                resolve(x);
            }
        }catch (e) {
            if (thenCallOrThrow) return ;
            thenCallOrThrow = true;
            reject(e);
        }
    }else {
        resolve(x);
    }
}


Promise.prototype.then = function(OnResolved, OnRejected){
    var self = this;
    var promise2;
    OnResolved = typeof OnResolved === 'function' ? OnResolved : function (value) {
        return value;
    };
    OnRejected = typeof OnRejected === 'function' ? OnRejected : function (reason) {
        throw reason;
    };

    if(self.status === 'resolved'){
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try{
                    var x = OnResolved(self.date);
                    resolvePromise(promise2, x, resolve, reject);
                }catch (e) {
                    reject(e);
                }
            })
        })
    }

    if(self.status === 'rejected'){
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try{
                    var x = OnRejected(self.date);
                    resolvePromise(promise2, x, resolve, reject);
                }catch (e) {
                    reject(e);
                }
            })
        })
    }

    if(self.status === 'pending'){
        return promise2 = new Promise(function (resolve, reject) {
            self.onResolveCallback.push(function (value) {
                try{
                    var x = OnResolved(self.date);
                    resolvePromise(promise2, x, resolve, reject);
                }catch (e) {
                    reject(e);
                }
            });
            self.onRejectCallback.push(function (reason) {
                try{
                    var x = OnRejected(self.date);
                    resolvePromise(promise2, x, resolve, reject);
                }catch (e) {
                    reject(e);
                }
            })
        })
    }
};


Promise.prototype.catch = function(OnRejected) {
    return this.then(null, OnRejected);
};

Promise.prototype.finally = function (fn) {
    return this.then(function (value) { setTimeout(fn);  return value},function (reason) { setTimeout(fn); throw reason})
};

Promise.resolve = function(value){
    var promise = new Promise(function (resolve, reject) {
        resolvePromise(promise, value, resolve, reject);
    });
    return promise;
};

Promise.reject = function(reason){
    return new Promise(function (resolve, reject) {
        reject(reason);
    })
};

Promise.all = function (promises) {
    return new Promise(function (resolve, reject) {
        var resolvedCounter = 0;
        var promiseNum = promises.length;
        var resolvedValues = new Array(promiseNum);
        for(var i = 0; i < promiseNum; i++){
            (function (i) {
                Promise.resolve(promises[i]).then(function (value) {
                    resolvedCounter++;
                    resolvedValues[i] = value;
                    if(resolvedCounter === promiseNum){
                        return resolve(resolvedValues);
                    }
                }, function (reason) {
                    return reject(reason);
                })
            })(i)
        }
    })
};

Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for(var i = 0; i < promises.length; i++){
            Promise.resolve(promises[i]).then(function (value) {
                return resolve(value);
            }, function (reason) {
                return reject(reason);
            })
        }
    })
};

function myFetch(url) {
    return new Promise(function (resolve, reject) {
        try{
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url,true);
            xhr.responseType = '';
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        resolve(xhr.response);
                    }
                }else if(xhr.readyState > 4){
                    reject("error!");
                }
            };
            xhr.send();
        }catch(e){
            reject(e);
        }
    })
}

myFetch("http://localhost:63342/third/promise.html").then(function (value) {
    console.log(value);
}).catch(function (reason) {
    console.log(reason);
});


