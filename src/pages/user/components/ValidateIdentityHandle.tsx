import React, {useState} from 'react';
import {useAction} from 'hooks/useAction';
import {DialogAlert} from 'components/dialog';
import {HttpUser} from 'http/index';
import {UserModelViewFields} from 'types/user';
import {ValidationStatesType} from 'types/person/personEnums';
import {useNavigate} from "react-router-dom";
import {CryptoJSHelper} from 'util/helpers';

interface ValidateIdentityHandleProps {
    onClick: () => void;
    children: React.ReactElement;
    redirectUrl?: string;
    returnUrl?: string;
    waitBackgroundProcessing?: boolean;
}

function ValidateIdentityHandle(props: ValidateIdentityHandleProps) {
    const {showLoader, hideLoader} = useAction();
    const navigate = useNavigate();
    const [showPendingValidate, setShowPendingValidate] =
        useState<boolean>(false);

    const getUserStorage = () => {
        const {userStorage} = require('util/localStorage/userStorage');
        return userStorage;
    };

    const loadValidationStatus = () => {
        HttpUser.getValidateIdentity()
            .then((response) => {
                const statusCode = response[UserModelViewFields.ValidationIdentityStatusCode];
                const userStorage = getUserStorage();
                userStorage.setValidatedIdentityCode(statusCode);
                switch (statusCode) {
                    case ValidationStatesType.LoadProcess:
                    case ValidationStatesType.Returned:
                        const searchParams = new URLSearchParams();

                        if (props.redirectUrl) {
                            searchParams.append('redirect', CryptoJSHelper.encryptRoute(props.redirectUrl));
                        }

                        if (props.returnUrl) {
                            searchParams.append('return', CryptoJSHelper.encryptRoute(props.returnUrl));
                        }
                        
                        if (!!props.waitBackgroundProcessing) {
                            searchParams.append('wait', 'true');
                        }

                        navigate({
                            pathname: `/validar-identidad`,
                            search: searchParams.toString()
                        });
                        break;

                    case ValidationStatesType.PendingValidation:
                        setShowPendingValidate(true);
                        break;
                    case ValidationStatesType.Validated:
                        userStorage.setValidatedIdentity(true);
                        props.onClick();
                        break;
                }
            })
            .finally(() => hideLoader());
    };

    const onHandleClick = () => {
        const userStorage = getUserStorage();
        if (!userStorage.hasValidatedIdentity()) {
            showLoader();
            loadValidationStatus();
        } else {
            props.onClick();
        }
    };

    const hidePendingValidateUser = () => setShowPendingValidate(false);

    return (
        <React.Fragment>
            {React.cloneElement(props.children, {onClick: onHandleClick})}
            <DialogAlert
                open={showPendingValidate}
                onClose={hidePendingValidateUser}
                textClose={'Cerrar'}
                textContent={
                    'Estamos verificando tu identidad para garantizar la seguridad de tu cuenta. \n ¡Gracias por tu paciencia mientras trabajamos en ello!'
                }
            />
        </React.Fragment>
    );
}

export default ValidateIdentityHandle;
