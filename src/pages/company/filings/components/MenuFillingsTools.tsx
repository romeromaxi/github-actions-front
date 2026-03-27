import React, { useState } from 'react';
import { Grid, Stack, Tooltip, Typography } from '@mui/material';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CardActionButton from 'components/cards/CardActionButton';
import DialogAlertBuildingLUC from '../../../../components/dialog/DialogAlertBuildingLUC';

interface MenuFillingsToolsProps {
  onTemplate: () => void;
}

const MenuFillingsTools = ({ onTemplate }: MenuFillingsToolsProps) => {
  const [openPendant, setOpenPendant] = useState<boolean>(false);

  return (
    <Stack spacing={0.2}>
      <Typography variant="h3" fontWeight={600}>
        Herramientas de Presentación
      </Typography>

      <Grid container spacing={2}>
        {/*
                    
                    <Grid item md={4} xs={12}>
                        <CardActionButton title={'Mirá los modelos de presentaciones que LUC tiene para vos'}
                                          onClick={onContinue}
                                          icon={<FolderSpecialIcon sx={{fontSize: '52px'}}/>}
                        />
                    </Grid>
                     */}
        <Grid item md={4} xs={12} pl={2}>
          <CardActionButton
            title={'Subí las plantillas de tu Empresa'}
            onClick={onTemplate}
            icon={<CreateNewFolderIcon sx={{ fontSize: '52px' }} />}
          />
        </Grid>
        <Grid item md={4} xs={12} pl={2}>
          <CardActionButton
            title={'Creá una presentación con información de LUC'}
            onClick={() => {
              setOpenPendant(true);
            }}
            icon={<FolderSharedIcon sx={{ fontSize: '52px' }} />}
          />
        </Grid>
      </Grid>
      <DialogAlertBuildingLUC
        open={openPendant}
        onClose={() => setOpenPendant(false)}
      />
    </Stack>
  );
};

export default MenuFillingsTools;
