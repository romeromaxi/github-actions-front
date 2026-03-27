import {Box, List, ListItem, ListItemText, Popover, Stack, Typography} from '@mui/material';
import {TotalBoxComponentNew} from '../../../../components/misc/TotalBoxComponent';
import HelpIcon from '@mui/icons-material/Help';
import React, {useState} from 'react';
import {
  OffererSummaryTotalsView,
  OffererSummaryTotalsViewFields,
} from '../../../../types/offerer/offererData';
import {OffererWorkTeamView} from "../../../../types/offerer/offererSolicitationData";
import {OffererRole} from "../../../../types/offerer/rolesData";

interface OffererSummaryHeaderProps {
    totals?: OffererSummaryTotalsView;
    workTeams?: OffererWorkTeamView[];
    roles?: OffererRole[];
}

const OffererSummaryHeader = ({ totals, roles, workTeams}: OffererSummaryHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'custom-tooltip' : undefined;
  
  return (
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-evenly'} spacing={1}>
          <TotalBoxComponentNew
              label={'Usuarios Activos'}
              total={roles && roles.length}
          />
          
        <TotalBoxComponentNew
          label={'Usuarios sin equipo de trabajo'}
          total={
            totals?.[OffererSummaryTotalsViewFields.UsersWithoutGroupQuantity]
          }
          loading={!totals}
        />
        <TotalBoxComponentNew
          label={'Usuarios sin rol'}
          total={
            totals?.[OffererSummaryTotalsViewFields.UsersWithoutRoleQuantity]
          }
          loading={!totals}
        />

          <TotalBoxComponentNew
              label={'Equipos creados'}
              total={workTeams && workTeams.length}
          />
          
        <Stack>
          <Typography fontSize={16} fontWeight={600}>
            Roles
          </Typography>
          <div style={{ textAlign: 'center' }} onMouseEnter={handleOpen}>
            <HelpIcon color={'primary'} />
          </div>
        </Stack>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box p={2} width={450}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Administrador"
                  secondary="Opera integralmente en toda la plataforma (ABM de líneas, usuarios y solicitudes, reportes, tienda e integraciones)."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Operador Comercial"
                  secondary="Elabora las propuestas de admisión de las solicitudes e intercambia mensajes y documentación con la PyME."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Operador Aprobador"
                  secondary="Aprueba las propuestas de admisión y de precalificación."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Operador Evaluador"
                  secondary="Elabora las propuestas de precalificación."
                />
              </ListItem>
            </List>
          </Box>
        </Popover>
      </Stack>
  );
};

export default OffererSummaryHeader;
