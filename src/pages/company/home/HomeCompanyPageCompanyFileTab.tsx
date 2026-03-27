import React, {useContext, useMemo} from "react";
import {HomeCompanyPageContext} from "pages/company//HomeCompanyPage";
import {CompanyFileContext, CompanyFileContextProvider} from "hooks/contexts/CompanyFileContext";
import {CompanyFileSourceType, CompanyFileType} from "types/company/companyEnums";
import {NavsTabVertical} from "components/navs/NavsTab";
import CompanyPersonalInformationContactInfo from "pages/companyFile/company/CompanyPersonalInformationContactInfo";
import CompanyFileSectionCompletenessAction
    from "pages/companyFile/company/components/CompanyFileSectionCompletenessAction";
import {CompanyFileCompletenessFields} from "types/company/companyData";
import CompanyPersonalInformationActivityInfo from "pages/companyFile/company/CompanyPersonalInformationActivityInfo";
import CompanyPersonalInformationFiscalInfo from "pages/companyFile/company/CompanyPersonalInformationFiscalInfo";
import CompanyPersonalInformationCertificationPyMEInfo
    from "pages/companyFile/company/CompanyPersonalInformationCertificationPyMEInfo";
import {Skeleton} from "@mui/lab";
import NavsTabVerticalHeaderBase from "components/navs/NavsTabVerticalHeaderBase";
import {CheckIcon, ClipboardIcon, ShareIcon} from "lucide-react";
import LinearProgress from "@mui/material/LinearProgress";
import {Button, Stack} from "@mui/material";
import { TypographyBase } from "components/misc/TypographyBase";
import {numberFormatter} from "util/formatters/numberFormatter";
import {dateFormatter} from "util/formatters/dateFormatter";
import CompanyStatusVerificationCard from "../components/home/CompanyStatusVerificationCard";

function HomeCompanyPageCompanyFileTab() {
    const { companyId, companyCompleteness, tabSize } = useContext(HomeCompanyPageContext);
    const completenessData = useMemo(() => {
        if (!companyCompleteness) return undefined;
        
        return {
            percentage: companyCompleteness?.[CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage],
            date: companyCompleteness?.[CompanyFileCompletenessFields.FileTypeShortLastModifiedDate] || new Date(),
        }
    }, [companyCompleteness]);    
    
    if (!companyId)
        return <Skeleton />

    const HeaderTab = () => (
        <NavsTabVerticalHeaderBase title={'Legajo de Contacto'}
                                   Icon={ClipboardIcon}
                                   description={'Información básica que se envía con cada solicitud. Asegurate de tenerla actualizada para estar siempre listo.'}>
            {
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
            }
        </NavsTabVerticalHeaderBase>
    )
    
    return (
        <CompanyFileContextProvider dataId={companyId}
                                    dataSource={CompanyFileSourceType.Company}
                                    companyFileType={CompanyFileType.Short}
        >
                <NavsTabVertical
                    tabSize={tabSize}
                    checkShouldWarnBeforeSwitch
                    alwaysSomeActiveTab
                    insideOtherTabs
                    header={<HeaderTab />}
                    headerTab={<CompanyStatusVerificationCard marginBottom={2} />}
                    actionInside={<CompanyFileExportButton />}
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
        </CompanyFileContextProvider>
    )
}

function CompanyFileExportButton() {
    const { openExportDialog } = useContext(CompanyFileContext);
    
    return (
        <Button color={'secondary'} 
                variant={'outlined'}
                startIcon={<ShareIcon /> }
                onClick={openExportDialog}
                fullWidth
        >
            Exportar Datos
        </Button>
    )
}

export default HomeCompanyPageCompanyFileTab;
