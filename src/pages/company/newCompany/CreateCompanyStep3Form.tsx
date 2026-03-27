import {Button, Stack, Typography} from '@mui/material';
import FromMarketNewCompanyForm from '../../markets/components/forms/FromMarketNewCompanyForm';
import {CompanyKeyData, CompanyKeyDataFields} from '../../../types/company/companyData';
import {TypographyBase} from "../../../components/misc/TypographyBase";
import NewCompanyActiveForm from "./NewCompanyActiveForm";

interface CreateCompanyStep3FormProps {
    companyKeyData: CompanyKeyData;
    sameCuit: boolean;
    onComplete: (isResponsible: boolean) => void;
    onBack: () => void;
    creation: boolean;
}

const CreateCompanyStep3Form = ({
                                    companyKeyData,
                                    sameCuit,
                                    onComplete,
                                    onBack,
                                    creation
                                }: CreateCompanyStep3FormProps) => {

    const handleSubmit = (isResponsible: boolean, validated: boolean) => {
        onComplete(isResponsible);
    };

    const getTypographySectionColor = () => {
        const active = companyKeyData[CompanyKeyDataFields.ActiveCompany];
        if (creation) {
            return active ? '#C14A00' : 'primary';
        } else {
            return active ? 'primary' : '#C14A00';
        }
    }
    
    return (
        <Stack spacing={4}>
            <Stack spacing={1}>
                <TypographyBase variant="eyebrow2"
                                color={getTypographySectionColor()}
                                fontWeight={600}
                >
                    {creation ?
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'ESTE CUIT YA ESTÁ CARGADO EN LUC'
                            :
                            'CREAR CUENTA PYME'
                        :
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'UNIRME A UNA PYME'
                            :
                            'ESTE CUIT NO ESTÁ EN LUC'
                    }
                </TypographyBase>
                <Typography variant="h4" fontWeight={600}>
                    {creation ?
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'Esta cuenta PyME ya existe en LUC'
                            :
                            'Confirmá si tus datos son correctos'
                        :
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'Confirmá si los datos son correctos'
                            :
                            'Esta PyME no exite en LUC aún'
                    }
                </Typography>
                <Typography variant="body2" color='text.lighter'>
                    {creation ?
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'Ya existe una PyME con este CUIT en nuestro sistema. Si querés operar como esta PyME, debés enviar una solicitud al responsable. Si crees que hay un error, contactate con nosotros.'
                            :
                            'Una vez creada tu cuenta PyME en LUC, podrás cargar más datos, invitar a otros participantes y explorar productos para tu financiamiento.'
                        :
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'Enviaremos una solicitud al responsable de esta PyME para que te asigne un rol.'
                            :
                            'Si sos el responsable o querés gestionar esta PyME, primero tenés que crearla en LUC'
                    }
                </Typography>
            </Stack>
            {
                companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                    <NewCompanyActiveForm onSubmitted={handleSubmit}
                                          samePerson={sameCuit}
                                          companyKeyData={companyKeyData}
                    />
                    :
                    <FromMarketNewCompanyForm
                        onSubmitted={handleSubmit}
                        samePerson={sameCuit}
                        companyKeyData={companyKeyData}
                        handleWithoutForm={() => {}}
                    />
            }
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Button variant="outlined" color={'secondary'} onClick={onBack}>
                    No, volver atrás
                </Button>
                <Button color="primary" variant="contained" type="submit" form={companyKeyData[CompanyKeyDataFields.ActiveCompany] ? "new-company-active-data-form" : "new-company-data-form"}>
                    {creation ?
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'Solicitar Unirme'
                            :
                            'Crear PyME'
                        :
                        companyKeyData[CompanyKeyDataFields.ActiveCompany] ?
                            'Enviar solicitud'
                            :
                            'Operar como esta PyME'
                    }
                </Button>
            </Stack>
        </Stack>
    );
};

export default CreateCompanyStep3Form;
