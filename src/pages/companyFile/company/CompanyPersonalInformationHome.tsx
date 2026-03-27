import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

import {Button, Card, Grid, Stack, Theme, Typography, useMediaQuery} from '@mui/material';
import {BackButton, EditButton, SendButton} from 'components/buttons/Buttons';

import {
  HttpCompany,
  HttpCompanyAddress,
  HttpCompanyFile,
  HttpCompanyMail,
  HttpCompanyPhoneNumber,
  HttpExportCompanyFile,
  HttpSolicitation,
} from 'http/index';

import {
  CompanyDetailFormFields,
  CompanyFields,
  CompanyForm,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import {CompanyActivityView} from 'types/company/companyActivityData';
import {CompanyMailFields, CompanyPhoneNumberFields,} from 'types/company/companyReferentialData';
import {HttpCompanyActivity} from 'http/company/httpCompanyActivity';
import CompanyPersonalInformationDetail from './CompanyPersonalInformationDetail';
import {useQuery} from 'hooks/useQuery';
import CompanyFileHomeEditProfile from '../homesEdit/CompanyFileHomeEditProfile';
import {useAction} from 'hooks/useAction';
import {SolicitationViewDTOFields} from 'types/solicitations/solicitationData';
import {EntityWithIdFields} from 'types/baseEntities';
import {CompanyFileSourceType, CompanyFileType,} from 'types/company/companyEnums';
import {stringFormatter} from 'util/formatters/stringFormatter';
import useAxios from 'hooks/useAxios';
import {ButtonExportDropdown} from 'components/buttons/ButtonExportDropdown';
import {DialogAlert} from '../../../components/dialog';
import {CompanyFileContext, CompanyFileContextProvider} from "../../../hooks/contexts/CompanyFileContext";
import {WrapperIcons} from "../../../components/icons/Icons";
import {NotePencil} from "phosphor-react";
import CompanyPersonalInformationDetailSections, { CompanyFileSectionsContext } from "./CompanyPersonalInformationDetailSections";
import {CompanyLogoById} from "../../company/components/CompanyLogo";

function CompanyPersonalInformationHome() {
  let { companyId } = useParams();
  let paramEdit = useQuery().has('edit');
  const [editing, setEditing] = useState<boolean>(paramEdit);
  const parsedCompanyId = useMemo(() => parseInt(companyId || '0'), [companyId])
  
  const fileType: CompanyFileType = window.location
      .toString()
      .includes('?tipo=1')
      ? CompanyFileType.Short
      : CompanyFileType.Long;
  
  return (
      <CompanyFileSectionsContext.Provider value={{
        editing: editing,
        setEditing: setEditing
      }}
      >
        <CompanyFileContextProvider dataId={parsedCompanyId}
                                    dataSource={CompanyFileSourceType.Company}
                                    companyFileType={fileType}
        >
          <CompanyPersonalInformationBaseComponent companyId={parsedCompanyId} />
        </CompanyFileContextProvider>
      </CompanyFileSectionsContext.Provider>
  )
}


interface CompanyPersonalInformationBaseComponentProps {
  companyId?: number
}

const CompanyPersonalInformationBaseComponent = ({ companyId } : CompanyPersonalInformationBaseComponentProps) => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState<string>('')
  const {editing, setEditing} = useContext(CompanyFileSectionsContext)
  const {cancelEditing, updateCompanyFile, exportFileToExcel, completenessPercentage} = useContext(CompanyFileContext)
  const onBack = () => navigate(-1)
  const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (companyId) {
      Promise.all([
        HttpCompany.getCompanyById(companyId)
      ]).then((values) => {
        setBusinessName(values[0][CompanyViewDTOFields.BusinessName])
      })
    }
  }, [companyId]);
  
  const onCancelEditing = () => {
    cancelEditing();
    setEditing(false);
  }

  const handleUpdateCompanyFile = async () => {
    await updateCompanyFile();
    setEditing(false);
  }
  
  return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <CompanyPersonalInformationDetailSections context={CompanyFileSectionsContext}
                                                    allowEdit
                                                    completenessPercentage={completenessPercentage}
          />
        </Grid>
        <Grid item md={4}>
          <Card>
            <Stack spacing={2}>
              <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <CompanyLogoById companyId={companyId ?? 0}
                                 sx={{ width: '54px !important', minWidth: '54px !important', height: '54px !important', borderRadius: '100px !important',}}
                />
                <Typography className={'text-ellipsis-two-lines'} variant={isMobileScreenSize ? 'h5' : 'h4'} fontWeight={500}>
                  {editing ? `Edición de ${businessName !== '' ? businessName : 'legajo'}` : `Datos de ${businessName !== '' ? businessName : 'legajo'}`}
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
                  </Stack>
                  :
                  <Stack direction='row' alignItems='center' spacing={1} justifyContent={'center'}>
                    <Button variant={'text'}
                            size={'small'}
                            onClick={onCancelEditing}
                            id={"companyFile-personal-info-cancel-btn"}
                    >
                      Cancelar
                    </Button>

                    <Button variant={'contained'}
                            onClick={handleUpdateCompanyFile}
                            fullWidth size={'small'}
                            endIcon={<WrapperIcons size={'sm'} Icon={NotePencil} />}
                            id={"companyFile-personal-info-save-btn"}
                    >
                      Guardar cambios
                    </Button>
                  </Stack>
              }
            </Stack>
          </Card>
        </Grid>
      </Grid>
  )
}

