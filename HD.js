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


    // 成功的回调、失败的回调
    then(onFulfiled, onRejected) {

        // 回调函数不是function时封装一个函数
        if(typeof onFulfiled!="function"){
            onFulfiled=()=>{

            }
        }

        if(typeof onRejected!="function"){
            onRejected=()=>{
                
            }
        }
        if (this.status == HD.FULFILLED) {
            onFulfiled(this.value)
        }
        if(this.status==HD.REJECTED){
            onRejected(this.value)
        }

    }
}