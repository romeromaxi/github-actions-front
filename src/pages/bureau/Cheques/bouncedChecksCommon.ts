import {
    BouncedChequeDetail,
    BouncedChequeDetailFields,
    NosisQueryChequesReasonCodes
} from "types/nosis/nosisData";

export enum BouncedCheckTotalFields {
    Quantity = 'cantidad',
    Amount = 'monto'
}

export interface BouncedCheckTotal {
    [BouncedCheckTotalFields.Quantity]: number;
    [BouncedCheckTotalFields.Amount]: number;
}

export enum BouncedCheckTotalWithReasonsFields {
    CausalReason = 'causal'
}

export interface BouncedCheckTotalWithReasons extends BouncedCheckTotal {
    [BouncedCheckTotalWithReasonsFields.CausalReason]: string;
}

export enum BouncedChecksSummaryFields {
    BouncedChecks = 'totalChequesRechazados',
    PaidChecks = 'totalChequesAbonados',

    ChecksWithoutFunds = 'chequesRechazadosSinFondos',
    ChecksFormalDefects = 'chequesRechazadosDefectosFormales',
    ChecksOtherReasons = 'chequesRechazadosOtrosMotivos',
}

export interface BouncedChecksSummary {
    [BouncedChecksSummaryFields.BouncedChecks]: BouncedCheckTotal,
    [BouncedChecksSummaryFields.PaidChecks]: BouncedCheckTotal,

    [BouncedChecksSummaryFields.ChecksWithoutFunds]: BouncedCheckTotal,
    [BouncedChecksSummaryFields.ChecksFormalDefects]: BouncedCheckTotal,
    [BouncedChecksSummaryFields.ChecksOtherReasons]: BouncedCheckTotal,
}

export interface BouncedChequeSummary {
    PersonalAccount: BouncedChecksSummary,
    LegalAccount: BouncedChecksSummary
}

export function summarizeBouncedCheques(cheques: BouncedChequeDetail[], isLegalPerson: boolean): BouncedChequeSummary {
    const summary: BouncedChequeSummary = {
        PersonalAccount: {
            [BouncedChecksSummaryFields.BouncedChecks]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.PaidChecks]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.ChecksWithoutFunds]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.ChecksFormalDefects]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.ChecksOtherReasons]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
        },
        LegalAccount: {
            [BouncedChecksSummaryFields.BouncedChecks]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.PaidChecks]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.ChecksWithoutFunds]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.ChecksFormalDefects]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
            [BouncedChecksSummaryFields.ChecksOtherReasons]: {
                [BouncedCheckTotalFields.Quantity]: 0, [BouncedCheckTotalFields.Amount]: 0
            },
        }
    };

    cheques.forEach(cheque => {
        const hasJudicialName = cheque[BouncedChequeDetailFields.JudicialName] !== null;
        const hasPaymentDate = !!cheque[BouncedChequeDetailFields.PaymentDate];
        const reasonCode = cheque[BouncedChequeDetailFields.ReasonCode];
        const amount = cheque[BouncedChequeDetailFields.Amount];

        if (isLegalPerson || hasJudicialName) {
            summary.LegalAccount[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Quantity] += 1;
            summary.LegalAccount[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Amount] += amount;

            if (hasPaymentDate) {
                summary.LegalAccount[BouncedChecksSummaryFields.PaidChecks][BouncedCheckTotalFields.Quantity] += 1;
                summary.LegalAccount[BouncedChecksSummaryFields.PaidChecks][BouncedCheckTotalFields.Amount] += amount;
            }
        } else {
            summary.PersonalAccount[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Quantity] += 1;
            summary.PersonalAccount[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Amount] += amount;

            if (hasPaymentDate) {
                summary.PersonalAccount[BouncedChecksSummaryFields.PaidChecks][BouncedCheckTotalFields.Quantity] += 1;
                summary.PersonalAccount[BouncedChecksSummaryFields.PaidChecks][BouncedCheckTotalFields.Amount] += amount;
            }
        }

        switch (reasonCode) {
            case NosisQueryChequesReasonCodes.FormalDefects:
                if (isLegalPerson || hasJudicialName) {
                    summary.LegalAccount[BouncedChecksSummaryFields.ChecksFormalDefects][BouncedCheckTotalFields.Quantity] += 1;
                    summary.LegalAccount[BouncedChecksSummaryFields.ChecksFormalDefects][BouncedCheckTotalFields.Amount] += amount;
                } else {
                    summary.PersonalAccount[BouncedChecksSummaryFields.ChecksFormalDefects][BouncedCheckTotalFields.Quantity] += 1;
                    summary.PersonalAccount[BouncedChecksSummaryFields.ChecksFormalDefects][BouncedCheckTotalFields.Amount] += amount;
                }
                break;

            case NosisQueryChequesReasonCodes.WithoutFunds:
                if (isLegalPerson || hasJudicialName) {
                    summary.LegalAccount[BouncedChecksSummaryFields.ChecksWithoutFunds][BouncedCheckTotalFields.Quantity] += 1;
                    summary.LegalAccount[BouncedChecksSummaryFields.ChecksWithoutFunds][BouncedCheckTotalFields.Amount] += amount;
                } else {
                    summary.PersonalAccount[BouncedChecksSummaryFields.ChecksWithoutFunds][BouncedCheckTotalFields.Quantity] += 1;
                    summary.PersonalAccount[BouncedChecksSummaryFields.ChecksWithoutFunds][BouncedCheckTotalFields.Amount] += amount;
                }
                break;

            default:
                if (isLegalPerson || hasJudicialName) {
                    summary.LegalAccount[BouncedChecksSummaryFields.ChecksOtherReasons][BouncedCheckTotalFields.Quantity] += 1;
                    summary.LegalAccount[BouncedChecksSummaryFields.ChecksOtherReasons][BouncedCheckTotalFields.Amount] += amount;
                } else {
                    summary.PersonalAccount[BouncedChecksSummaryFields.ChecksOtherReasons][BouncedCheckTotalFields.Quantity] += 1;
                    summary.PersonalAccount[BouncedChecksSummaryFields.ChecksOtherReasons][BouncedCheckTotalFields.Amount] += amount;
                }
        }
    });

    return summary;
}