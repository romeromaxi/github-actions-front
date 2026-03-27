import { useState } from 'react';
import {Button, Stack, Typography} from '@mui/material';
import NewCompanyAfipData from './NewCompanyAfipData';
import {CompanyKeyData} from '../../../types/company/companyData';
import { userStorage } from '../../../util/localStorage/userStorage';
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {WrapperIcons} from "../../../components/icons/Icons";
import {Info} from "phosphor-react";
import {themeColorDefinition} from "../../../util/themes/definitions";

interface CreateCompanyStep2AfipProps {
    onComplete: (companyData: CompanyKeyData, isSameCuit: boolean) => void;
    creation: boolean;
    onBack: () => void;
}

const CreateCompanyStep2Afip = ({ onComplete, creation, onBack }: CreateCompanyStep2AfipProps) => {
    const [showTitle, setShowTitle] = useState<boolean>(true);

    const handleSubmitAfipData = (companyData: CompanyKeyData) => {
        const companyCuit = companyData.cuit;
        const userCuit = userStorage.getCuit();
        const isSameCuit = userCuit === companyCuit;

        onComplete(companyData, isSameCuit);
    };

    return (
        <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between">
                <Stack spacing={1}>
                    <TypographyBase variant="eyebrow2" color={"primary"}>
                        {
                            creation ? 'CREAR CUENTA PYME' 
                                : 
                                'UNIRME A UNA PYME'
                        }
                    </TypographyBase>
                
                    <Typography variant="h4" fontWeight={600}>
                        {creation ? 'Ingresá el CUIT de la PyME' : 'Ingresá el CUIT de la PyME a la que te querés unir'}
                    </Typography>
                </Stack>

                <WrapperIcons Icon={Info} size='lg'
                              color={themeColorDefinition.UIElements.texts.tertiary}
                              tooltip="El CUIT es el número único de identificación tributaria. Podés encontrarlo en tu constancia de AFIP o en facturas oficiales."
                />
            </Stack>
            <Stack spacing={1}>
                <NewCompanyAfipData
                    onSubmitted={handleSubmitAfipData}
                    canSyncOwnCuit={true}
                    marketRegister={false}
                    onHideTitle={() => setShowTitle(false)}
                    handleWithoutForm={() => {}}
                    handleBackForm={() => {}}
                    creation={creation}
                />
                <Typography color="#164293" fontFamily="Geist" fontSize={14} fontWeight={600}>
                    {creation ? 'Tu información está segura y no será compartida con terceros.' : 'Esta información es segura y no será compartida con terceros.'}
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Button variant="outlined" color={'secondary'} onClick={onBack}>
                    Volver
                </Button>
                <Button color="primary" variant="contained" type="submit" form="company-afip-form">
                    Continuar
                </Button>
            </Stack>
        </Stack>
    );
};

export default CreateCompanyStep2Afip;
