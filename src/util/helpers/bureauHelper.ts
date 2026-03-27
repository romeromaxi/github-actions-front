import {themeColorDefinition} from "util/themes/definitions";
import {
    BouncedChequeDetailFields,
    CurrentDebtFields,
    CurrentDebtLastTwelveMonthsFields,
    NosisDetailQuery,
    NosisDetailQueryFields
} from "types/nosis/nosisData";

interface BureauScoreRangeColorTpye {
    light: string,
    main: string
}

const RangeColorDefault : BureauScoreRangeColorTpye = {
    light: '',
    main: ''
}

interface BureauScoreRangeTpye {
    min: number,
    max: number,
    color: BureauScoreRangeColorTpye,
}

export const BureauScoreRange: BureauScoreRangeTpye[] = [
    {
        min: 1,
        max: 300,
        color: {
            main: themeColorDefinition.systemFeedback.error.primary,
            light: themeColorDefinition.systemFeedback.error.secondary
        }
    },
    {
        min: 301,
        max: 500,
        color: {
            main: themeColorDefinition.systemFeedback.warning.primary,
            light: themeColorDefinition.systemFeedback.warning.secondary
        }
    },
    {
        min: 501,
        max: 650,
        color: {
            main: "#EBBD45",
            light: '#FCF6E6'
        }
    },
    {
        min: 651,
        max: 999,
        color: {
            main: themeColorDefinition.systemFeedback.success.primary,
            light: themeColorDefinition.systemFeedback.success.secondary
        }
    }
]

export const getTypeColorByScore = (scoring: number): BureauScoreRangeColorTpye =>
    BureauScoreRange.find(x => x.min <= scoring && scoring <= x.max)?.color
    || RangeColorDefault;

export const getMainColorByScore = (scoring: number): string =>
    getTypeColorByScore(scoring).main;

const getCurrentSituation = (query: NosisDetailQuery | undefined): number => {
    const currentDebt = query?.[NosisDetailQueryFields.CurrentDebt];

    if (!currentDebt) return 0;
    else if (currentDebt[CurrentDebtFields.SitSixQuantity] > 0) return 6;
    else if (currentDebt[CurrentDebtFields.SitFiveQuantity] > 0) return 5;
    else if (currentDebt[CurrentDebtFields.SitFourQuantity] > 0) return 4;
    else if (currentDebt[CurrentDebtFields.SitThreeQuantity] > 0) return 3;
    else if (currentDebt[CurrentDebtFields.SitTwoQuantity] > 0) return 2;
    else if (currentDebt[CurrentDebtFields.SitOneQuantity] > 0) return 1;
    return 0;
}

const getMaxSituationSixMonths = (query: NosisDetailQuery | undefined): number => {
    const latestDebts = query?.[NosisDetailQueryFields.CurrentDebtLastTwelveMonthsLst];

    if (!latestDebts)
        return 0;

    let maxSituation: number = 0;

    const allPeriods = Array
        .from(new Set(latestDebts.map(d => d[CurrentDebtLastTwelveMonthsFields.Period])))
        .sort()
        .reverse()
        .slice(0, 6);

    latestDebts.forEach(x => {
        if (allPeriods.includes(x[CurrentDebtLastTwelveMonthsFields.Period])) {
            maxSituation = Math.max(maxSituation, x[CurrentDebtLastTwelveMonthsFields.Situation] as number)
        }
    })

    return maxSituation;
}

const getBouncedChecksSummary = (query: NosisDetailQuery | undefined) => {
    const checks = query?.[NosisDetailQueryFields.BouncedChequesDetailList];
    const summary = {
        totals: 0,
        paid: 0
    }

    checks?.forEach(oneCheck => {
        if (!!oneCheck[BouncedChequeDetailFields.PaymentDate])
            summary.paid += 1;

        summary.totals += 1;
    })

    return summary;
}
