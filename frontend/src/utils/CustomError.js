class CustomError extends Error {
    constructor(message, statusText, status) {
        super(message);
        this.statusText = statusText;
        this.status = status;
    }
}

export default CustomError;
