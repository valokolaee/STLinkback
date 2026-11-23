import { handleDbError } from "../db/dbError";

export default (error: any) => {
     if (error) {
        return handleDbError(error);
     }
}