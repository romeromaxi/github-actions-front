import * as React from 'react';
import {Box, Button, Container, Stack} from '@mui/material';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {AppBarBase} from 'components/appbar/AppBarBase';
import {CheckIcon, ClipboardIcon, ShareIcon, Undo2Icon} from 'lucide-react';
import {useApplicationCommon} from 'hooks/contexts/ApplicationCommonContext';
import {CompanyFileContext, CompanyFileContextProvider} from 'hooks/contexts/CompanyFileContext';
import {CompanyFileSourceType, CompanyFileType} from 'types/company/companyEnums';
import {TypographyBase} from 'components/misc/TypographyBase';
import {NavsTabVertical} from 'components/navs/NavsTab';
import CompanyPersonalInformationContactInfo from '../../companyFile/company/CompanyPersonalInformationContactInfo';
import CompanyFileSectionCompletenessAction
    from '../../companyFile/company/components/CompanyFileSectionCompletenessAction';
import {CompanyFileCompletenessFields} from 'types/company/companyData';
import CompanyPersonalInformationActivityInfo from '../../companyFile/company/CompanyPersonalInformationActivityInfo';
import CompanyPersonalInformationFiscalInfo from '../../companyFile/company/CompanyPersonalInformationFiscalInfo';
import CompanyPersonalInformationCertificationPyMEInfo
    from '../../companyFile/company/CompanyPersonalInformationCertificationPyMEInfo';
import {Skeleton} from '@mui/lab';
import NavsTabVerticalHeaderBase from 'components/navs/NavsTabVerticalHeaderBase';
import LinearProgress from '@mui/material/LinearProgress';
import {numberFormatter} from 'util/formatters/numberFormatter';
import {dateFormatter} from 'util/formatters/dateFormatter';
import useAxios from 'hooks/useAxios';
import {useLoaderActions} from "hooks/useLoaderActions";
import {BaseResponseFields} from "types/baseEntities";
import {HttpSolicitation} from "http/index";
import {useSnackbarActions} from "hooks/useSnackbarActions";

interface LocationState {
  mode: 'edit' | 'view';
  title?: string;
  companyFileId?: number;
  fileTypeCode?: CompanyFileType;
  sentDate?: string | Date;
}

function CompanySolicitationCompanyFilePage() {
  const navigate = useNavigate();
  const appCommon = useApplicationCommon() as any;
  const { paddingTopContent } = appCommon;
  const location = useLocation();
  const params = useParams();
  const state = (location.state || {}) as LocationState;

  const isModeEdit = state.mode === 'edit';
  const companyId = Number(params.companyId);
  const solicitationId = Number(params.solicitationId);
  const companyFileId = state.companyFileId;
  const dataSource = isModeEdit ? CompanyFileSourceType.Company : CompanyFileSourceType.CompanyFile;
  const dataId = isModeEdit ? companyId : (companyFileId ?? 0);
  const showCompleteness = dataSource === CompanyFileSourceType.Company;

  const sentDate = state.sentDate ? new Date(state.sentDate) : undefined;
  const title = state.title || 'Legajo';

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CompanyFileContextProvider dataId={dataId} dataSource={dataSource} companyFileType={state.fileTypeCode}>
        <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: isModeEdit ? '96px' : 0 }}>
          <AppBarBase title={title} hideLogo>
            <AppBarBase.Left>
              <Button variant={'outlined'}
                      color={'secondary'}
                      size={'small'}
                      startIcon={<Undo2Icon />}
                      onClick={() => navigate(-1)}
              >
                Volver
              </Button>
            </AppBarBase.Left>
          </AppBarBase>

          <Box pt={paddingTopContent} flex={1}>
            <CompanyFileTabContent showCompleteness={showCompleteness} sentDate={sentDate} isModeEdit={isModeEdit} />
          </Box>
        </Container>

        {/* Footer solo en modo edición */}
        {
            isModeEdit && (
                <CompanyFileFooterSend solicitationId={solicitationId} />
            )
        }
      </CompanyFileContextProvider>
    </Box>
  );
}

interface CompanyFileTabContentProps { 
  showCompleteness: boolean;
  sentDate?: Date;
  isModeEdit: boolean;
}

