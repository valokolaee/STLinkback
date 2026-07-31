import { handleDbError } from "../db/dbError";

export default (error: any) => {
    // return res.status(result.httpStatus).json(result.response);
    if (error) {
        handleDbError(error);
        // console.error('errorHandler.utils:', result.response);
    }
}