import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { userStorage } from '../../../util/localStorage/userStorage';
import ValidateUserIdentityDialog from '../../user/components/ValidateUserIdentityDialog';
import { HttpUser } from '../../../http';
import { UserModelViewFields } from '../../../types/user';
import { ValidationStatesType } from '../../../types/person/personEnums';

interface CreateCompanyStep1ValidationProps {
    onComplete: (cuit?: string) => void;
}

const CreateCompanyStep1Validation = ({ onComplete }: CreateCompanyStep1ValidationProps) => {
    const validatedIdentity = userStorage.hasValidatedIdentity();
    const [openValidation, setOpenValidation] = useState<boolean>(!validatedIdentity);

    useEffect(() => {
        if (validatedIdentity) {
            onComplete();
        }
    }, [validatedIdentity, onComplete]);

    const handleValidate = (cuit?: string) => {
        setOpenValidation(false);
        HttpUser.getValidateIdentity().then((r) => {
            const statusCode = r[UserModelViewFields.ValidationIdentityStatusCode];
            userStorage.setValidatedIdentityCode(statusCode);
            if (statusCode === ValidationStatesType.Validated) {
                userStorage.setValidatedIdentity(true);
            }
            onComplete(cuit);
        });
    };

    return (
        <Stack spacing={2}>
            <ValidateUserIdentityDialog
                open={openValidation}
                onClose={() => {}}
                onReload={handleValidate}
            />
        </Stack>
    );
};

export default CreateCompanyStep1Validation;

