import DrawerBase from "../../../../components/misc/DrawerBase";
import NewCompanyBaseFormProcess, {
    NewCompanyBaseProcess
} from "../../../markets/lines/shoppingbag/dialogs/NewCompanyBaseFormProcess";
import React, {useEffect, useState} from "react";
import {userStorage} from "../../../../util/localStorage/userStorage";
import {SendButton} from "../../../../components/buttons/Buttons";

interface NewCompanyBaseDrawerProps {
    open: boolean,
    onClose: () => void,
    onSubmit: () => void;
    forbidOwnCuit?: boolean;
    onSamePerson?: () => void;
    onReload: () => void;
}


const NewCompanyBaseDrawer = ({open, onClose, onSubmit, forbidOwnCuit = false, onSamePerson, onReload} : NewCompanyBaseDrawerProps) => {
    const [hideButton, setHideButton] = useState<boolean>(false)
    const validatedIdentity = userStorage.hasValidatedIdentity();
    const [isResponsible, setIsResponsible] = useState<boolean>(false)
    const [process, setProcess] = useState<NewCompanyBaseProcess | undefined>(
        validatedIdentity
            ? NewCompanyBaseProcess.Synchronization
            : NewCompanyBaseProcess.Validation,
    );
    
    const renderAction = () => {
        switch (process) {
            case NewCompanyBaseProcess.CompanyForm:
                return <SendButton type="submit" form="new-company-data-form" id={"company-new-step-confirm-btn"}>Dar de alta cuenta empresa</SendButton>
            case NewCompanyBaseProcess.Synchronization:
                return <SendButton type="submit" form="company-afip-form" id={"company-new-step-synchronization-btn"}>Enviar</SendButton>
            case NewCompanyBaseProcess.FinishCreate:
                return <SendButton type="submit" form="finish-company-create-form" 
                                   id={!isResponsible ? "company-new-step-invite-btn" : "company-new-step-finish-btn"}>
                    {!isResponsible ? 'Invitar' : 'Enviar'}
                </SendButton>
            case NewCompanyBaseProcess.Validation:
                return <></>
            default:
                return <></>
        }
    }

    useEffect(() => {
        if (open) {
            setHideButton(false)
            setProcess(validatedIdentity
                ? NewCompanyBaseProcess.Synchronization
                : NewCompanyBaseProcess.Validation)
        }
    }, [open]);
    
    return (
        <>
            <DrawerBase
                show={open}
                onCloseDrawer={onClose}
                title={process == NewCompanyBaseProcess.FinishCreate ? '' : 'Alta de Cuenta MiPyME'}
                action={hideButton ? undefined : renderAction()}
            >
                <NewCompanyBaseFormProcess onSubmit={onSubmit}
                                           onReload={onReload}
                                           forbidOwnCuit={forbidOwnCuit}
                                           onSamePerson={onSamePerson}
                                           currentProcess={process}
                                           setCurrentProcess={setProcess}
                                           setHideButton={setHideButton}
                                           setIsResponsible={setIsResponsible}
                />
            </DrawerBase>
        </>
    )
}



export default NewCompanyBaseDrawer