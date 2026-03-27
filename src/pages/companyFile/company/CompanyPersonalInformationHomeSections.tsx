import React, {useContext, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


import {HttpSolicitation} from 'http/index';

import { useAction } from 'hooks/useAction';
import useAxios from 'hooks/useAxios';
import { DialogAlert } from '../../../components/dialog';
import CompanyPersonalInformationDetailSections from "./CompanyPersonalInformationDetailSections";
import {CompanyFileContext} from "../../../hooks/contexts/CompanyFileContext";

interface CompanyPersonalInformationHomeProps {
    solicitationId?: number;
    allowEdit?: boolean;
    marketEdit?: boolean,
    afterSave?: () => void,
    marketSave?: boolean,
    context: React.Context<any>
}

export function CompanyPersonalInformationSectionsView({
                                                       solicitationId,
                                                       allowEdit = false, marketEdit = false, context
                                                   }: CompanyPersonalInformationHomeProps) {
    const { snackbarSuccess } = useAction();
    const { fetchData } = useAxios();
    const navigate = useNavigate();
    const [openSend, setOpenSend] = useState<boolean>(false);
    const { completenessPercentage } = useContext(CompanyFileContext);

    const location = useLocation();

    const goToBack = () => {
        if (location.state === 'model') {
            localStorage.setItem('stateFromCompanyFile', 'activado');
        }

        navigate(-1);
    };

    const onUpdateSolicitationFile = () => {
        if (solicitationId)
            fetchData(
                () => HttpSolicitation.updateSolicitationFile(solicitationId),
                true,
            )
                .then(() => {
                    snackbarSuccess(
                        `El legajo de la solicitud ${solicitationId} ha sido enviado correctamente`,
                    );
                    goToBack();
                })
                .finally(() => setOpenSend(false));
    };
    
    return (
        <React.Fragment>
            <CompanyPersonalInformationDetailSections allowEdit={allowEdit || marketEdit}
                                                      context={context}
                                                      completenessPercentage={completenessPercentage}
            />
            <DialogAlert
                onClose={() => setOpenSend(false)}
                open={openSend}
                onConfirm={onUpdateSolicitationFile}
                title={'Enviar legajo de solicitud'}
                textContent={`¿Está seguro de enviar el legajo de la solicitud #${solicitationId}?`}
            />
        </React.Fragment>
    );
}
