import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import CreateCompanyComponent from "./CreateCompanyComponent";
import { CryptoJSHelper } from "util/helpers";
import {useUser} from "hooks/contexts/UserContext";
import {useEffect, useState} from "react";

const CreateCompanyPage = () => {
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    
    const encryptedRedirect = searchParams.get('redirect');
    const encryptedReturn = searchParams.get('return');
    
    const redirectUrl = encryptedRedirect ? CryptoJSHelper.decryptRoute(encryptedRedirect) : '';
    const returnUrl = encryptedReturn ? CryptoJSHelper.decryptRoute(encryptedReturn) : '';

    const [currentLocation, _] = useState<string>(`${location.pathname}${location.search}${location.hash}`);
    
    const onHandleSubmit = () => {
        if (redirectUrl && redirectUrl !== '') {
            navigate(redirectUrl);
        } else {
            navigate('/mi-cuenta');
        }
    };
    
    const onHandleClose = () => {
        if (returnUrl && returnUrl !== '') {
            navigate(returnUrl);
        } else {
            navigate(-1);
        }
    };

    useEffect(() => {
        if (!!user && !user.hasValidatedIdentity && !!currentLocation) {
            const validateSearchParams = new URLSearchParams();
            validateSearchParams.append('redirect', CryptoJSHelper.encryptRoute(currentLocation));
            
            if (!!encryptedReturn) {
                validateSearchParams.append('return', encryptedReturn);
            }

            navigate({
                pathname: `/validar-identidad`,
                search: validateSearchParams.toString()
            });
        }
    }, [user, currentLocation]);
    
    return (
        <CreateCompanyComponent onSubmit={onHandleSubmit} 
                                onClickReturn={onHandleClose}
                                returnLabel={"Cancelar"}
        />
    )
}


export default CreateCompanyPage;