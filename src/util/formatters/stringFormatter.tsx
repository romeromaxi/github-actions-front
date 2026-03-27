export const stringFormatter = {
    toTitleCase: (value: string | null | undefined): string | null => {
        if (!value) return null;

        return value
            .toLowerCase()
            .replace(/(^|\s)\p{L}/gu, (char) => char.toUpperCase());
    },
    
    toLowerFirst: (value: string | null | undefined): string => {
        if (!value) return '-';

        return value.charAt(0).toLowerCase() + value.slice(1);
    },

    cutIfHaveMoreThan: (value: string | null, length: number): string => {
        if (!value) return '';

        if (value.length > length) return `${value.substring(0, length)}...`;

        return value;
    },

    formatCuit: (cuit: string = ''): string => {
        if (!cuit) return ``
        
        let digitVerifier: string = cuit.substring(0, 2);
        let document: string = cuit.substring(2, 10); //.toLocaleString('de-DE');
        let lastDigit: string = cuit.substring(10);

        return `${digitVerifier}-${document}-${lastDigit}`;
    },

    isValidCuit: (cuit: string): boolean => {
        cuit = cuit.replace('-', '');
        const numbers: number[] = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let total: number = 0;
        cuit = cuit.replace('-', '');

        numbers.forEach((n, index) => {
            if (cuit) total += n * parseInt(cuit[index]);
        });

        let remainder: number = total % 11;

        let checkDigit: number = parseInt(cuit[cuit.length - 1]);
        let lastDigit: number = remainder
            ? remainder === 1
                ? 9
                : 11 - remainder
            : 0;
        return checkDigit === lastDigit;
    },

    phoneNumberWithAreaCode: (
        areaCode?: string,
        phoneNumber?: string,
    ): string => {
        if (!areaCode && !phoneNumber) return '';

        let prefixArea: string = areaCode ? `(${areaCode}) ` : '';

        return `${prefixArea}${phoneNumber || ''}`;
    },

    toFullPhoneNumber: (
        phoneCode?: string,
        areaCode?: string,
        phoneNumber?: string,
    ): string => {
        if (!phoneNumber) return '';

        const prefixPhone = phoneCode ? `+${phoneCode} ` : '';
        const prefixArea = areaCode ? `(${areaCode}) ` : '';

        return `${prefixPhone}${prefixArea}${phoneNumber}`;
    },

    splitStringByLength: (str: string, len: number): string[] => {
        const temp = str.split(' ').reduce(
            (acc: [string[]], c) => {
                // Get the number of nested arrays
                const currIndex = acc.length - 1;

                // Join up the last array and get its length
                const currLen = acc[currIndex].join(' ').length;

                // If the length of that content and the new word
                // in the iteration exceeds 20 chars push the new
                // word to a new array
                if (currLen + c.length > len) {
                    acc.push([c]);

                    // otherwise add it to the existing array
                } else {
                    acc[currIndex].push(c);
                }

                return acc;
            },
            [[]],
        );

        return temp.map((arr) => arr.join(' '));
    },

    normalizeUrl: (url: string | undefined): string => {
        if (!url) return '';

        return url.replace(/\\/g, "/")
    },
};
