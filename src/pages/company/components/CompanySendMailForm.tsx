import {Box, Grid, Stack, Typography} from '@mui/material';
import {
    CompanyApprovalFormFields,
    CompanyResponsibleInviteData,
    CompanyUnconfirmedRegisterDataFields,
    CompanyViewDTO,
    CompanyViewDTOFields
} from '../../../types/company/companyData';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {ControlledTextFieldFilled} from '../../../components/forms';
import React, {useEffect, useState} from 'react';
import useAxios from '../../../hooks/useAxios';
import {HttpCompany, HttpCompanyRolesInvitation, HttpPerson} from '../../../http';
import {NosisResponseFields} from '../../../types/person/personData';
import {useAction} from '../../../hooks/useAction';
import {grey} from "@mui/material/colors";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import {FileSelectedDetail} from "../../../components/files/FileSelectedDetail";
import {DropzoneField} from "../../../components/forms/DropzoneField";
import {FileBaseFields, FileBaseInsert, FileBaseInsertFields} from "../../../types/files/filesData";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {PersonTypes} from "../../../types/person/personEnums";
import { PublicEntityEnums } from 'util/typification/publicEntityEnums';
import {useUser} from "../../../hooks/contexts/UserContext";
import NewCompanySameCuitDialog from "../newCompany/NewCompanySameCuitDialog";
import {useLoaderActions} from "../../../hooks/useLoaderActions";
import ToggleButtonGroupSwitch from "../../../components/forms/ToggleButtonGroupSwitch";
import {ModuleCodes} from "../../../types/general/generalEnums";

interface CompanySendMailFormProps {
  company: CompanyViewDTO;
  onConfirm: () => void;
}

