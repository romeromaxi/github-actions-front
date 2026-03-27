import React, {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {useCompanySolicitation} from "../CompanySolicitationContext";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import {SolicitationFlagsFields} from "types/solicitations/solicitationData";
import {DialogAlert} from "components/dialog";
import {HttpSolicitation} from "http/index";
import useAxios from "hooks/useAxios";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {WrapperIcons} from "components/icons/Icons";

const MenuId: string = "company-solicitation-header-menu"

interface MenuOption {
    label: string,
    Icon?: React.ElementType,
    onClick: () => void
}

function CompanySolicitationHeaderMenuOptions() {
    const { fetchData } = useAxios();
    const { addSnackbarSuccess } = useSnackbarActions();
    const navigate = useNavigate();
    const { solicitationId, solicitation, flags } = useCompanySolicitation();
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [showCancelDialog, setShowCancelDialog] = React.useState(false);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => setAnchorEl(null);
    
    const menuItems: MenuOption[] = useMemo(() => {
        const itemsActions = []
        
        if (!!solicitation && flags?.[SolicitationFlagsFields.SolicitationCancelAllowed]) {
            itemsActions.push({
                label: 'Cancelar solicitud',
                Icon: TrashIcon,
                onClick: () => {
                    setShowCancelDialog(true);
                    handleCloseMenu();
                }
            }) 
        }
        
        return itemsActions
    }, [solicitation, flags]);

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
    
    return (
        <React.Fragment>
            {
                menuItems.length &&
                    <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        sx={{ borderColor: '#BFBFBF', px: 0.25, minWidth: 'auto' }}
                        onClick={handleMenuClick}
                        aria-controls={menuOpen ? MenuId : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                    >
                        <EllipsisIcon size={16} style={{ padding: '0px' }} />
                    </Button>
            }
            
            <Menu id={MenuId}
                  open={menuOpen}
                  anchorEl={anchorEl}
                  onClose={handleCloseMenu}
            >
                {
                    menuItems.map((oneMenuItem, index) => (
                        <MenuItem key={`menuItemCompanySolicitationHeaderMenuOptions_${index}`}
                                  onClick={oneMenuItem.onClick}>
                            {
                                oneMenuItem.Icon &&
                                <ListItemIcon>
                                    <WrapperIcons Icon={oneMenuItem.Icon} />
                                </ListItemIcon>
                            }
                            
                            {oneMenuItem.label}
                        </MenuItem>
                    ))
                }
            </Menu>


            <DialogAlert open={showCancelDialog}
                         severity={'error'}
                         title={`Cancelar solicitud #${solicitationId}`}
                         textContent={`¿Estás seguro que querés cancelar esta solicitud?`}
                         onClose={() => setShowCancelDialog(false)}
                         onConfirm={onCancelSolicitation}
                         textConfirm={"Sí, cancelar"}
            >
                Al cancelar la solicitud, esta quedará inactiva y no se podrán realizar operaciones adicionales.
                Para reactivarla, será necesario enviar una nueva solicitud para la línea.
            </DialogAlert>
            <div />
        </React.Fragment>
    )
}

export default CompanySolicitationHeaderMenuOptions;