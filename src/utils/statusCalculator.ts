import { dateDifference } from "./DateTimeHelper"

export default (updatedAt?: Date) => {

    if (!!!updatedAt) {
        return 'new'
    } else {
        return (dateDifference(new Date(), updatedAt) > 300 || dateDifference(new Date(), updatedAt) < 0) ? 'offline' : 'active'
    }
}