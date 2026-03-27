import React, {useRef, useState} from 'react';

import {Box, Stack, Typography, Menu, MenuItem, IconButton} from '@mui/material';
import {EntityWithIdFields} from 'types/baseEntities';
import {CompanyViewDTO, CompanyViewDTOFields,} from 'types/company/companyData';
import {stringFormatter} from 'util/formatters/stringFormatter';

import {HttpCompany, HttpCompanyRoles,} from 'http/index';
import {useNavigate} from 'react-router-dom';
import {CompanyHeaderSecObjects, SecurityComponents} from 'types/security';
import {useAction} from 'hooks/useAction';
import {ButtonIconDropdown, MenuItemDropdown} from 'components/buttons/Buttons';
import {TypographyBase} from "../../../components/misc/TypographyBase";
import useAxios from "../../../hooks/useAxios";
import {WrapperIcons} from "../../../components/icons/Icons";
import {IdentificationCard, Image as ImageIcon, Trash} from "phosphor-react";
import {SettingsIcon, TrashIcon} from "lucide-react";
import useSecurityObject from "../../../hooks/useSecurityObject";
import ButtonsStyles from "../../../components/buttons/Buttons.styles";
import {DialogAlert} from "../../../components/dialog";
import {CompanyLogoById} from "./CompanyLogo";
import {PersonTypes} from "../../../types/person/personEnums";

interface CompanyHeaderProps {
  company: CompanyViewDTO;
  rightComponent?: React.ReactNode;
  headerActions?: boolean;
}

function CompanyHeader(props: CompanyHeaderProps) {
  const companyId: number = props.company[EntityWithIdFields.Id];
  const hiddenFileInput = useRef<any>();
  const classes = ButtonsStyles();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [quitDialog, setQuitDialog] = useState<boolean>(false);
  const { fetchData } = useAxios();
  const {hasReadPermission, hasWritePermission} = useSecurityObject()
  const navigate = useNavigate();
  const { snackbarSuccess, setFnLoadAvatar } = useAction();

  const handleClickEdit = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

  const onSaveLogo = (file: File) => {
    if (companyId) {
      setFnLoadAvatar(undefined);
      HttpCompany.updateCompanyLogo(companyId, file)
        .then()
        .finally(() => {
          setFnLoadAvatar(
            () => HttpCompany.getCompanyLogo(companyId),
            (logo: File) => HttpCompany.updateCompanyLogo(companyId, logo),
          );
        });
    }
  };

  const onDeletePyme = () => {
    setDeleteDialog(true);
  };

  const onQuitPyme = () => {
    setQuitDialog(true);
  };
  const onCloseQuit = () => setQuitDialog(false);
  const onConfirmDelete = () => {
    fetchData(() => HttpCompany.delete(companyId), true).then(() => {
      navigate('/');
      snackbarSuccess('La empresa fue eliminada con éxito');
    });
  };

  const onConfirmQuit = () => {
    fetchData(() => HttpCompanyRoles.delete(companyId), true).then(() => {
      navigate('/');
      snackbarSuccess('Ya no formas parte de la empresa');
    });
  }
  
  const getItems = () : MenuItemDropdown[] => {
    const items : MenuItemDropdown[] = [];

    items.push({
      label: 'Cambiar nombre comercial',
      icon: <WrapperIcons Icon={IdentificationCard} size={'sm'}/>,
      onClick: () => navigate('/mi-cuenta'),
      disable: true
    });

    items.push({
      label: 'Editar Foto',
      icon: <WrapperIcons Icon={ImageIcon} size={'sm'}/>,
      onClick: handleClickEdit
    });
    
    if (hasReadPermission(SecurityComponents.CompanyHeader, CompanyHeaderSecObjects.DeletePymeButton)) {
      items.push(
          {label: 'Eliminar empresa', icon: <WrapperIcons Icon={Trash} size={'sm'} />,
            onClick: onDeletePyme, disable: !hasWritePermission(SecurityComponents.CompanyHeader, CompanyHeaderSecObjects.DeletePymeButton)
          }
      )
    }
    if (hasReadPermission(SecurityComponents.CompanyHeader, CompanyHeaderSecObjects.QuitPymeButton)) {
      items.push(
          {label: 'Desvincularme de la empresa', icon: <WrapperIcons Icon={Trash} size={'sm'} />,
            onClick: onQuitPyme, disable: !hasWritePermission(SecurityComponents.CompanyHeader, CompanyHeaderSecObjects.QuitPymeButton)
          }
      )
    }
    
    
    return items
  }
  const items = getItems();

  return (
      <React.Fragment>
        <Stack spacing={1}>
          <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{width: '100%'}}>
              <Box>
                  <CompanyLogoById companyId={companyId}
                                   onSaveLogo={onSaveLogo} 
                                   isPhysicalPerson={props.company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical}
                                   size={'lg'}
                  />
              </Box>
            <Stack width={'100%'} overflow={'hidden'}>
              <Typography variant='subtitle1' color='text.lighter'>Espacio de uso exclusivo de</Typography>
              <TypographyBase variant={'h4'} fontWeight={500} maxLines={2} tooltip pt={1}>{props.company[CompanyViewDTOFields.BusinessName]}</TypographyBase>
              <Typography variant={'caption'} color={'text.lighter'}>{stringFormatter.formatCuit(props.company[CompanyViewDTOFields.CUIT] ?? '')}</Typography>
            </Stack>
            {
              props?.headerActions && !!items.length && (
                <ButtonIconDropdown label={''}
                                    items={items}
                                    size={'small'}
                />
            )}
          </Stack>
          
          <DialogAlert open={deleteDialog}
                       severity={'error'}
                       title={'Eliminar empresa'}
                       textContent={`¿Estás seguro que deseás eliminar la empresa ${props.company[CompanyViewDTOFields.BusinessName]}?`}
                       onClose={() => setDeleteDialog(false)}
                       onConfirm={onConfirmDelete}
                       textConfirm={"Sí, eliminar"}
                       mustConfirm
          >
            Los datos se mantendrán por 3 meses
          </DialogAlert>

          <DialogAlert open={quitDialog}
                       severity={'error'}
                       title={'Desvincular PyME'}
                       textContent={`¿Estás seguro de desvincularte de esta PyME?`}
                       onClose={onCloseQuit}
                       onConfirm={onConfirmQuit}
                       textConfirm={"Sí, desvincularme"}
                       mustConfirm
          />
          
          <div className={classes.inputHidden}>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={(e: any) => onSaveLogo(e.target.files[0])}
                style={{ display: 'none' }}
            />
          </div>
        </Stack>
      </React.Fragment>
  );
}