const CompanySendMailForm = ({
  company,
  onConfirm,
}: CompanySendMailFormProps) => {
  const { fetchData } = useAxios();
  const { user } = useUser()
  const { snackbarSuccess } = useAction();
  const { showLoader, hideLoader } = useLoaderActions();
  const [fileAble, setFileAble] = useState<FileBaseInsert>();
  const [openSameCuit, setOpenSameCuit] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const isPhysicalPerson = company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical

  const companySchema = yup.object()
  .test(CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail, 'Campo obligatorio', (obj) => {
      if (!showForm) return true;
      
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
  .test(CompanyViewDTOFields.CUIT, 'Campo Obligatorio', (obj) => {
      if (!obj || isPhysicalPerson) return true;
      
      if (!showForm) return true;
      
      if (obj[CompanyViewDTOFields.CUIT]) return true;
      
      return new yup.ValidationError(
          'Campo Obligatorio',
          null,
          CompanyViewDTOFields.CUIT,
      );
  })
  .test(CompanyApprovalFormFields.FileAble, 'Campo Obligatorio', (obj) => {
      if (isPhysicalPerson) return true

      if (!!fileAble && obj[CompanyApprovalFormFields.FileAble]) return true;

      return new yup.ValidationError(
          'Campo Obligatorio',
          null,
          CompanyApprovalFormFields.FileAble,
      );
  })

    
  const { control,
      handleSubmit,
      watch,
      setValue,
      clearErrors,
      getValues 
  } = useForm<CompanyResponsibleInviteData>({
    resolver: yupResolver(companySchema),
  });
  
  const onSubmit = (data: CompanyResponsibleInviteData) => {
    if (user && user?.cuit === data[CompanyViewDTOFields.CUIT] && showForm) setOpenSameCuit(true)
    else {
        let submitData: CompanyResponsibleInviteData = {
            ...data,
            [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]: company[CompanyViewDTOFields.PersonId]
        }
        
        if (isPhysicalPerson) {
            fetchData(
                () =>
                    HttpCompanyRolesInvitation.inviteResponsible(company[EntityWithIdFields.Id], submitData),
                true,
            ).then(() => {
                snackbarSuccess('La invitación se envió correctamente');
                onConfirm();
            })
        } else {
            if (!showForm && fileAble) {
                fetchData(
                    () => HttpCompany.changeResponsible(company[EntityWithIdFields.Id]),
                    true
                ).then((r) => {
                    let formData: FormData = new FormData();
                    const codModulo = 1;
                    const codOrigen = 1;
                    formData.append(
                        CompanyUnconfirmedRegisterDataFields.FileAble,
                        fileAble.file,
                        fileAble.descArchivo,
                    );
                    formData.append(FileBaseInsertFields.ModuleCode, codModulo.toString());
                    formData.append(FileBaseInsertFields.OriginCode, codOrigen.toString());
                    fetchData(() => HttpCompany.requestApproval(company[EntityWithIdFields.Id], formData), true)
                        .then((r) => {
                            if (!r.tieneError) {
                                onConfirm()
                                snackbarSuccess('Fuiste designado como titular de la empresa y la documentación fue enviada correctamente')
                            }
                        })
                })
            } else {
                showLoader();
                HttpPerson.synchronizeWithNosisAndGetPersonId(data[CompanyViewDTOFields.CUIT], ModuleCodes.CompanyRegistration)
                    .then((r) => {
                        submitData = {
                            ...submitData,
                            [CompanyUnconfirmedRegisterDataFields.FileAble]: fileAble,
                            [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]: r[NosisResponseFields.PersonId]
                        }
                        fetchData(
                            () =>
                              HttpCompanyRolesInvitation.inviteResponsible(company[EntityWithIdFields.Id], submitData),
                            true,
                        ).then(() => {
                              snackbarSuccess('La invitación se envió correctamente');
                              onConfirm();
                        }).finally(() => hideLoader())
                    })
                    .catch(() => hideLoader());
            }
        }
    }
  };

    const removeAble = () => {
        setValue(CompanyUnconfirmedRegisterDataFields.FileAble, undefined);
        setFileAble(undefined);
    };

    const onDownloadHelper = () => {
        const pdfUrl =
            process.env.PUBLIC_URL +
            '/Paso a Paso - AFIP - Administrador de relaciones.pdf';
        window.open(pdfUrl);
    };
    
    const watchFileAble = watch(CompanyUnconfirmedRegisterDataFields.FileAble)

    useEffect(() => {
        if (watchFileAble) {
            let newFile = getValues(CompanyUnconfirmedRegisterDataFields.FileAble);
            if (!newFile) return setFileAble(undefined);

            clearErrors(CompanyUnconfirmedRegisterDataFields.FileAble);
            let fileBase: FileBaseInsert = {
                [FileBaseFields.FileDesc]: newFile[0]?.name,
                [FileBaseFields.BeginDate]: new Date(),
                [FileBaseFields.FileSize]: newFile[0]?.size,
                [FileBaseInsertFields.File]: newFile[0],
            } as FileBaseInsert;

            setFileAble(fileBase);
        }
    }, [watchFileAble]);

  return (
    <Stack container spacing={2}>
        {
            company[CompanyViewDTOFields.CUIT] !== user?.cuit && company[CompanyViewDTOFields.PersonTypeCode] !== PersonTypes.Physical &&
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
          <form onSubmit={handleSubmit(onSubmit)} id={"company-send-mail-form"}>
              <Grid container spacing={2}>
                {
                    showForm &&
                      <Grid item xs={isPhysicalPerson ? 12 : 6}>
                        <ControlledTextFieldFilled
                          control={control}
                          name={CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail}
                          label={'Email'}
                          fullWidth
                        />
                      </Grid>
                }
                {
                    !isPhysicalPerson && showForm &&
                      <Grid item xs={6}>
                        <ControlledTextFieldFilled
                          control={control}
                          name={CompanyViewDTOFields.CUIT}
                          label={'CUIT'}
                          fullWidth
                        />
                      </Grid>
                }
                {
                    !isPhysicalPerson &&
                      <Grid item xs={12}>
                            <div>
                                <Typography color={grey[600]} display={'flex'}>
                                    {`Poder habilitante, acta constitutiva, designación de autoridades, captura de pantalla de Página ${PublicEntityEnums.ARCA} (administrador de relaciones).`}
                                    <Box
                                        sx={{'&:hover': {cursor: 'pointer'}}}
                                        onClick={onDownloadHelper}
                                    >
                                        <HelpOutlineRoundedIcon
                                            sx={{marginLeft: 0.5}}
                                            fontSize={'small'}
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
                                        name={CompanyUnconfirmedRegisterDataFields.FileAble}
                                        multiple={false}
                                        control={control}
                                        setValue={setValue}
                                    />
                                )}
                            </div>
                        </Grid>
                }
    
                <NewCompanySameCuitDialog open={openSameCuit && !!fileAble}
                                          companyId={company[EntityWithIdFields.Id]}
                                          onClose={() => setOpenSameCuit(false)}
                                          onSubmit={onConfirm}
                                          powerOfAttorneyFile={fileAble}
                />
            </Grid>
          </form>
    </Stack>
  );
};

export default CompanySendMailForm;
