import DeviceAffiliate, { IDeviceAffiliate } from "../../db/models/device-affiliate.model";
import deviceAffiliateService from "../../services/deviceAffiliate.service";

const serviceDeviceAffiliate = deviceAffiliateService()


export default async (potAssignmentId: number) => {
    
    const allAffiliates = (await serviceDeviceAffiliate.getAllBy(potAssignmentId)).data

    const total = allAffiliates?.reduce((sum: number, item: IDeviceAffiliate) => sum + item.percent!, 0);

    return { total, allAffiliates };
}