function CompanyHeaderAction({ company }: { company: CompanyViewDTO }) {
  const { hasReadPermission } = useSecurityObject();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [quitDialog, setQuitDialog] = useState<boolean>(false);
  const { fetchData } = useAxios();
  const navigate = useNavigate();
  const { snackbarSuccess } = useAction();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onDeletePyme = () => {
    setDeleteDialog(true);
  };

  const onQuitPyme = () => {
    setQuitDialog(true);
  };

  const onCloseQuit = () => setQuitDialog(false);

  const onConfirmDelete = () => {
    fetchData(() => HttpCompany.delete(company[EntityWithIdFields.Id]), true).then(() => {
      navigate('/');
      snackbarSuccess('La empresa fue eliminada con éxito');
    });
  };

  const onConfirmQuit = () => {
    fetchData(() => HttpCompanyRoles.delete(company[EntityWithIdFields.Id]), true).then(() => {
      navigate('/');
      snackbarSuccess('Ya no formas parte de la empresa');
    });
  };

  const getMenuItems = () => {
    const items: JSX.Element[] = [];
    if (hasReadPermission(SecurityComponents.CompanyHeader, CompanyHeaderSecObjects.DeletePymeButton)) {
      const deleteLabel = company[CompanyViewDTOFields.IsUserCompany] ? 'Eliminar mi Cuenta Autónomo/Monotributista' : 'Eliminar PyME';
      items.push(
        <MenuItem key="delete" 
                  onClick={() => { handleMenuClose(); onDeletePyme(); }} 
                  sx={{ gap: 1, '&:hover': { backgroundColor: 'transparent !important' } }}
        >
            <WrapperIcons Icon={TrashIcon} size={'md'} color={'error'} />
            <TypographyBase variant={'button1'} color={'error'}>
                {deleteLabel}
            </TypographyBase>
        </MenuItem>
      );
    }
    if (hasReadPermission(SecurityComponents.CompanyHeader, CompanyHeaderSecObjects.QuitPymeButton)) {
      items.push(
        <MenuItem key="quit" 
                  onClick={() => { handleMenuClose(); onQuitPyme(); }}
                  sx={{ gap: 1, '&:hover': { backgroundColor: 'transparent !important' } }}
        >
            <WrapperIcons Icon={TrashIcon} size={'md'} color={'error'} />
            <TypographyBase variant={'button1'} color={'error'}>
                Desvincularme de la empresa
            </TypographyBase>
        </MenuItem>
      );
    }
    return items;
  };

  return (
    <>
      <IconButton size="small" 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleMenuClick} 
                  aria-controls={menuOpen ? 'company-settings-menu' : undefined} 
                  aria-haspopup="true" 
                  aria-expanded={menuOpen ? 'true' : undefined}>
        <SettingsIcon />
      </IconButton>
      
      <Menu
        id="company-settings-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'company-settings-button',
        }}
      >
        {getMenuItems()}
      </Menu>
      <DialogAlert
        open={deleteDialog}
        severity={'error'}
        maxWidth={'sm'}
        title={company[CompanyViewDTOFields.IsUserCompany] ? 'Eliminar cuenta autónomo/monotributista' : 'Eliminar empresa'}
        textContent={`¿Estás seguro de eliminar ${company[CompanyViewDTOFields.IsUserCompany] ? 'tu cuenta autónomo/monotributista' : 'empresa'}?`}
        onClose={() => setDeleteDialog(false)}
        onConfirm={onConfirmDelete}
        textConfirm={"Sí, eliminar"}
      >
        Si avanzas, toda la información, documentos y solicitudes no podrán ser recuperadas.
      </DialogAlert>
      <DialogAlert
        open={quitDialog}
        severity={'error'}
        maxWidth={'sm'}
        title={'Desvincular PyME'}
        textContent={`¿Estás seguro de desvincularte de esta PyME?`}
        onClose={onCloseQuit}
        onConfirm={onConfirmQuit}
        textConfirm={"Sí, desvincularme"}
      >
        Si avanzas, toda la información, documentos y solicitudes no podrán ser recuperadas.
      </DialogAlert>
    </>
  );
}

export { CompanyHeaderAction };

export default CompanyHeader;
