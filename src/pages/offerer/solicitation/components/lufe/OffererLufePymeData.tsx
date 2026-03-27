import {Card, CardContent, Divider, Stack, Typography} from "@mui/material";
import React, {useContext} from "react";
import {
    LufePymeCertificate,
    LufePymeRequest,
    LufePymeRequestFields
} from "../../../../../types/lufe/lufePymeData";
import {LufeInformationContext} from "../../../../../hooks/contexts/LufeInformationContext";
import {LufeDetailFields} from "../../../../../types/lufe/lufeData";
import OffererLufePymeGeneralData from "./components/pyme/OffererLufePymeGeneralData";
import OffererLufePymeCertificate from "./components/pyme/OffererLufePymeCertificate";
import OffererLufePymeTableLists from "./components/pyme/OffererLufePymeTableLists";


const OffererLufePymeData = () => {
    const { loading, error, lufeData } = useContext(LufeInformationContext)
    
    const pymeLufeData: LufePymeRequest | undefined = lufeData?.[LufeDetailFields.PymeModelRequest]
    const pymeCertificateData: LufePymeCertificate | undefined = pymeLufeData?.[LufePymeRequestFields.PymeCertificate]
    
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant='h5'>Información general</Typography>
                    <OffererLufePymeGeneralData data={pymeLufeData} loading={loading}/>
                    <Divider />
                    <Typography variant='h5'>Certificado PyME</Typography>
                    <OffererLufePymeCertificate loading={loading} data={pymeCertificateData} />
                    <Divider />
                    <OffererLufePymeTableLists pymeData={pymeLufeData} loading={loading} error={error} />
                </Stack>
            </CardContent>
        </Card>
    )
}


export default OffererLufePymeData