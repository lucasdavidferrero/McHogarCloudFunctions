export class AikonApiError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AikonApiError'
    }
}