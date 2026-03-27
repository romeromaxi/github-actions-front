import {OffererClientPortfolioDetail, OffererClientPortfolioDetailFields} from "../../../types/offerer/clientPortfolioData";
import {Stack} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import React from "react";
import {stringFormatter} from "util/formatters/stringFormatter";
interface OffererClientPortfolioTabHeaderProps {
    prospect?: OffererClientPortfolioDetail
}
const OffererClientPortfolioTabHeader = ({prospect} : OffererClientPortfolioTabHeaderProps) => {

    return (
        <Stack spacing={1}>
            {
                prospect ?
                    <TypographyBase variant={'body2'} fontWeight={500} tooltip maxLines={2}>
                        {prospect[OffererClientPortfolioDetailFields.BusinessName]}
                    </TypographyBase>
                    :
                    <Skeleton />
            }
            {
                prospect ?
                    <TypographyBase variant={'caption'} color={'text.disabled'} tooltip maxLines={2}>
                        {stringFormatter.formatCuit(prospect[OffererClientPortfolioDetailFields.CUIT])}
                    </TypographyBase>
                    :
                    <Skeleton />
            }
        </Stack>
    )
}
export default OffererClientPortfolioTabHeader