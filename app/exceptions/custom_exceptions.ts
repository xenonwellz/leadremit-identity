export class UnauthorizedActionException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UnauthorizedActionException'
    }
}

export class PaymentException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PaymentException'
    }
}

export class IncorrectWalletPinError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'IncorrectWalletPinError'
    }
}
