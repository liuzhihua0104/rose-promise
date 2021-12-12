class HD {
    static PENDING = "pending"; // 准备状态
    static FULFILLED = "fulfilled"; // 成功
    static REJECTED = "rejected"; // 拒绝

    constructor(executor) {
        this.status = HD.PENDING;
        this.value = null;

        this.callbacks = []; //防止new时里面设置定时器
        // 防止报错，比如用了一个不存在的变量
        try {
            executor(this.resolve.bind(this), this.rejected.bind(this))
        } catch (error) {
            this.rejected("err")
        }


    }

    resolve(value) {
        // 不允许再次改变状态
        if (this.status == HD.PENDING) {
            this.status = HD.FULFILLED;
            this.value = value;

            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onFulfiled(value)
                })
            });

        }

    }
    rejected(reason) {
        // 不允许再次改变状态
        if (this.status == HD.PENDING) {
            this.status = HD.REJECTED;
            this.value = reason;

            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onRejected(reason)
                })
            })

        }

    }


    // 成功的回调、失败的回调
    then(onFulfiled, onRejected) {

        // 回调函数不是function时封装一个函数
        if (typeof onFulfiled != "function") {
            onFulfiled = () => {
                return this.value
            }
        }

        if (typeof onRejected != "function") {
            onRejected = () => {
                return this.value

            }
        }
        return new HD((resolve, rejected) => {
            // new 里面是一个异步，如setTimeout
            if (this.status == HD.PENDING) {
                this.callbacks.push({
                    onFulfiled: value => {
                        try {
                            let result = onFulfiled(value)
                            resolve(result)
                        }
                        catch (error) {
                            onRejected(error)
                        }
                    }
                    ,
                    onRejected: value => {
                        try {
                            let result = onRejected(value)

                            resolve(value)
                        }
                        catch (error) {
                            onRejected(error)
                        }
                    }
                })
            }

            if (this.status == HD.FULFILLED) {

                setTimeout(() => {
                    try {
                        let result = onFulfiled(this.value)
                        // 防止返回promise完整对象
                        if (result instanceof HD) {
                            result.then(value => {
                                resolve(value)
                            })
                        } else {
                            resolve(result)
                        }
                    } catch (error) {
                        onRejected(error)
                    }
                })

            }
            if (this.status == HD.REJECTED) {

                setTimeout(() => {
                    try {
                        let result = onRejected(this.value)
                        resolve(result)

                    } catch (error) {
                        onRejected(error)
                    }
                })

            }
        })


    }
}