import moment from 'moment';
import 'moment/locale/es';

const longDateFormat: string = 'DD/MM/YYYY HH:mm';
const clockDateFormat: string = 'HH:mm'
const shortDateFormat: string = 'DD/MM/YYYY';
const shortDateFormatISO: string = 'YYYY/MM/DD';
const monthDateFormat: string = 'MMMM';
const monthAndYearDateFormat: string = 'MMMM, YYYY';
const monthAndDayDateFormat: string = 'DD/MM';
const yearDateFormat: string = 'YYYY';
const yearMonthFormat: string = 'MM/YYYY';
const shortDateWithMonthNameFormat: string = 'DD MMM YYYY';

export const dateFormatter = {
    toShortDate: (date: Date | string | null | undefined): string => {
        if (!date) return '-';

        return moment(date).format(shortDateFormat);
    },

    toShortDateWithMonthName: (date: Date | string | null | undefined): string => {
        if (!date) return '-';

        return moment(date).locale('es').format(shortDateWithMonthNameFormat);
    },

    toYearDate: (date: Date | string | null | undefined): string => {
        if (!date) return '';

        return moment(date).format(yearDateFormat);
    },

    toISOShortDate: (date: Date | string | null): string => {
        if (!date) return '';

        return moment(date).format(shortDateFormatISO);
    },

    toLongDate: (date: Date | string): string => {
        if (!date) return '';

        return moment(date).format(longDateFormat);
    },

    isOlderAsOfToday: (date: Date | string | null): boolean => {
        if (!date) return false;

        return date > new Date();
    },

    toMonthName: (date: Date | string, capitalize = false): string => {
        if (!date) return '';

        let monthName = moment(date).locale('es').format(monthDateFormat);

        if (capitalize)
            return monthName.charAt(0).toUpperCase() + monthName.slice(1);

        return monthName;
    },

    toMonthNameWithYear: (date: Date | string, capitalize = false): string => {
        if (!date) return '';

        let monthNameWithYear = moment(date)
            .locale('es')
            .format(monthAndYearDateFormat);

        if (capitalize)
            return (
                monthNameWithYear.charAt(0).toUpperCase() + monthNameWithYear.slice(1)
            );

        return monthNameWithYear;
    },

    toMonthNameWithDay: (date: Date | string, capitalize = false): string => {
        if (!date) return '';

        let monthNameWithDay = moment(date)
            .locale('es')
            .format(monthAndDayDateFormat);

        if (capitalize)
            return (
                monthNameWithDay.charAt(0).toUpperCase() + monthNameWithDay.slice(1)
            );

        return monthNameWithDay;
    },

    toMonthInitialsName: (date: Date | string): string => {
        const monthName = dateFormatter.toMonthName(date, true);

        return monthName.substring(0, 3);
    },

    toYearMonth: (date: Date | string | null | undefined): string => {
        if (!date) return '-';

        return moment(date).format(yearMonthFormat);
    },

    toClockFormat: (date: Date | string) => {
        if (!date) return '';
        return moment(date).format(clockDateFormat)
    },

    toFormat: (date: Date | string, format: string): string => {
        if (!date) return '';
        return moment(date).format(format);
    },

    parsePeriod: (period: string | null | undefined): string => {
        if (!period || period.length !== 6) return '';

        const year = period.slice(0, 4);
        const month = period.slice(4, 6);

        return `${year}/${month}`;
    },
    
    formatTimeAgo: (date: Date | string | undefined): string => {
        if (!date) return '-';

        const now = new Date();
        const parsedDate = (typeof date == 'string') ? new Date(date) : date;
        
        const diffMs = now.getTime() - parsedDate.getTime();

        if (diffMs < 0)
            return "Hace 0 minutos";

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes < 60)
            return `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`;
        
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 24)
            return `Hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 365)
            return `Hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`;

        const diffYears = Math.floor(diffDays / 365.25);
        
        return `Hace ${diffYears} año${diffYears !== 1 ? "s" : ""}`;
    }
};