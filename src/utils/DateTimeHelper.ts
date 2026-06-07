import dayjs from "dayjs";
// import "moment/locale/ar";

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



// export default {
//   _isToday(date) {
//     var inputDate = new Date(date || undefined);
//     // console.log("inputDate", inputDate);

//     // Get today's date
//     var todaysDate = new Date();
//     // console.log("todaysDate", todaysDate);

//     // call setHours to take the time out of the comparison
//     if (date) {
//       // Date equals today's date
//       return inputDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0);
//     } else {
//       return true;
//     }
//   },
//   _isYesterday(date) {
//     var isYesterday = require("dayjs/plugin/isYesterday");

//     dayjs.extend(isYesterday);

//     return dayjs(date).isYesterday(); // true
//   },
//   _fromNow(date) {
//     var relativeTime = require("dayjs/plugin/relativeTime");
//     dayjs.extend(relativeTime);
//     return dayjs(date).fromNow();
//   },

//   _formatDate(txt) {
//     return !dayjs(txt).isValid() ? txt : dayjs(txt)?.format("MMM DD YYYY");
//   },

//   _dateToPersian(txt) {
//     try {
//       const date = !!txt ? new Date(txt) : new Date();

//       return {
//         InEnglish: new Intl.DateTimeFormat("en-u-ca-persian", {
//           dateStyle: "full",
//         }).format(date),
//         InPersian: new Intl.DateTimeFormat("fa-u-ca-persian", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//         }).format(date),

//         InPersianLatinNumbers: new Intl.DateTimeFormat(
//           "fa-u-ca-persian-nu-latn",
//           { day: "2-digit", month: "2-digit", year: "numeric" }
//         ).format(date),
//         InArabic: new Intl.DateTimeFormat("ar-u-ca-persian", {
//           dateStyle: "full",
//         }).format(date),
//       };
//     } catch (error) {
//       console.log(error);

//       return {};
//     }
//   },

//   _formatDateWithDayName(txt) {
//     return !dayjs(txt).isValid() ? txt : dayjs(txt)?.format("ddd, MMM DD YYYY");
//   },
//   _formatTime(txt) {
//     return !dayjs(txt).isValid() ? txt : dayjs(txt).format("hh:mm A");
//   },

//   _dateTitle(d1, d2) {
//     d2 = !TextHelper.empty(d2)
//       ? ` - ${this._formatTime(d2)} (${this._dateDifference(d1, d2)} min)`
//       : "";

//     return `${this._formatTime(d1)} ${d2}`;
//   },

//   _dateDifference(d1, d2) {
//     // mrvTxtTest.log(d1, d2);
//     d1 = dayjs(d1);
//     d2 = dayjs(d2);
//     // return d1.diff(d2);

//     if (!d1.isValid() || !d2.isValid()) {
//       return -1;
//     } else {
//       return d1.diff(d2, "s");
//     }
//   },
//   _isAfterByDay(d1, d2) {
//     return this._dateDifference(d1, d2) > 0;
//   },
//   _isAfterOrSameByDay(d1, d2) {
//     return this._dateDifference(d1, d2) >= 0;
//   },
//   _isBeforeByDay(d1, d2) {
//     return this._dateDifference(d1, d2) < 0;
//   },
//   _isBeforeOrSameByDay(d1, d2) {
//     return this._dateDifference(d1, d2) <= 0;
//   },
//   _dateDifferenceMiliSec(d1, d2) {
//     // mrvTxtTest.log(d1, d2);
//     d1 = dayjs(d1);
//     d2 = dayjs(d2);
//     // return d1.diff(d2);
//     return Math.floor(d1.diff(d2));
//   },
//   _dateDifferenceSec(d1, d2) {
//     // mrvTxtTest.log(d1, d2);
//     d1 = dayjs(d1);
//     d2 = dayjs(d2);
//     // return d1.diff(d2);
//     return Math.floor(d1.diff(d2, "s"));
//   },
//   _dateDifferenceHour(d1, d2) {
//     // mrvTxtTest.log(d1, d2);
//     d1 = dayjs(d1);
//     d2 = dayjs(d2);
//     // return d1.diff(d2);
//     return Math.floor(d1.diff(d2, "h"));
//   },
//   numberTextStandard(n, len) {
//     const o = len - n.toString()?.length;
//     if (o < 0) {
//       return "";
//     }

