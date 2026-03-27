import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";
import {useEffect, useState} from "react";
import {
    CompanySolicitationFileHistory,
    CompanySolicitationFileHistoryFields
} from "../../../../types/company/companyData";
import {useNavigate} from "react-router-dom";
import {useAction} from "../../../../hooks/useAction";
import useAxios from "../../../../hooks/useAxios";
import {HttpSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {Alert, Card, CardContent, CardHeader, Divider, Stack, Typography} from "@mui/material";
import {SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {SearchIconButton, UpdateIconButton} from "../../../buttons/Buttons";
import {grey} from "@mui/material/colors";
import {Skeleton} from "@mui/lab";
import {DialogAlert} from "../../../dialog";


const OffererSolicitationCompanyFileUpdatesThird = () => {
    const { solicitation, getSolicitation } = useSolicitation();
    const [companyFileList, setCompanyFileList] =
        useState<CompanySolicitationFileHistory[]>();
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const navigate = useNavigate();
    const { snackbarSuccess } = useAction();
    const { fetchData } = useAxios();

    useEffect(() => {
        if (solicitation) {
            HttpSolicitation.getCompanyFileSolicitations(
                solicitation[EntityWithIdFields.Id],
            ).then(setCompanyFileList);
        }
    }, [solicitation]);

    const requestUpdate = () => setOpenUpdate(true);

    const onAcceptUpdate = () => {
        if (solicitation)
            fetchData(
                () =>
                    HttpSolicitation.requestSolicitationCompanyFile(
                        solicitation[EntityWithIdFields.Id],
                    ),
                true,
            ).then(() => {
                getSolicitation(solicitation[EntityWithIdFields.Id]);
                setOpenUpdate(false);
                snackbarSuccess('Se ha solicitado la actualización correctamente');
            });
    };

    const seeDetail = (fId: number) => {
        navigate(`/offerer/companySolicitations/solicitationFile/${fId}`)
    };

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
                    <UpdateIconButton
                        sx={{ mt: 1 }}
                        onClick={requestUpdate}
                        tooltipTitle={'Solicitar Actualización'}
                    />
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
                                            >{`Fecha de recepción: ${dateFormatter.toShortDate(f[CompanySolicitationFileHistoryFields.Date])}`}</Typography>
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
                                No se recibieron legajos para esta solicitud
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
            <DialogAlert
                onClose={() => setOpenUpdate(false)}
                open={openUpdate}
                title={'Solicitar actualización de solicitud'}
                textContent={`¿Estás seguro que deseás solicitar la actualización del formulario de la solicitud #${solicitation?.[EntityWithIdFields.Id]}?`}
                onConfirm={onAcceptUpdate}
            />
        </Card>
    );
}


export default OffererSolicitationCompanyFileUpdatesThird