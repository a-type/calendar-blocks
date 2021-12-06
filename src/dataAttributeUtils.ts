/** serializes a date into a data- attribute value */
export const serializeDateValue = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0);
  startOfDay.setMinutes(0);
  startOfDay.setSeconds(0);
  startOfDay.setMilliseconds(0);
  return startOfDay.getTime().toString();
};
