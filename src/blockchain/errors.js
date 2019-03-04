class Error {
    constructor(code, desc) {
        this.code = code
        this.desc = desc
    }

    static BlockValidationError(err) {
        return new Error('BlockValidationError', err)
    }

    static InvalidBlockError(err) {
        return new Error('InvalidBlockError', err)
    }

    static ForkError(err) {
        return new Error('ForkError', err)
    }

    static ExistBlockError(err) {
        return new Error('ExistBlockError', err)
    }

    static MismatchedIDError(err) {
        return new Error('MismatchedIDError', err)
    }
}

export default Error