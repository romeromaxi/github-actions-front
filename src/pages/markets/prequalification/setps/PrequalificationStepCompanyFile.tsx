import React, {useContext, useEffect} from 'react';
import {NavsTabVertical} from "components/navs/NavsTab";
import {TypographyBase} from "components/misc/TypographyBase";
import {Stack} from '@mui/material';
import {WrapperIcons} from "components/icons/Icons";
import {ClipboardIcon} from "lucide-react";
import CompanyPersonalInformationContactInfo from "../../../companyFile/company/CompanyPersonalInformationContactInfo";
import CompanyPersonalInformationActivityInfo
    from "../../../companyFile/company/CompanyPersonalInformationActivityInfo";
import CompanyPersonalInformationFiscalInfo from "../../../companyFile/company/CompanyPersonalInformationFiscalInfo";
import CompanyPersonalInformationCertificationPyMEInfo
    from "../../../companyFile/company/CompanyPersonalInformationCertificationPyMEInfo";
import {CompanyFileContext} from "hooks/contexts/CompanyFileContext";
import LinearProgress from "@mui/material/LinearProgress";
import {numberFormatter} from "util/formatters/numberFormatter";
import CompanyFileSectionCompletenessAction
    from "../../../companyFile/company/components/CompanyFileSectionCompletenessAction";
import {CompanyFileCompletenessFields} from "../../../../types/company/companyData";
import {Skeleton} from "@mui/lab";
import {PrequalificationStepperContext} from "../PrequalificationStepper";

interface PrequalificationStepCompanyFileProps {
    disableEdit?: boolean
}
function PrequalificationStepCompanyFile({disableEdit}: PrequalificationStepCompanyFileProps) {
    const { setOnBeforeSubmit } = useContext(PrequalificationStepperContext);
    const { completenessPercentage, fileTypeCompleteness, updateCompanyFile } = useContext(CompanyFileContext);

    useEffect(() => {
        const handleBeforeSubmit = async () => {
            return await updateCompanyFile();
        };

        setOnBeforeSubmit(() => handleBeforeSubmit)
    }, [])
    
    const HeaderBox = () => (
        <Stack spacing={2}>
            <Stack direction={'row'} spacing={2}>
                <WrapperIcons Icon={ClipboardIcon} size={'md'} color={'primary'} />
                
                <TypographyBase variant={'h4'}>Legajo de contacto</TypographyBase>
            </Stack>
            
            <TypographyBase variant={'body2'} color={'text.lighter'}>
                Información básica que se envía con cada solicitud. Asegurate de tenerla actualizada para estar siempre listo.
            </TypographyBase>

            {
                (completenessPercentage) ?
                    <Stack spacing={1.75}>
                        <LinearProgress variant="determinate" 
                                        color={fileTypeCompleteness < 100 ? 'warning' : 'primary'}
                                        value={fileTypeCompleteness}
                        />

                        <Stack width={1} alignItems={'end'}>
                            <TypographyBase variant={'body4'} color={'text.lighter'}>
                                {`${numberFormatter.toStringWithPercentage(fileTypeCompleteness, 0, 0)} Completado`}
                            </TypographyBase>
                        </Stack>
                    </Stack>
                    :
                    <Stack width={1}>
                        <Skeleton variant={'text'} height={'10px'} />
                    </Stack>
            }
        </Stack>
    )
    
    return (
        <NavsTabVertical
            tabSize={3.6}
            checkShouldWarnBeforeSwitch
            header={<HeaderBox />}
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

export default PrequalificationStepCompanyFile;
