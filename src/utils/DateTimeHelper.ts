import dayjs from "dayjs";

export const dateDifference = (d1: any, d2: any) => {
  // mrvTxtTest.log(d1, d2);
  d1 = dayjs(d1);
  d2 = dayjs(d2);
  // return d1.diff(d2);

  if (!d1.isValid() || !d2.isValid()) {
    return -1;
  } else {
    return d1.diff(d2, "s");
  }

}
