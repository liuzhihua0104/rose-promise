class HD {
    static PENDING = "pending"; // 准备状态
    static FULFILLED = "fulfilled"; // 成功
    static REJECTED = "rejected"; // 拒绝

    constructor(executor) {
        this.status = HD.PENDING;
        this.value = null;

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
        }

    }
    rejected(reason) {
        // 不允许再次改变状态
        if (this.status == HD.PENDING) {
            this.status = HD.REJECTED;
            this.value = reason;
        }

    }
}