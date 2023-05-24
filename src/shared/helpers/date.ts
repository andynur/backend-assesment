import moment from 'moment';
export const DATE_FORMAT = 'YYYY-MM-DD';
export function weekOfMonth(input = moment()) {
  const firstDayOfMonth = input.clone().startOf('month');
  const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');

  const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

  return Math.ceil((input.date() + offset) / 7);
}

export function dateRangeArray(
  startDate: Date,
  endDate: Date,
  format: string,
): string[] {
  const listDate: string[] = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    listDate.push(moment(d).clone().format(format));
  }

  return listDate;
}

export function getWeekInput(nowDate: moment.Moment) {
  let monthStartWeekDay = nowDate.clone().startOf('month').isoWeek();
  if (nowDate.clone().month() === 0 && monthStartWeekDay == 52) {
    monthStartWeekDay = 0;
  }

  return nowDate.isoWeek() - monthStartWeekDay + 1;
}
