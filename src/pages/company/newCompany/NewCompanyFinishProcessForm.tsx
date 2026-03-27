import {
    CompanyApprovalFormFields,
    CompanyKeyData, CompanyKeyDataFields, CompanyResponsibleInviteData,
    CompanyUnconfirmedRegisterDataFields,
    CompanyViewDTOFields
} from "../../../types/company/companyData";
import {Box, Grid, Link, Stack, Typography} from "@mui/material";
import {ControlledTextFieldFilled} from "../../../components/forms";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import * as yup from "yup";
import useAxios from "../../../hooks/useAxios";
import {useAction} from "../../../hooks/useAction";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {NewCompanyBaseForm} from "../../markets/components/forms/FromMarketNewCompanyForm";
import NewCompanyDrawerStyles from "./NewCompanyDrawer.styles";
import {PersonTypes} from "../../../types/person/personEnums";
import {FileBaseFields, FileBaseInsert, FileBaseInsertFields} from "../../../types/files/filesData";
import {grey} from "@mui/material/colors";
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import {FileSelectedDetail} from "../../../components/files/FileSelectedDetail";
import {DropzoneField} from "../../../components/forms/DropzoneField";
import {HttpCompany, HttpCompanyRolesInvitation, HttpPerson} from "../../../http";
import {NosisResponseFields} from "../../../types/person/personData";
import {useUser} from "../../../hooks/contexts/UserContext";
import NewCompanySameCuitDialog from "./NewCompanySameCuitDialog";
import ToggleButtonGroupSwitch from "../../../components/forms/ToggleButtonGroupSwitch";
import {ModuleCodes} from "../../../types/general/generalEnums";


interface NewCompanyFinishProcessFormProps {
    isResponsible: boolean;
    companyKeyData: CompanyKeyData;
    onSubmit: () => void;
}