//     const os = "0".repeat(o);
//     return os + n;
//   },

//   _formatter(t) {
//     return this.numberTextStandard(t, 2);
//   },

//   _timeCalculation(time) {
//     const hour = Math.floor(time / 3600);
//     const min = Math.floor((time - hour * 3600) / 60);
//     const sec = time - (hour * 3600 + min * 60);

//     return {
//       hour: this._formatter(hour) || "00",
//       min: this._formatter(min) || "00",
//       sec: this._formatter(sec) || "00",
//       total:
//         this._formatter(hour) +
//         "h:" +
//         this._formatter(min) +
//         "m:" +
//         this._formatter(sec) +
//         "s",
//     };
//   },

//   today() {
//     var firstDay = new Date(); //.toUTCString();
//     var lastDay = new Date(); //.toUTCString();
//     return { firstDay, lastDay };
//   },

//   thisWeek() {
//     var curr = new Date(); // get current date
//     var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
//     var last = first + 6; // last day is the first day + 6

//     var firstDay = new Date(curr.setDate(first)); //.toUTCString();
//     var lastDay = new Date(curr.setDate(last)); //.toUTCString();
//     return { firstDay, lastDay };
//   },

//   thisMonth() {
//     var date = new Date(),
//       y = date.getFullYear(),
//       m = date.getMonth();
//     var firstDay = new Date(y, m, 2);
//     var lastDay = new Date(y, m + 1, 1);
//     return { firstDay, lastDay };
//   },

//   lastMonth() {
//     var date = new Date(),
//       y = date.getFullYear(),
//       m = date.getMonth() - 1;
//     var firstDay = new Date(y, m, 2);
//     var lastDay = new Date(y, m + 1, 1);
//     return { firstDay, lastDay };
//   },
//   nextDay(day) {
//     var day = new Date(day);
//     console.log(day); // Apr 30 2000

//     var nextDay = new Date(day);
//     nextDay.setDate(day.getDate() + 1);
//     return nextDay.toString();
//   },

//   testDateTimeStyleSupport() {
//     let support = false;
//     const tester = {
//       get dateStyle() {
//         support = true;
//       },
//     };
//     new Intl.DateTimeFormat(undefined, tester);
//     return support;
//   },

//   _timeDuration(start, end) {
//     start = Math.floor(start / 100);
//     end = Math.floor(end / 100);

//     // console.log("start", start, "end", end);
//     start = (start / 100).toString();
//     end = (end / 100).toString();

//     start = start.split(".");
//     end = end.split(".");

//     var startDate = new Date(0, 0, 0, start[0], start[1] || 0, 0);
//     var endDate = new Date(0, 0, 0, end[0], end[1] || 0, 0);
//     var diff = endDate.getTime() - startDate.getTime();
//     var hours = Math.floor(diff / 1000 / 60 / 60);
//     diff -= hours * 1000 * 60 * 60;
//     var minutes = Math.floor(diff / 1000 / 60);

//     // If using time pickers with 24 hours format, add the below line get exact hours
//     if (hours < 0) hours = hours + 24;

//     return (
//       (hours <= 9 ? "0" : "") +
//       hours +
//       ":" +
//       (minutes <= 9 ? "0" : "") +
//       minutes
//     );
//   },

//   _timeFloatSlicer(t) {
//     // t = 175030;
//     if (!!!t) {
//       return "00:00:00";
//     }
//     t = t.toString();
//     if (t.length < 6) {
//       t = "0" + t;
//     }
//     const ts = t.toString();
//     const hour = ts.slice(0, 2);
//     const min = ts.slice(2, 4);
//     const sec = ts.slice(4, 6);
//     return `${hour}:${min}:${sec}`;
//   },

//   _timeFloatToTimeLine(t) {
//     t = this._timeFloatSlicer(t);
//     t = t.split(":");
//     return safeFloat(t[0]) * 60 + safeFloat(t[1]);
//   },
// };
