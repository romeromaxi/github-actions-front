import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    CompanySolicitationFileHistory,
    CompanySolicitationFileHistoryFields
} from "../../../../types/company/companyData";
import {HttpSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {Alert, Box, Card, CardContent, Stack, Tooltip, Typography} from "@mui/material";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {grey} from "@mui/material/colors";
import {Skeleton} from "@mui/lab";
import {BaseIconWrapper, WrapperIcons} from "../../../icons/Icons";
import {MagnifyingGlass, Warning} from "@phosphor-icons/react";
import {NotePencil} from "phosphor-react";
import {SolicitationCompanyFileContextInterface} from "../../../../types/solicitations/solicitationCompanyFileTypes";

interface CompanySolicitationCompanyFileUpdatesProps {
    handleShowCompanyFile?: (ent: SolicitationCompanyFileContextInterface) => void,
    solicitation?: SolicitationViewDTO
}


const CompanySolicitationCompanyFileUpdates = ({solicitation}: CompanySolicitationCompanyFileUpdatesProps) => {
    const [companyFileList, setCompanyFileList] =
        useState<CompanySolicitationFileHistory[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (solicitation) {
            setCompanyFileList(null);
            HttpSolicitation.getCompanyFileSolicitations(
                solicitation[EntityWithIdFields.Id],
            )
                .then(setCompanyFileList)
                .catch(error => {
                    console.error('Error cargando legajos de solicitud:', error);
                    setCompanyFileList([]);
                });
        }
    }, [solicitation]);

    const onShowCompanyFileEdit = () => {
        if (solicitation) {
            const state = {
                mode: 'edit' as const,
                title: `Legajo de ${solicitation[SolicitationViewDTOFields.CompanyBusinessName]}`,
                fileTypeCode: solicitation[SolicitationViewDTOFields.FileTypeCode]
            };
            navigate(`/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}/legajo`, { state });
        }
    }

    const onShowCompanyFile = (f: CompanySolicitationFileHistory) => {
        if (solicitation) {
            const state = {
                mode: 'view' as const,
                title: `Legajo de contacto`,
                companyFileId: f[EntityWithIdFields.Id],
                fileTypeCode: solicitation[SolicitationViewDTOFields.FileTypeCode],
                sentDate: f[CompanySolicitationFileHistoryFields.Date]
            };
            navigate(`/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}/legajo`, { state });
        }
    }

    return (
        <Card>
            <Stack spacing={4}>
                <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
                    <Stack>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            {
                                solicitation?.[SolicitationViewDTOFields.RequestEditCompanyFile] &&
                                <WrapperIcons Icon={Warning} color={'#F3C84EFF'} size={'md'}/>
                            }
                            <Typography variant={'h4'} fontWeight={500}>Legajos</Typography>
                        </Stack>
                        {
                            solicitation?.[SolicitationViewDTOFields.RequestEditCompanyFile] &&
                            <Typography variant={'caption'} color={'#F3C84EFF'}>
                                {`Actualización solicitada el ${dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.LastRequestEditCompanyFileDate])}`}
                            </Typography>
                        }
                    </Stack>
                    {solicitation?.[SolicitationViewDTOFields.RequestEditCompanyFile] &&
                        <Tooltip title={'Editar el Legajo de la solicitud'}>
                            <Box sx={{cursor: 'pointer'}} onClick={onShowCompanyFileEdit}>
                                <BaseIconWrapper Icon={NotePencil} size={'md'} bg={'#F7FAFC'}/>
                            </Box>
                        </Tooltip>
                    }
                </Stack>
                <CardContent sx={{ maxHeight: '190px', overflowY: 'auto' }}>
                    {companyFileList !== null ? (
                        <Stack spacing={1}>
                            {companyFileList.length !== 0 ? (
                                companyFileList.map((f, idx) => (
                                    <Stack spacing={1} key={`solicitationCompanyFile_${idx}`} sx={{padding: '16px', border: '1px solid #EDF2F7', borderRadius: '16px'}}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Stack>
                                                <Typography
                                                    fontWeight={600}
                                                    fontSize={15}
                                                >{`Legajo N°${companyFileList.length - idx}`}</Typography>
                                                <Typography
                                                    color={grey[500]}
                                                    fontSize={13}
                                                >{dateFormatter.toShortDate(f[CompanySolicitationFileHistoryFields.Date])}</Typography>
                                            </Stack>
                                            <Tooltip title={'Ver detalle'}>
                                                <Box sx={{cursor: 'pointer'}} onClick={() => onShowCompanyFile(f)}>
                                                    <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />
                                                </Box>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                ))
                            ) : (
                                <Alert severity="info">
                                    No se recibieron legajos para esta solicitud
                                </Alert>
                            )}
                        </Stack>
                    ) : (
                        <Stack spacing={1}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} />
                            ))}
                        </Stack>
                    )}
                </CardContent>
            </Stack>
        </Card>
    );
}


export default CompanySolicitationCompanyFileUpdates