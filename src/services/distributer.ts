import { log } from "console";
import totalPercent from "../controllers/mining-device-affiliate.controller/totalPercent";
import DeviceEarningPot, { IDeviceEarningPot } from "../db/models/device-earning-pot.model";
import { safeParseFloat } from "../utils/math.utils";
import DeviceEarningPotService from "./DeviceEarningPot.service";
import { IDeviceAffiliate } from "../db/models/device-affiliate.model";
import { decimalPlus } from "../utils/decimal.utils";
import meLog from "../utils/meLog";

export default async (ownerPot: DeviceEarningPot, amount: number) => {

    const affiliates = await totalPercent((ownerPot as IDeviceEarningPot)!?.potAssignment!?.id!)

    const affiliatesList = affiliates.allAffiliates;
    const affiliatesPercent = affiliates.total;


    // console.log(affiliatesPercent, pureAmount);


    for (let index = 0; index < affiliatesList.length; index++) {
        const element: IDeviceAffiliate = affiliatesList[index];

        const affiliatesPot = element.pot;
        const affiliatesPotShare = element.percent;

        // console.log(affiliatesPot);



        const thisShare = amount * affiliatesPotShare! / 100

        meLog(thisShare, affiliatesPot);


        const newAvailableBalance = decimalPlus((affiliatesPot as DeviceEarningPot).availableBalance, thisShare);
        const newTotalEarnings = decimalPlus((affiliatesPot as DeviceEarningPot).totalEarnings, thisShare);



        await DeviceEarningPotService().update({
            id: affiliatesPot!.id,
            availableBalance: newAvailableBalance,
            totalEarnings: newTotalEarnings,
            lastUpdated: new Date(),
        });

    }

    // const newAvailableBalance = safeParseFloat(ownerPot.availableBalance) + safeParseFloat(amount);
    // const newTotalEarnings = safeParseFloat(ownerPot.totalEarnings) + safeParseFloat(amount);


    const ownerShare = amount - (amount * affiliatesPercent / 100)
    console.log(ownerShare);
    console.log('\n///////////');

    const newAvailableBalance = decimalPlus(ownerPot.availableBalance, ownerShare);
    const newTotalEarnings = decimalPlus(ownerPot.totalEarnings, ownerShare);



    await DeviceEarningPotService().update({
        id: ownerPot.id,
        availableBalance: newAvailableBalance,
        totalEarnings: newTotalEarnings,
        lastUpdated: new Date(),
    });




}


