import React, {useEffect, useState} from 'react';
import {Stack} from "@mui/material";
import { BouncedChequeDetail } from 'types/nosis/nosisData';
import BouncedChecksTotalSummary from "./BouncedChecksTotalSummary";
import { BouncedChecksSummary, summarizeBouncedCheques } from './bouncedChecksCommon';

interface BouncedChequesQuantityTableProps {
    bouncedCheques?: BouncedChequeDetail[];
    isLegalPerson: boolean;
    loading: boolean;
    error: boolean;
    lastDate?: Date;
}

function BouncedChequesQuantityTable({
  bouncedCheques,
  isLegalPerson,
  loading,
  error,
  lastDate  
}: BouncedChequesQuantityTableProps) {    
    const [summaryPersonalData, setSummaryPersonalData] = useState<BouncedChecksSummary>();
    const [summaryLegalData, setSummaryLegalData] = useState<BouncedChecksSummary>();
    
    useEffect(() => {
        if (bouncedCheques) {
            const summaries = summarizeBouncedCheques(bouncedCheques, isLegalPerson)
            
            setSummaryLegalData(summaries.LegalAccount);
            setSummaryPersonalData(summaries.PersonalAccount);
        }
    }, [bouncedCheques, isLegalPerson]);
  
    return (
        <Stack spacing={3}>
            {
                !isLegalPerson &&
                    <BouncedChecksTotalSummary title={'Cheques rechazados en cuentas personales'}
                                               subtitle={'Detalle de cheques rechazados asociados a cuentas personales, incluyendo montos, cantidad y causales registradas.'}
                                               summary={summaryPersonalData}
                                               loading={loading}
                                               error={error}
                                               lastDate={lastDate}
                    />
            }
            
            <BouncedChecksTotalSummary title={'Cheques rechazados en cuentas de personas jurídicas'}
                                       subtitle={'Detalle de cheques rechazados vinculados a cuentas de personas jurídicas, con información de montos, cantidad y causales.'}
                                       summary={summaryLegalData}
                                       loading={loading}
                                       error={error}
                                       lastDate={lastDate}
            />
        </Stack>
    );
}

export default BouncedChequesQuantityTable;
