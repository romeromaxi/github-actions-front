export const numberFormatter = {
  toStringWithDecimals: (
    value?: number | null,
    minDigits = 2,
    maxDigits = 2,
  ): string => {
    if (value === null || !value) return '-';

    return `${value.toLocaleString('de-DE', { minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits })}`;
  },

  toStringWithAmount: (
    value: number | null | undefined,
    codCurrency: string = '',
    fractionDigits = 2,
  ): string => {
    if (value === null || value === undefined) return '-';

    return `${codCurrency} ${value.toLocaleString('de-DE', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`;
  },

  toStringWithPercentage: (
    value?: number | null,
    minDigits: number = 2,
    maxDigits: number = 2,
  ): string => {
    if (value === null || !value) return '-';

    return `${value.toLocaleString('de-DE', { minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits })} %`;
  },

  toNumberWithoutDecimal: (value: number | null | undefined): number => {
    if (!value) return 0;

    return value.toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) as unknown as number;
  },

  toListFromString: (value: string | null): number[] | undefined => {
    if (!value) return undefined;

    let strArray: string[] = value.split(',');

    return strArray.map((x) => parseInt(x));
  },
};
