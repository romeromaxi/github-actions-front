const DAY_IN_MILISECONDS: number = 24 * 60 * 60 * 1000;

export const dateHelper = {
  getLastDate: (day: number, month: number): Date => {
    let dateToday: Date = new Date();
    let yearToday: number = dateToday.getFullYear();
    let lastDate: Date = new Date(yearToday, month - 1, day);

    if (lastDate < dateToday) return lastDate;

    return new Date(yearToday - 1, month - 1, day);
  },

  getYearByDateString: (date: string): number => {
    return parseInt(date.substring(0, 4));
  },

  getNextDate: (numberDays: number): Date => {
    let today = new Date();
    return new Date(today.getTime() + numberDays * DAY_IN_MILISECONDS);
  },

  isValidDate: (date: string): boolean => !isNaN(Date.parse(date)),
};
