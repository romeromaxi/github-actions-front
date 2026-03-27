import {LufeAuthorityData, LufeAuthorityDataFields} from "../../../../../types/lufe/lufeAuthorityData";
import {ITableColumn, TableColumnType, TableList} from "../../../../../components/table";
import {useContext} from "react";
import {LufeInformationContext} from "../../../../../hooks/contexts/LufeInformationContext";
import {LufeDetailFields} from "../../../../../types/lufe/lufeData";
import {Typography} from "@mui/material";
import {numberFormatter} from "../../../../../util/formatters/numberFormatter";


const OffererLufeAuthorities = () => {
    const { loading, error, lufeData } = useContext(LufeInformationContext)
    
    const cols: ITableColumn[] = [
        {label: 'CUIT', value: LufeAuthorityDataFields.CUIT},
        {label: 'Denominación', value: LufeAuthorityDataFields.Denomination},
        {label: 'Cargo', value: LufeAuthorityDataFields.Charge},
        {label: 'Accionista', value: LufeAuthorityDataFields.Shareholder, type: TableColumnType.Boolean},
        {label: '% Acc.', value: LufeAuthorityDataFields.Percentage, onRenderCell: (item) => 
            <Typography>{
                item[LufeAuthorityDataFields.Shareholder] ?
                numberFormatter.toStringWithPercentage(item[LufeAuthorityDataFields.Percentage])
                : '-'
            }
            </Typography>
        }
    ]
    
    return (
        <TableList<LufeAuthorityData> entityList={lufeData?.[LufeDetailFields.AuthoritiesModelRequest]}
                                      columns={cols}
                                      isLoading={loading}
                                      error={error}
                                      keepBorderRadius
        />
    )
}


export default OffererLufeAuthorities