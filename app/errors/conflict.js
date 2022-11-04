import CustomAPIError from "./custom_error.js";
import { StatusCodes } from "http-status-codes";

class ConflictError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.CONFLICT;
      }
}

export default ConflictError;