import {Box, Card, CardContent} from "@mui/material";
import { CompanyKeyData, CompanyKeyDataFields } from "types/company/companyData";
import { useState } from "react";
import CreateCompanyStep2Afip from "./CreateCompanyStep2Afip";
import CreateCompanyStep3Form from "./CreateCompanyStep3Form";
import {useSnackbarActions} from "../../../hooks/useSnackbarActions";
import {UserOperationWithoutActivityDetail} from "../../user/operations/UserOperationsWithoutActivity";

export enum CreateCompanySteps {
    STEP_CHOOSE_CREATION_MODE = 'chooseCreationMode',
    STEP_AFIP_SYNC = 'afipSync',
    STEP_COMPANY_FORM = 'companyForm',
}

interface CreateCompanyComponentProps {
    onSubmit: () => void,
    onClickReturn: () => void,
    returnLabel?: string,
    initialStep?: {
        step: CreateCompanySteps,
        willCreate: boolean
    }
}

const CreateCompanyComponent = ({
    initialStep = { step: CreateCompanySteps.STEP_CHOOSE_CREATION_MODE, willCreate: true },
    ...props
}: CreateCompanyComponentProps) => {
    const [step, setStep] = useState<CreateCompanySteps>(initialStep?.step);
    const [companyKeyData, setCompanyKeyData] = useState<CompanyKeyData>();
    const [sameCuit, setSameCuit] = useState<boolean>(false);
    const [willCreate, setWillCreate] = useState<boolean>(initialStep?.willCreate);
    const { addSnackbarSuccess } = useSnackbarActions();

    const handleAfipSyncComplete = (companyData: CompanyKeyData, isSameCuit: boolean) => {
        setCompanyKeyData(companyData);
        setSameCuit(isSameCuit);
        setStep(CreateCompanySteps.STEP_COMPANY_FORM);
    };
    
    const handleCompanyFormComplete = (responsible: boolean) => {
        addSnackbarSuccess(
            companyKeyData?.[CompanyKeyDataFields.ActiveCompany] ?
                'La solicitud para unirse a la empresa fue enviada con éxito.'
                :
                'La empresa fue creada con éxito y ya fue añadida a tu cuenta.'
        )
        props.onSubmit();
    };

    const handleChooseCreationMode = (create: boolean) => {
        setWillCreate(create);
        setStep(CreateCompanySteps.STEP_AFIP_SYNC);
    }
    
    return (
        <Box sx={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <Card variant={'onboarding'}>
                <CardContent sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {step === CreateCompanySteps.STEP_CHOOSE_CREATION_MODE && (
                        <UserOperationWithoutActivityDetail onClickCreate={() => handleChooseCreationMode(true)}
                                                            onClickJoin={() => handleChooseCreationMode(false)}
                                                            onClickReturn={props.onClickReturn}
                                                            returnLabel={props.returnLabel}
                        />   
                    )}
                    {step === CreateCompanySteps.STEP_AFIP_SYNC && (
                        <CreateCompanyStep2Afip onComplete={handleAfipSyncComplete}
                                                creation={willCreate}
                                                onBack={() => setStep(CreateCompanySteps.STEP_CHOOSE_CREATION_MODE)}
                        />
                    )}
                    {step === CreateCompanySteps.STEP_COMPANY_FORM && companyKeyData && (
                        <CreateCompanyStep3Form
                            companyKeyData={companyKeyData}
                            sameCuit={sameCuit}
                            onComplete={handleCompanyFormComplete}
                            onBack={() => setStep(CreateCompanySteps.STEP_AFIP_SYNC)}
                            creation={willCreate}
                        />
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}



export default CreateCompanyComponent;