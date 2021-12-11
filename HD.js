class HD {
    static PENDING = "pending";
    static FUFILLED = "fufilled";
    static REJECTED = "rejected";

    constructor(executor) {
        this.status = HD.PENDING;
        this.value = null;
        executor(this.resolve.bind(this), this.rejected.bind(this))
    }

    resolve(value) {
this.status=HD.FUFILLED;
this.value=value;
    }
    rejected(reason) {
this.status=HD.REJECTED;
this.value=reason;
    }
}