import {Document, DocumentFields} from "../../../../../types/files/filesData";
import {Stack, Tooltip, Typography} from "@mui/material";
import {BaseIconWrapper, WrapperIcons} from "../../../../../components/icons/Icons";
import {FileText} from "@phosphor-icons/react";
import React from "react";
import {DownloadSimple} from "phosphor-react";
import {Skeleton} from "@mui/lab";
import {TypographyBase} from "../../../../../components/misc/TypographyBase";
interface SolicitationRequestedFileFormDocumentsProps {
    docs?: Document[],
    loading: boolean,
    onDownloadAll: () => void
}


const SolicitationRequestedFileFormDocuments = ({docs, loading, onDownloadAll} : SolicitationRequestedFileFormDocumentsProps) => {

    return (
        docs && docs.length == 0 ?
        <React.Fragment></React.Fragment>
            :
        <Stack spacing={1}>
            {loading &&
                <Stack sx={{borderRadius: '16px', border: '1px solid #C3CCD7', padding: '24px'}}>
                    <Skeleton width={'100%'}/>
                </Stack>
            }
            {
                docs &&
                <Stack spacing={2}>
                    <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
                        <Typography variant={'h4'}>Formulario adjunto</Typography>
                        <Tooltip title={'Descargar todo'}>
                            <div onClick={onDownloadAll} style={{cursor: 'pointer'}}>
                                <BaseIconWrapper Icon={DownloadSimple} size={'md'} />
                            </div>
                        </Tooltip>
                    </Stack>
                    {docs.map((d) => 
                        <Stack sx={{borderRadius: '16px', border: '1px solid #C3CCD7', padding: '24px'}}>
                            <Stack direction={'row'} alignItems={'center'} spacing={1} overflow={'hidden'}>
                                <WrapperIcons Icon={FileText} size={'sm'} />
                                <TypographyBase variant={'subtitle1'} fontWeight={500} maxLines={1} tooltip>{d[DocumentFields.FileDesc]}</TypographyBase>
                            </Stack>
                            <Typography fontSize={12} color={'#818992'}>{`${Math.floor(d[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
                        </Stack>
                    )}
                </Stack>
            }
        </Stack>    
    )
    
}


export default SolicitationRequestedFileFormDocuments