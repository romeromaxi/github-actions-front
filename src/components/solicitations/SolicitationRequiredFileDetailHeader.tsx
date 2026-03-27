import { Button, Divider, Grid, Link, Typography } from '@mui/material';
import React, { useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SolicitationRequiredFileCancelledDialog from './SolicitationRequiredFileCancelledDialog';

interface SolicitationRequiredFileDetailHeaderProps {
  offerer: boolean;
  solicitationId: number;
}

const SolicitationRequiredFileDetailHeader = ({
  offerer,
  solicitationId,
}: SolicitationRequiredFileDetailHeaderProps) => {
  const [openCancelledFiles, setOpenCancelledFiles] = useState<boolean>(false);

  return (
    <>
      <Grid item md={3}>
        <Link
          component={Button}
          onClick={() => setOpenCancelledFiles(true)}
          size={'small'}
        >
          <SearchRoundedIcon fontSize={'small'} />
          Ver pedidos cancelados
        </Link>
      </Grid>
      <Grid item md={9}></Grid>
      <Grid
        item
        md={offerer ? 6.8 : 5.9}
        xs={12}
        container
        sx={{
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          backgroundColor: 'rgb(201 255 242) !important',
          marginTop: 1,
          padding: 2,
        }}
      >
        <Grid item xs={12} pb={1}>
          <Typography fontWeight={600} fontSize={16}>
            Documentación Pedida
          </Typography>
        </Grid>
        <Grid item md={2}>
          <SolicitationRequiredFileDetailHeaderText
            label={'Fecha pedido'}
            leftAlign
          />
        </Grid>
        <Grid item md={4}>
          <SolicitationRequiredFileDetailHeaderText label={'Pedido'} />
        </Grid>
        <Grid item md={3}>
          <SolicitationRequiredFileDetailHeaderText label={'Observación'} />
        </Grid>
        <Grid item md={1.5}>
          <SolicitationRequiredFileDetailHeaderText label={'Formulario'} />
        </Grid>
        <Grid item md={1.5}>
          <SolicitationRequiredFileDetailHeaderText label={'Detalle'} />
        </Grid>
      </Grid>
      <Grid item md={0.2}>
        <Divider orientation={'vertical'} sx={{ height: '100%' }} />
      </Grid>
      <Grid
        item
        md={offerer ? 5 : 5.9}
        xs={12}
        container
        sx={{
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          backgroundColor: '#DBF4FF !important',
          marginTop: 1,
          padding: 2,
        }}
      >
        <Grid item xs={12} pb={1}>
          <Typography fontWeight={600} fontSize={16}>
            Documentación presentada por la PyME
          </Typography>
        </Grid>
        <Grid item md={2.25}>
          <SolicitationRequiredFileDetailHeaderText
            label={'Fecha entrega'}
            leftAlign
          />
        </Grid>
        <Grid item md={1.75}>
          <SolicitationRequiredFileDetailHeaderText label={'Cantidad'} />
        </Grid>
        <Grid item md={1.75}>
          <SolicitationRequiredFileDetailHeaderText label={'Documentos'} />
        </Grid>
        <Grid item md={2.5}>
          <SolicitationRequiredFileDetailHeaderText label={'Acciones'} />
        </Grid>
        <Grid item md={3.75}></Grid>
      </Grid>
      <SolicitationRequiredFileCancelledDialog
        open={openCancelledFiles}
        onClose={() => setOpenCancelledFiles(false)}
        solicitationId={solicitationId}
      />
    </>
  );
};

interface SolicitationRequiredFileDetailHeaderTextProps {
  label: string;
  leftAlign?: boolean;
}

function SolicitationRequiredFileDetailHeaderText({
  label,
  leftAlign,
}: SolicitationRequiredFileDetailHeaderTextProps) {
  return (
    <Typography
      fontWeight={500}
      textAlign={leftAlign ? 'left' : 'center'}
      fontStyle={'italic'}
      color={'grey.700'}
    >
      {label}
    </Typography>
  );
}

export default SolicitationRequiredFileDetailHeader;
