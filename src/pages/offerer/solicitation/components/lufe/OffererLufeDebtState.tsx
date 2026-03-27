import {Card, CardContent, Chip, Divider, Stack, Typography} from "@mui/material";
import {useContext} from "react";
import {LufeInformationContext} from "../../../../../hooks/contexts/LufeInformationContext";
import {
    LufeDebtDetail, LufeDebtDetailFields,
    LufeDebtFields,
    LufeDebtState,
    LufeDebtStateFields
} from "../../../../../types/lufe/lufeDebtState";
import {LufeDetailFields} from "../../../../../types/lufe/lufeData";
import {Skeleton} from "@mui/lab";
import {ITableColumn, TableList} from "../../../../../components/table";
import OffererLufeDebtStateChipHeader from "./components/debt/OffererLufeDebtStateChipHeader";


const OffererLufeDebtState = () => {
    const { loading, error, lufeData } = useContext(LufeInformationContext)
    
    const lufeDebtStateData: LufeDebtState | undefined = lufeData?.[LufeDetailFields.DebtStateRequest]
    const lufeDebts: LufeDebtDetail[] | undefined = lufeDebtStateData?.[LufeDebtStateFields.Debts]?.[LufeDebtFields.Debt]
    
    const cols: ITableColumn[] = [
        {label: 'Impuesto', value: LufeDebtDetailFields.Tax},
        {label: 'Periodo', value: LufeDebtDetailFields.FiscalPeriod}
    ]
    
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <OffererLufeDebtStateChipHeader title={'Tiene deuda impositiva'}
                                                    loading={loading}
                                                    hasDebt={lufeDebtStateData && lufeDebtStateData?.[LufeDebtStateFields.HasSocialTaxDebt]}
                    />
                    <Divider />
                    <OffererLufeDebtStateChipHeader title={'Tiene deuda social'}
                                                    loading={loading}
                                                    hasDebt={lufeDebtStateData && lufeDebtStateData?.[LufeDebtStateFields.HasSocialDebt]}
                    />
                    <Divider />
                    <Typography variant={'h5'}>Deudas</Typography>
                    <TableList<LufeDebtState> entityList={lufeDebts}
                                              columns={cols}
                                              isLoading={loading}
                                              error={error}
                    />
                </Stack>
            </CardContent>
        </Card>
    )
}


export default OffererLufeDebtState