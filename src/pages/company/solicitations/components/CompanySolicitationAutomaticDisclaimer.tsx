import React, {useEffect, useMemo, useState} from "react";
import {Alert} from "@mui/lab";
import {AlertTitle, IconButton, Link} from "@mui/material";
import { SolicitationViewDTO } from "types/solicitations/solicitationData";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {themeTypographyDefinition} from "util/themes/definitions";
import {DialogAlert} from "components/dialog";
import {EntityWithIdFields} from "types/baseEntities";
import {HttpSolicitation} from "http/index";
import useAxios from "hooks/useAxios";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {useAppNavigation} from "hooks/navigation";
import { XIcon } from "lucide-react";
import {WrapperIcons} from "components/icons/Icons";

interface CompanySolicitationAutomaticDisclaimerProps {
    solicitation?: SolicitationViewDTO
}

function CompanySolicitationAutomaticDisclaimer({ solicitation }: CompanySolicitationAutomaticDisclaimerProps) {
    const solicitationId = solicitation?.[EntityWithIdFields.Id];
    const { fetchData } = useAxios();
    const { addSnackbarSuccess } = useSnackbarActions();
    const { navigate } = useAppNavigation();
    
    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(!!solicitation && !!solicitation[SolicitationViewDTOFields.IsNewSolicitationSideCompany]);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    
    const titleAlert = useMemo(() => {
        if (!solicitation) return '';

        const nameIntermediary =
            solicitation[SolicitationViewDTOFields.IntermediaryOffererBusinessName] || 'LUC';
        
        const originSolicitationType =
            solicitation[SolicitationViewDTOFields.OriginSolicitationTypeDesc] || 'solicitud anterior';
        
        
        return `Esta solicitud fue iniciada por ${nameIntermediary} a través de una ${originSolicitationType}`
    }, [solicitation]);
    
    const handleCloseDisclaimer = () => {
        setShowDisclaimer(false)
        if (solicitationId)
            fetchData(
                () => HttpSolicitation.markSolicitationAsViewed(solicitationId),
                false,
            ).then(() => { });
    }
    
    const openCancelDialog = () => setShowCancelDialog(true);

    const onCancelSolicitation = () => {
        if (solicitationId)
            fetchData(
                () => HttpSolicitation.cancelSolicitation(solicitationId),
                true,
            ).then(() => {
                addSnackbarSuccess('Solicitud cancelada con éxito');
                navigate(-1);
            });
    };

    useEffect(() => {
        setShowDisclaimer(!!solicitation && !!solicitation[SolicitationViewDTOFields.IsNewSolicitationSideCompany])
    }, [solicitation]);
    
    return (
        !showDisclaimer ? 
            null
            : (
                <React.Fragment>
                    <Alert severity={'info'}
                           icon={false}
                           role={'disclaimer'}
                           sx={{
                               backgroundColor: '#E8EEF9 !important',
                               color: '#0D3F9B !important',
                               boxShadow: `inset 0 0 0 1px #3677ED`,
                               padding: '24px',
                               borderRadius: '16px'
                           }}
                           action={
                                <IconButton onClick={handleCloseDisclaimer}
                                            sx={{ padding: '0px !important', height: 'fit-content', width: 'fit-content' }}>
                                    <WrapperIcons Icon={XIcon} size={'md'} />
                                </IconButton>
                           }
                    >
                        <AlertTitle sx={{
                            ...themeTypographyDefinition.h5,
                            color: '#0D3F9B !important'
                        }}>
                            {titleAlert}
                        </AlertTitle>
                        {`Si prefirís no continuar con este producto, podes detener esta solicitud haciendo `}
                        <Link component={'button'} color={'#0D3F9B'} fontWeight={500} onClick={openCancelDialog}>
                            click aquí
                        </Link>.
                    </Alert>

                    <DialogAlert open={showCancelDialog}
                                 severity={'error'}
                                 title={`Cancelar solicitud #${solicitationId || ''}`}
                                 textContent={`¿Estás seguro que querés cancelar esta solicitud?`}
                                 onClose={() => setShowCancelDialog(false)}
                                 onConfirm={onCancelSolicitation}
                                 textConfirm={"Sí, cancelar"}
                    >
                        Al cancelar la solicitud, esta quedará inactiva y no se podrán realizar operaciones adicionales.
                    </DialogAlert>
                </React.Fragment>
            )
    )
}

export default CompanySolicitationAutomaticDisclaimer;