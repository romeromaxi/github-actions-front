import {useEffect, useState} from "react";
import {ValidationStatesType} from "../../../types/person/personEnums";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useUser} from "../../../hooks/contexts/UserContext";
import UserValidationComponent from "./UserValidationComponent";
import { CryptoJSHelper } from "util/helpers";

const UserValidationPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    
    const encryptedRedirect = searchParams.get('redirect');
    const encryptedReturn = searchParams.get('return');
    const waitBackgroundProcessing = searchParams.get('wait')?.toLowerCase() === 'true';
    
    const redirectUrl = encryptedRedirect ? CryptoJSHelper.decryptRoute(encryptedRedirect) : '';
    const returnUrl = encryptedReturn ? CryptoJSHelper.decryptRoute(encryptedReturn) : '';
    
    const [firstRender, setFirstRender] = useState<boolean>(true);
    
    const onHandleSubmit = () => {
        if (redirectUrl && redirectUrl !== '') {
            navigate(redirectUrl, { replace: true });
        } else if (returnUrl && returnUrl !== '') {
            navigate(returnUrl, { replace: true });
        } else {
            navigate(-1);
        }
    }
    
    useEffect(() => {
        if (firstRender) {
            if (user?.validationIdentityStatusCode === ValidationStatesType.Validated) {
                if (redirectUrl && redirectUrl !== '') {
                    navigate(redirectUrl, { replace: true });
                } else if (returnUrl && returnUrl !== '') {
                    navigate(returnUrl, { replace: true });
                } else {
                    navigate(-1);
                }
            }
            setFirstRender(false);
        }
    }, [redirectUrl, returnUrl, firstRender]);
    
    return (
        <UserValidationComponent onSubmit={onHandleSubmit} 
                                 waitBackgroundProcessing={waitBackgroundProcessing}
        />
    )
}


export default UserValidationPage;