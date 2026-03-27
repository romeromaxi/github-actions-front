import React, {ReactNode, ElementType, useContext} from "react";
import {Card, CardContent, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../../../../components/icons/Icons";
import {stringFormatter} from "../../../../../../util/formatters/stringFormatter";
import {DataWithLabel} from "../../../../../../components/misc/DataWithLabel";
import {dateFormatter} from "../../../../../../util/formatters/dateFormatter";
import {LufeInformationContext} from "../../../../../../hooks/contexts/LufeInformationContext";
import {LufeDetailFields} from "../../../../../../types/lufe/lufeData";
import {Skeleton} from "@mui/lab";
import OffererLufePymeLastModifications from "./pyme/OffererLufePymeLastModifications";
import {
    LufePymeLastModifications,
    LufePymeRequest,
    LufePymeRequestFields
} from "../../../../../../types/lufe/lufePymeData";


interface OffererLufeTabWrapperProps {
    children: ReactNode,
    icon: ElementType | string,
    title: string
}

const OffererLufeTabWrapper = ({children, icon, title} : OffererLufeTabWrapperProps) => {
    const { loading, lufeData } = useContext(LufeInformationContext)
    const pymeLufeData: LufePymeRequest | undefined = lufeData?.[LufeDetailFields.PymeModelRequest]
    const pymeLastModifications: LufePymeLastModifications | undefined = pymeLufeData?.[LufePymeRequestFields.LastModifications]
    
    return (
        <Stack spacing={2}>
            <Card>
                <CardContent>
                    <Stack spacing={1}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                            <DataWithLabel rowDirection 
                                           label={'CUIT'}
                                           data={!loading && lufeData ? stringFormatter.formatCuit(lufeData[LufeDetailFields.CUIT]) : <Skeleton />}
                            />
                            <DataWithLabel rowDirection
                                           label={'Fecha de consulta'}
                                           data={!loading && lufeData ? dateFormatter.toShortDate(lufeData[LufeDetailFields.RequestDate]) : <Skeleton />}
                            />
                        </Stack>

                        <OffererLufePymeLastModifications data={pymeLastModifications} loading={loading} />
                    </Stack>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <BaseIconWrapper Icon={icon} size={'md'} bg={'#F7FAFC'}/>
                        <Typography variant={'h4'} fontWeight={500}>{title}</Typography>
                    </Stack>
                </CardContent>
            </Card>
            {children}
        </Stack>
    )
}

export default OffererLufeTabWrapper