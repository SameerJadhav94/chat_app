import { StatusCodes } from "http-status-codes";
export const responseHandler = (serviceResponse, controllerResponse) => {
    if (serviceResponse.statusCode) {
        return controllerResponse.status(serviceResponse.statusCode || 500).json({
          status: serviceResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
          message: serviceResponse.message || "Internal Server Error",
        });
      }
      return controllerResponse.status(StatusCodes.OK).json(serviceResponse);
}