interface CompanyPersonalInformationHomeProps {
  dataId: number;
  solicitationId?: number;
  dataSource?: CompanyFileSourceType;
  allowEdit?: boolean;
  marketEdit?: boolean,
  afterSave?: () => void,
  marketSave?: boolean
}

export const CompanyPersonalInformationContext = React.createContext({
  dataSource: undefined as CompanyFileSourceType | undefined,
  dataId: 0,
  fileType: CompanyFileType.Short as CompanyFileType,
});

export function CompanyPersonalInformationHomeView({
  dataId,
  dataSource = CompanyFileSourceType.Company,
  solicitationId,
  allowEdit = false, marketEdit = false
}: CompanyPersonalInformationHomeProps) {
  const { setTitle, snackbarSuccess } = useAction();
  const { fetchAndDownloadFile, fetchData } = useAxios();
  const navigate = useNavigate();
  const [openSend, setOpenSend] = useState<boolean>(false);

  const [company, setCompany] = useState<CompanyForm>();
  const [activity, setActivity] = useState<CompanyActivityView>();
  const location = useLocation();
  const state = location.state as { prevPathname?: string };
  const fileType: CompanyFileType = window.location
    .toString()
    .includes('?tipo=1')
    ? CompanyFileType.Short
    : CompanyFileType.Long;

  const getTitle = () => {
    if (state && state.prevPathname) {
      const prevPathname = state.prevPathname;
      if (prevPathname.includes('?tipo=1')) {
        return 'Legajo Abreviado';
      } else if (prevPathname.includes('?tipo=2')) {
        return 'Legajo de Contacto';
      }
    }

    return 'Volver';
  };
  const goToEdit = () =>
    navigate('?edit', {
      state: {
        prevPathname: window.location.toString().includes('?tipo=2')
          ? '?tipo=2'
          : '',
      },
    });

  const goToBack = () => {
    if (location.state === 'model') {
      localStorage.setItem('stateFromCompanyFile', 'activado');
    }

    navigate(-1);
  };

  const downlaodPersonalInformation = () => {
    const fileShort = window.location.toString().includes('?tipo=1');

    const exportFunction =
      dataSource == CompanyFileSourceType.Company
        ? fileShort
          ? HttpExportCompanyFile.exportShortFileToExcelByCompany
          : HttpExportCompanyFile.exportLongFileToExcelByCompany
        : 
          HttpExportCompanyFile.exportToExcelByFile;

    fetchAndDownloadFile(() => exportFunction(dataId));
  };

  const updateSolicitationFile = () => setOpenSend(true);

  const onUpdateSolicitationFile = () => {
    if (solicitationId)
      fetchData(
        () => HttpSolicitation.updateSolicitationFile(solicitationId),
        true,
      )
        .then(() => {
          snackbarSuccess(
            `El legajo de la solicitud ${solicitationId} ha sido enviado correctamente`,
          );
          goToBack();
        })
        .finally(() => setOpenSend(false));
  };

  const mapActionTitle = () => (
    <Stack direction="row" spacing={2}>
      {allowEdit && solicitationId && (
        <SendButton onClick={updateSolicitationFile} size={'small'}>
          Enviar
        </SendButton>
      )}
      {allowEdit && (
        <EditButton size={'small'} onClick={goToEdit}>
          Editar
        </EditButton>
      )}

      <ButtonExportDropdown
        size={'small'}
        onExportExcel={downlaodPersonalInformation}
      />

      <BackButton size={'small'} onClick={goToBack}>
        {getTitle()}
      </BackButton>
    </Stack>
  );

  setTitle('Datos del Legajo', mapActionTitle());

  const loadCompanyData = useCallback(() => {
    if (dataId) {
      Promise.all([
        HttpCompany.getCompanyById(dataId),
        HttpCompanyPhoneNumber.getMain(dataId),
        HttpCompanyMail.get(dataId),
        HttpCompanyAddress.get(dataId),
        HttpCompanyActivity.getByCompanyId(dataId),
      ]).then(([company, phone, mail, addresses, activityList]) => {
        setCompany({
          ...company,
          [CompanyFields.Phone]:
            stringFormatter.phoneNumberWithAreaCode(
              phone[CompanyPhoneNumberFields.AreaCode],
              phone[CompanyPhoneNumberFields.PhoneNumber],
            ) || '-',
          [CompanyDetailFormFields.Mail]: mail[CompanyMailFields.Mail],
          [CompanyDetailFormFields.Address]: addresses,
        });
        setActivity(activityList);
      });
    }
  }, [dataId]);

  const loadCompanyFileData = useCallback(() => {
    //fileId: Mientras no esten los endpoints de data por legajoId usamos los de la empresa
    //modificamos algunos datos para ver que de hecho estamos entrando al caso "tiene legajoId'
    if (dataSource && dataId) {
      Promise.all([
        HttpCompanyFile.getCompanyByFileId(dataId),
        HttpCompanyFile.getCompanyPhoneNumberByFileId(dataId),
        HttpCompanyFile.getCompanyMailByFileId(dataId),
        HttpCompanyFile.getCompanyAddressesByFileId(dataId),
        HttpCompanyFile.getCompanyActivityByFileId(dataId),
      ]).then(([company, phone, mail, addresses, activityList]) => {
        setCompany({
          ...company,
          [EntityWithIdFields.Id]: company[CompanyViewDTOFields.CompanyId],
          [SolicitationViewDTOFields.FileId]: dataId,
          [CompanyViewDTOFields.BusinessName]:
            company[CompanyViewDTOFields.BusinessName],
          [CompanyFields.Phone]:
            stringFormatter.phoneNumberWithAreaCode(
              phone[CompanyPhoneNumberFields.AreaCode],
              phone[CompanyPhoneNumberFields.PhoneNumber],
            ) || '-',
          [CompanyDetailFormFields.Mail]: mail[CompanyMailFields.Mail],
          [CompanyDetailFormFields.Address]: addresses,
        });
        setActivity(activityList);
      });
    }
  }, [dataId, dataSource]);

  useEffect(() => {
    dataSource === CompanyFileSourceType.Company
      ? loadCompanyData()
      : loadCompanyFileData();
  }, [dataId, dataSource]);

  return (
    <CompanyPersonalInformationContext.Provider
      value={{
        dataId: dataId,
        dataSource: dataSource,
        fileType: fileType,
      }}
    >
      <CompanyPersonalInformationDetail company={company} activity={activity} allowEdit={allowEdit || marketEdit} />
      <DialogAlert
        onClose={() => setOpenSend(false)}
        open={openSend}
        onConfirm={onUpdateSolicitationFile}
        title={'Enviar legajo de solicitud'}
        textContent={`¿Está seguro de enviar el legajo de la solicitud #${solicitationId}?`}
      />
    </CompanyPersonalInformationContext.Provider>
  );
}