const NewCompanyFinishProcessForm = ({isResponsible, companyKeyData, onSubmit} : NewCompanyFinishProcessFormProps) => {
    const navigate = useNavigate()
    const classes = NewCompanyDrawerStyles();
    const { user } = useUser()
    const [fileAble, setFileAble] = useState<FileBaseInsert>();
    const [showForm, setShowForm] = useState<boolean>(true);
    const [openSameCuit, setOpenSameCuit] = useState<boolean>(false);
    
    const {
        [CompanyKeyDataFields.CompanyId]: companyId,
        [CompanyKeyDataFields.BusinessName]: companyName,
        [CompanyKeyDataFields.CUIT]: companyCuit,
        [CompanyKeyDataFields.PersonId]: companyPersonId,
        [CompanyKeyDataFields.PersonTypeCode]: personTypeCode
    } = companyKeyData;
    
    const isPhysicalPerson = personTypeCode === PersonTypes.Physical
    const onNavigateToMarket = () => navigate('/market/landing')
    
    const companySchema = yup
        .object()
        .test(CompanyViewDTOFields.CUIT, 'Campo Obligatorio', (obj) => {
            if (!obj || isPhysicalPerson || !showForm) return true;

            if (obj[CompanyViewDTOFields.CUIT] || !showForm) return true;

            return new yup.ValidationError(
                'Campo Obligatorio',
                null,
                CompanyViewDTOFields.CUIT,
            );
        })
        .test(CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail, 'Campo Obligatorio', (obj) => {
            if (!obj || !showForm) return true;

            if (obj[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail]) {
                try {
                    yup.string()
                        .email('Formato de mail incorrecto')
                        .validateSync(obj[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail]);
                    return true;
                } catch (e) {
                    return new yup.ValidationError(
                        'Formato de mail incorrecto',
                        null,
                        CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail,
                    );
                }
            }
            
            return new yup.ValidationError(
                'Campo Obligatorio',
                null,
                CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail,
            );
        })
        .test(CompanyApprovalFormFields.FileAble, 'Campo Obligatorio', (obj) => {

            if (isPhysicalPerson) return true

            if (!!fileAble && obj[CompanyApprovalFormFields.FileAble])
                return true;

            if (!!fileAble && obj[CompanyApprovalFormFields.FileAble] && !isResponsible) return true;

            return new yup.ValidationError(
                'Campo Obligatorio',
                null,
                CompanyApprovalFormFields.FileAble,
            );
        });

    const { fetchData } = useAxios();

    const { snackbarSuccess, showLoader, hideLoader } = useAction();

    const { control, handleSubmit, watch, setValue, clearErrors, getValues } =
        useForm<NewCompanyBaseForm>({
            resolver: yupResolver(companySchema),
            defaultValues: {
                [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: 0
            }
        });

    const watchFileAble = watch(CompanyApprovalFormFields.FileAble);
    const removeAble = () => {
        setValue(CompanyApprovalFormFields.FileAble, undefined);
        setFileAble(undefined);
    };

    useEffect(() => {
        setFileAble(undefined)
    }, []);

    useEffect(() => {
        if (watchFileAble) {
            let newFile = getValues(CompanyApprovalFormFields.FileAble);
            if (!newFile) return setFileAble(undefined);

            clearErrors(CompanyApprovalFormFields.FileAble);
            let fileBase: FileBaseInsert = {
                [FileBaseFields.FileDesc]: newFile[0]?.name,
                [FileBaseFields.BeginDate]: new Date(),
                [FileBaseFields.FileSize]: newFile[0]?.size,
                [FileBaseInsertFields.File]: newFile[0],
            } as FileBaseInsert;

            setFileAble(fileBase);
        }
    }, [watchFileAble]);

    const onDownloadHelper = () => {
        const pdfUrl =
            process.env.PUBLIC_URL +
            '/Paso a Paso - AFIP - Administrador de relaciones.pdf';
        window.open(pdfUrl);
    };
    const onSubmitData = (data: NewCompanyBaseForm)=> {
        let companyData: CompanyResponsibleInviteData = {
            [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail]: data[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail],
            [CompanyViewDTOFields.CUIT]: data[CompanyViewDTOFields.CUIT],
            [CompanyUnconfirmedRegisterDataFields.FileAble]: fileAble
            
        };
        if (fileAble && !showForm) {
            fetchData(() => HttpCompany.changeResponsible(companyId), true)
                .then(() => {
                    let formData: FormData = new FormData();
                    const codModulo = 1;
                    const codOrigen = 1;
                    formData.append(
                        CompanyApprovalFormFields.FileAble,
                        fileAble.file,
                        fileAble.descArchivo,
                    );
                    formData.append(FileBaseInsertFields.ModuleCode, codModulo.toString());
                    formData.append(FileBaseInsertFields.OriginCode, codOrigen.toString());
                    fetchData(() => HttpCompany.requestApproval(companyId, formData))
                        .then((r) => {
                            if (!r.tieneError) {
                                onSubmit()
                                snackbarSuccess('La cuenta fue creada con éxito y fuiste designado como responsable.')
                            }
                        })
                })
        } else {
            if (user && user?.cuit === data[CompanyViewDTOFields.CUIT] && showForm) setOpenSameCuit(true)
            else if (!isPhysicalPerson) {
                showLoader();
                HttpPerson.synchronizeWithNosisAndGetPersonId(data[CompanyViewDTOFields.CUIT], ModuleCodes.CompanyRegistration)
                    .then((response) => {
                        const personId = response[NosisResponseFields.PersonId];
                        companyData = {
                            ...companyData,
                            [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]: personId,
                        };
                        fetchData(() => HttpCompanyRolesInvitation.inviteResponsible(companyId, companyData), true).then(() => {
                            hideLoader();
                            onSubmit();
                        });
                    });
            } else {
                companyData = {
                    ...companyData,
                    [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]: companyPersonId,
                };
                fetchData(() => HttpCompanyRolesInvitation.inviteResponsible(companyId, companyData), true).then(() => {
                    onSubmit();
                });
            }
        }
    }
        
    return (
            <Grid container spacing={2}>
                {companyName && (
                    <Grid item xs={12} mt={1}>
                        <Typography className={classes.companyName}>{companyName}</Typography>
    
                        <Typography
                            className={classes.companyCuit}
                            sx={{ marginTop: '2px !important' }}
                        >
                            {`CUIT: ${stringFormatter.formatCuit(companyCuit)}`}
                        </Typography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Stack spacing={2}>
                        <Typography variant='body2'>La cuenta empresa ha sido creada!</Typography>
                        <Typography variant='body2'>Ya podés:</Typography>
                        <ul>
                            <li>
                                <Typography>
                                    Navegar en la tienda y elegir tus productos o utilizar las búsquedas asistidas
                                </Typography>
                            </li>
                            <li>
                                <Typography>
                                    Enviar solicitudes y gestionar todo lo vinculado a ellas
                                </Typography>
                            </li>
                        </ul>
                        <Typography alignSelf={'center'}>
                            <Link underline='none' onClick={onNavigateToMarket} sx={{ display: 'inline' }}>Ir a la tienda</Link>
                        </Typography>
                        <Typography variant='body2'>
                            {
                                !isResponsible ?
                                    'Para acceder a todas las funcionalidades de LUC es necesario que el responsable de la empresa (titular o apoderado) verifique la cuenta.'
                                    :
                                    'Para acceder a todas las funcionalidades de LUC es necesario verifiques la cuenta.'
                            }
                        </Typography>
                        <Typography variant='body2'>La cuenta verificada permite:</Typography>
                        <ul>
                            <li>
                                <Typography>
                                    Varios usuarios con perfiles diferenciados
                                </Typography>
                            </li>
                            <li>
                                <Typography>
                                    Visualizar tus indicadores crediticios a través de VER CÓMO TE VEN
                                </Typography>
                            </li>
                            <li>
                                <Typography>
                                    Almacenar y gestionar tu información y documentos para todas tus operaciones con una única carga
                                </Typography>
                            </li>
                        </ul>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {
                        companyCuit !== user?.cuit && personTypeCode !== PersonTypes.Physical &&
                        <ToggleButtonGroupSwitch value={showForm}
                                                 onChange={(val: boolean)  => {
                                                     setShowForm(val)
                                                 }}
                                                 options={[
                                                     { label: 'Invitar al responsable', value: true },
                                                     { label: 'Soy el responsable', value: false },
                                                 ]}
                        />
                    }
                </Grid>
                
                    <Grid item xs={12} container>
                        <form onSubmit={handleSubmit(onSubmitData)} id={"finish-company-create-form"}>
                        {(showForm) &&
                            <Stack spacing={2}>
                                        <Grid item xs={12} mt={1} sx={{width: isPhysicalPerson ? '500px' : '100%'}}>
                                            <ControlledTextFieldFilled
                                                control={control}
                                                name={CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail}
                                                label="Email"
                                                fullWidth
                                            />
                                        </Grid>
                                    {!isPhysicalPerson && (
                                        <Grid item xs={12} mt={1}>
                                            <ControlledTextFieldFilled
                                                control={control}
                                                name={CompanyViewDTOFields.CUIT}
                                                label="CUIT"
                                                fullWidth
                                            />
                                        </Grid>
                                    )}
                            </Stack>
                        }
                        {
                            !isPhysicalPerson && (
                                <Grid item xs={12} mt={1}>
                                    <div>
                                        <Typography color={grey[600]} display="flex">
                                            {`Poder habilitante, acta constitutiva, designación de autoridades, captura de pantalla de Página ${PublicEntityEnums.ARCA} (administrador de relaciones).`}
                                            <Box
                                                sx={{'&:hover': {cursor: 'pointer'}}}
                                                onClick={onDownloadHelper}
                                            >
                                                <HelpOutlineRoundedIcon
                                                    sx={{marginLeft: 0.5}}
                                                    fontSize="small"
                                                    color="info"
                                                />
                                            </Box>
                                        </Typography>
                                        {fileAble ? (
                                            <FileSelectedDetail
                                                file={fileAble}
                                                actions
                                                onDelete={removeAble}
                                            />
                                        ) : (
                                            <DropzoneField
                                                name={CompanyApprovalFormFields.FileAble}
                                                multiple={false}
                                                control={control}
                                                setValue={setValue}
                                            />
                                        )}
                                    </div>
                                </Grid>
                            )
                        }
                        </form>
                    </Grid>
                <NewCompanySameCuitDialog open={openSameCuit && !!fileAble}
                                          companyId={companyId}
                                          onClose={() => setOpenSameCuit(false)}
                                          onSubmit={onSubmit}
                                          powerOfAttorneyFile={fileAble}
                />
            </Grid>
            )
}



export default NewCompanyFinishProcessForm