const CompanyFileTabContent = ({ showCompleteness, sentDate, isModeEdit }: CompanyFileTabContentProps) =>  {
  const { completenessPercentage, openExportDialog } = React.useContext(CompanyFileContext);

  const completenessData = React.useMemo(() => {
    if (!completenessPercentage) return undefined;
    
    return {
      percentage: completenessPercentage?.[CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage],
      date: completenessPercentage?.[CompanyFileCompletenessFields.FileTypeShortLastModifiedDate] || new Date(),
    }
  }, [completenessPercentage]);

  const headerCompleteness = showCompleteness ? (
    !!completenessData ?
      completenessData.percentage < 100 ?
        <Stack spacing={1.75}>
          <LinearProgress variant="determinate"
                          color={'warning'}
                          value={completenessData.percentage}
          />

          <Stack width={1} alignItems={'end'}>
            <TypographyBase variant={'body4'} color={'text.lighter'}>
              {`${numberFormatter.toStringWithPercentage(completenessData.percentage, 0, 0)} Completado`}
            </TypographyBase>
          </Stack>
        </Stack>
        :
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckIcon color="#008547"/>
            <TypographyBase color="primary" variant="body2" fontWeight={500}>
              100% completado
            </TypographyBase>
          </Stack>
          <Stack direction="row" alignItems="center">
            <TypographyBase variant="body4" fontWeight={500} color={"text.secondary"} textAlign={'end'}>
              {`Actualizado el ${dateFormatter.toShortDate(completenessData.date)}`}
            </TypographyBase>
          </Stack>
        </Stack>
      :
      <Skeleton />
  ) : <></>;

  const headerTitle = 'Legajo de Contacto';

  return (
    <NavsTabVertical
      tabSize={4}
      checkShouldWarnBeforeSwitch
      alwaysSomeActiveTab
      insideOtherTabs
      header={
        <NavsTabVerticalHeaderBase title={headerTitle}
                                   Icon={ClipboardIcon}
                                   description={'Información básica que se envía con cada solicitud. Asegurate de tenerla actualizada para estar siempre listo.'}>
          {headerCompleteness}
          {(sentDate && !isModeEdit) ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <TypographyBase variant="body4" color="text.secondary" sx={{ mt: 1 }}>
                {`Enviado el ${dateFormatter.toShortDate(sentDate)}`}
              </TypographyBase>
            </Box>
          ) : <></>}
        </NavsTabVerticalHeaderBase>
      }
      actionInside={
          <Button color={'secondary'}
                  variant={'outlined'}
                  startIcon={<ShareIcon /> }
                  onClick={openExportDialog}
                  fullWidth
          >
              Exportar Datos
          </Button>
      }
      lstTabs={[
        {
          tabList: [
            {
              label: 'Datos de Contacto',
              content: <CompanyPersonalInformationContactInfo />,
              action: <CompanyFileSectionCompletenessAction percentageName={CompanyFileCompletenessFields.CompanyContactDataCompletenessPercentage}
                                                            missingFieldsName={CompanyFileCompletenessFields.CompanyContactDataMissingFieldsCount}
                      />,
              default: true
            },
            {
              label: 'Actividad',
              content: <CompanyPersonalInformationActivityInfo />,
              action: <CompanyFileSectionCompletenessAction percentageName={CompanyFileCompletenessFields.CompanyActivityCompletenessPercentage}
                                                            missingFieldsName={CompanyFileCompletenessFields.CompanyActivityMissingFieldsCount}
                      />,
            },
            {
              label: 'Información Fiscal',
              content: <CompanyPersonalInformationFiscalInfo />,
              action: <CompanyFileSectionCompletenessAction percentageName={CompanyFileCompletenessFields.CompanyFiscalInfoCompletenessPercentage}
                                                            missingFieldsName={CompanyFileCompletenessFields.CompanyFiscalInfoMissingFieldsCount}
                      />,
            },
            {
              label: 'Certificado MiPyME',
              content: <CompanyPersonalInformationCertificationPyMEInfo />,
              action: <CompanyFileSectionCompletenessAction percentageName={CompanyFileCompletenessFields.CompanyPyMECertificationCompletenessPercentage}
                                                            missingFieldsName={CompanyFileCompletenessFields.CompanyPyMECertificationMissingFieldsCount}
                      />,
            }
          ]
        }
      ]}
    />
  );
}

interface CompanyFileFooterSendProps {
    solicitationId: number
}

const CompanyFileFooterSend = ({ solicitationId }: CompanyFileFooterSendProps) => {
    const { updateCompanyFile } = React.useContext(CompanyFileContext);
    const { fetchData } = useAxios();
    const { showLoader, hideLoader } = useLoaderActions();
    const { addSnackbarSuccess } = useSnackbarActions();
    const navigate = useNavigate();

    const onSend = async () => {
        if (updateCompanyFile) {
            showLoader()
            updateCompanyFile()
                .then(response => {
                    if (response && response[BaseResponseFields.HasError]) {
                        hideLoader()
                    } else {
                        fetchData(
                            () => HttpSolicitation.updateSolicitationFile(solicitationId),
                            true
                        )
                            .then(() => {
                                addSnackbarSuccess(
                                    `El legajo de la solicitud ${solicitationId} ha sido enviado correctamente`,
                                );
                                navigate(-1);
                            })
                            .catch(() => {})
                    }
                })
                .catch(() => hideLoader())
            
        }
    };
    
    return (
        <Box component="footer" sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #EDF2F7',
            backgroundColor: '#FFFFFF',
            padding: '12px 24px',
            zIndex: 1300,
            display: 'flex',
            justifyContent: 'flex-end'
        }}>
            <Button variant="contained" color="primary" onClick={onSend}>
                Enviar actualización
            </Button>
        </Box>
    )
}


export default CompanySolicitationCompanyFilePage;
