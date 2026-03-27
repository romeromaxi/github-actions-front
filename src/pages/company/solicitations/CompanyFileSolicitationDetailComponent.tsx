import CompanyPersonalInformationDetailSections, {
    CompanyFileSectionsContext
} from "../../companyFile/company/CompanyPersonalInformationDetailSections";
import React, {useContext, useMemo} from "react";
import {Button, Card, Grid, Stack, Typography} from "@mui/material";
import {CompanyLogoById} from "../components/CompanyLogo";
import {BackButton} from "../../../components/buttons/Buttons";
import {HttpSolicitation} from "../../../http";
import {useParams} from "react-router-dom";
import {CompanyFileContext} from "../../../hooks/contexts/CompanyFileContext";
import {WrapperIcons} from "../../../components/icons/Icons";
import {NotePencil, PaperPlaneRight} from "phosphor-react";
import useAxios from "../../../hooks/useAxios";
import {useAction} from "../../../hooks/useAction";
import {useCompanySolicitation} from "./CompanySolicitationContext";
import {ButtonExportDropdown} from "../../../components/buttons/ButtonExportDropdown";
import {PersonTypes} from "../../../types/person/personEnums";


interface CompanyFileSolicitationDetailComponentProps {
    allowEdit: boolean,
    title: string,
    onBack: () => void,
    personTypeCode?: PersonTypes
}


const CompanyFileSolicitationDetailComponent = ({allowEdit, title, onBack, personTypeCode} : CompanyFileSolicitationDetailComponentProps) => {
    const {companyId, solicitationId} = useParams()
    const companyIdParsed = useMemo(() => (
        companyId ? parseInt(companyId) : undefined
    ), [companyId])
    const {editing, setEditing} = useContext(CompanyFileSectionsContext)
    const {updateCompanyFile, cancelEditing, exportFileToExcel} = useContext(CompanyFileContext)
    const {loadSolicitation} = useCompanySolicitation()
    const {fetchData} = useAxios()
    const {snackbarSuccess} = useAction()
    
    const onCancelEditing = () => {
        cancelEditing();
        setEditing(false);
    }

    const handleUpdateCompanyFile = async () => {
        await updateCompanyFile();
        setEditing(false);
    }
    
    const updateSolicitationCompanyFile = () => {
        if (solicitationId)
            fetchData(
                () => HttpSolicitation.updateSolicitationFile(parseInt(solicitationId ?? '0')),
                true,
            )
                .then(() => {
                    loadSolicitation(parseInt(solicitationId || '0'))
                    snackbarSuccess(
                        `El legajo de la solicitud ${solicitationId} ha sido enviado correctamente`,
                    );
                    setEditing(false)
                    onBack()
                })
    }
    
    return (
        <React.Fragment>
            <Grid item xs={12} md={8}>
                <CompanyPersonalInformationDetailSections allowEdit={allowEdit}
                                                          context={CompanyFileSectionsContext}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <Stack spacing={2}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <CompanyLogoById companyId={companyIdParsed}
                                             isPhysicalPerson={personTypeCode === PersonTypes.Physical}
                                             size={'xl'}
                            />
                            
                            <Typography className={'text-ellipsis-two-lines'} variant={'h4'} fontWeight={500}>
                                {title}
                            </Typography>
                        </Stack>
                        {!editing ?
                            <Stack direction='row' alignItems='center' spacing={1} justifyContent={'center'}>
                                <BackButton onClick={onBack} size='small' fullWidth>Volver</BackButton>
                              
                                <ButtonExportDropdown
                                  size={'small'}
                                  onExportExcel={exportFileToExcel}
                                  fullWidth
                                />
                              
                                {allowEdit && <Button variant={'contained'}
                                                      onClick={updateSolicitationCompanyFile}
                                                      size={'small'}
                                                      fullWidth
                                                      endIcon={<WrapperIcons Icon={PaperPlaneRight} size={'sm'} /> }
                                >
                                    Enviar
                                </Button>}
                            </Stack>
                            :
                            <Stack direction='row' alignItems='center' spacing={1} justifyContent={'center'}>
                                <Button variant={'text'}
                                        size={'small'}
                                        onClick={onCancelEditing}
                                >
                                    Cancelar
                                </Button>

                                <Button variant={'contained'}
                                        onClick={handleUpdateCompanyFile}
                                        fullWidth size={'small'}
                                        endIcon={<WrapperIcons size={'sm'} Icon={NotePencil} />}
                                >
                                    Guardar cambios
                                </Button>
                            </Stack>
                        }
                    </Stack>
                </Card>
            </Grid>
        </React.Fragment>
    )
}


export default CompanyFileSolicitationDetailComponent