export function CompanyPersonalInformationHomeEdit({
  dataId, marketSave, marketEdit, afterSave
}: CompanyPersonalInformationHomeProps) {
  const { setTitle } = useAction();
  const navigate = useNavigate();

  const [company, setCompany] = useState<CompanyForm>();
  const [activity, setActivity] = useState<CompanyActivityView>();
  const [dirty, setDirty] = useState<boolean>(false)
  const [openAlertSave, setOpenAlertSave] = useState<boolean>(false)

  const goToBack = () => navigate(-1);

  const handleBack = () => {
    if (dirty) setOpenAlertSave(true)
    else goToBack()
  }

  const mapActionTitle = () => (
    <Stack direction="row" spacing={1}>
      <BackButton size={'small'} onClick={handleBack}>
        Volver
      </BackButton>
    </Stack>
  );

  !marketSave && setTitle("Edición de Datos del Legajo", mapActionTitle());

  useEffect(() => {
    if (dataId) {
      Promise.all([
        HttpCompany.getCompanyById(dataId),
        HttpCompanyPhoneNumber.get(dataId),
        HttpCompanyMail.get(dataId),
        HttpCompanyAddress.get(dataId),
      ]).then(([company, phones, mail, addresses]) => {
        setCompany({
          ...company,
          [CompanyDetailFormFields.Phone]: phones,
          [CompanyDetailFormFields.Mail]: mail[CompanyMailFields.Mail],
          [CompanyDetailFormFields.Address]: addresses,
        });
      });
      HttpCompanyActivity.getByCompanyId(dataId).then(setActivity);
    }
  }, [dataId]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CompanyFileHomeEditProfile company={company} marketEdit={marketEdit} afterSubmit={afterSave} updateDirtyValue={(arg: boolean) => setDirty(arg)}/>
      </Grid>
      {
        openAlertSave &&
          <DialogAlert onClose={() => setOpenAlertSave(false)} open={openAlertSave} onConfirm={goToBack} textContent={'Aún te quedan cambios sin guardar. ¿Deseas salir de todas formas?'}/>
      }
    </Grid>
  );
}

export default CompanyPersonalInformationHome;
