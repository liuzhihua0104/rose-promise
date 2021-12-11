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
            this.callbacks.map(callback => {
                callback.onFulfiled(value)
            })
        }

    }
    rejected(reason) {
        // 不允许再次改变状态
        if (this.status == HD.PENDING) {
            this.status = HD.REJECTED;
            this.value = reason;
            this.callbacks.map(callback => {
                callback.onRejected(reason)
            })
        }

    }


    // 成功的回调、失败的回调
    then(onFulfiled, onRejected) {

        // 回调函数不是function时封装一个函数
        if (typeof onFulfiled != "function") {
            onFulfiled = () => {

            }
        }

        if (typeof onRejected != "function") {
            onRejected = () => {

            }
        }
        // new 里面是一个异步，如setTimeout
        if (this.status == HD.PENDING) {
            this.callbacks.push({
                onFulfiled,
                onRejected
            })
        }

        if (this.status == HD.FULFILLED) {

            setTimeout(() => {
                try {
                    onFulfiled(this.value)

                } catch (error) {
                    onRejected(error)
                }
            })

        }
        if (this.status == HD.REJECTED) {

            setTimeout(() => {
                try {
                    onRejected(this.value)

                } catch (error) {
                    onRejected(error)
                }
            })

        }

    }
}