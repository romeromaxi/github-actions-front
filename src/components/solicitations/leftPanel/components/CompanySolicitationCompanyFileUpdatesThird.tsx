import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";
import {useEffect, useState} from "react";
import {
    CompanySolicitationFileHistory,
    CompanySolicitationFileHistoryFields
} from "../../../../types/company/companyData";
import {useNavigate} from "react-router-dom";
import {HttpSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {Alert, Card, CardContent, CardHeader, Divider, Stack, Typography} from "@mui/material";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {BusinessIconButton, SearchIconButton} from "../../../buttons/Buttons";
import {grey} from "@mui/material/colors";
import {Skeleton} from "@mui/lab";


const CompanySolicitationCompanyFileUpdatesThird = () => {
    const { solicitation } = useSolicitation();
    const [companyFileList, setCompanyFileList] =
        useState<CompanySolicitationFileHistory[]>();
    const navigate = useNavigate();

    useEffect(() => {
        if (solicitation) {
            HttpSolicitation.getCompanyFileSolicitations(
                solicitation[EntityWithIdFields.Id],
            ).then(setCompanyFileList);
        }
    }, [solicitation]);

    const seeDetail = (fId: number) => {
        navigate(`/mis-presentaciones/solicitud/${fId}/legajo/detalle`);
    }

    const editCompanyFile = () =>
        navigate(
            `/mis-presentaciones/solicitud/${solicitation?.[SolicitationViewDTOFields.CompanyId]}/${solicitation?.[EntityWithIdFields.Id]}/legajo/detalle?tipo=2`,
        );

    return (
        <Card>
            <CardHeader
                title={'Listado de formularios'}
                subheader={
                    solicitation?.[SolicitationViewDTOFields.RequestEditCompanyFile]
                        ? `Actualización solicitada el ${dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.LastRequestEditCompanyFileDate])}`
                        : undefined
                }
                action={
                    solicitation?.[SolicitationViewDTOFields.RequestEditCompanyFile] ?
                        <BusinessIconButton
                            sx={{ mt: 1 }}
                            onClick={editCompanyFile}
                            tooltipTitle={'Editar el formulario de la solicitud'}
                        />
                        : undefined
                }
            />
            <CardContent sx={{ maxHeight: '190px', overflowY: 'auto' }}>
                {companyFileList ? (
                    <Stack spacing={1}>
                        {companyFileList.length !== 0 ? (
                            companyFileList.map((f, idx) => (
                                <Stack spacing={1} key={`solicitationCompanyFile_${idx}`}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Stack>
                                            <Typography
                                                fontWeight={600}
                                                fontSize={15}
                                            >{`Formulario N°${companyFileList.length - idx}`}</Typography>
                                            <Typography
                                                color={grey[500]}
                                                fontSize={13}
                                            >{`Fecha de envío: ${dateFormatter.toShortDate(f[CompanySolicitationFileHistoryFields.Date])}`}</Typography>
                                        </Stack>
                                        <SearchIconButton
                                            onClick={() => seeDetail(f[EntityWithIdFields.Id])}
                                            tooltipTitle={'Ver detalle'}
                                        />
                                    </Stack>
                                    <Divider />
                                </Stack>
                            ))
                        ) : (
                            <Alert severity="info">
                                No se recibieron formularios para esta solicitud
                            </Alert>
                        )}
                    </Stack>
                ) : (
                    <Stack spacing={1}>
                        {Array.from({ length: 6 }).map(() => (
                            <Skeleton />
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}


export default CompanySolicitationCompanyFileUpdatesThird