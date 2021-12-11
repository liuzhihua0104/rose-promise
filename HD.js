class HD {
    static PENDING = "pending"; // 准备状态
    static FUFILLED = "fufilled"; // 成功
    static REJECTED = "rejected"; // 拒绝

    constructor(executor) {
        this.status = HD.PENDING;
        this.value = null;
        executor(this.resolve.bind(this), this.rejected.bind(this))
    }

    resolve(value) {
        // 不允许再次改变状态
        if (this.status == HD.PENDING) {
            this.status = HD.FUFILLED;
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