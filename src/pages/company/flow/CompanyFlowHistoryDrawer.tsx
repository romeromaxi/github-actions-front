import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DrawerProps,
  Grid,
  Typography,
} from '@mui/material';
import DrawerBase from '../../../components/misc/DrawerBase';
import { HttpCompanyFlow } from '../../../http';
import {
  CompanyFlowFields,
  CompanyFlowInsert,
  CompanyFlowView,
} from '../../../types/company/companyFlowData';
import { ITableColumn, TableList } from '../../../components/table';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import { numberFormatter } from '../../../util/formatters/numberFormatter';
import CompanyFlowHistoryForm from './CompanyFlowHistoryForm';
import { CompanyFlowContext } from '../../../hooks/contexts/CompanyFlowContext';
import { useNavigate } from 'react-router-dom';
import { DeleteIconButton } from '../../../components/buttons/Buttons';
import DeleteActionButton from '../../markets/lines/components/DeleteActionButton';
import DialogTitle from '@mui/material/DialogTitle';
import { EntityWithIdFields } from '../../../types/baseEntities';

interface CompanyFlowHistoryDialogProps extends DrawerProps {
  companyId: number;
  onClose: () => void;
  open: boolean;
}

function CompanyFlowHistoryDrawer({
  companyId,
  onClose,
  open,
}: CompanyFlowHistoryDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [pressedFlow, setPressedFlow] = useState<CompanyFlowView>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { historicList, getHistoricList, errorState } =
    useContext(CompanyFlowContext);

  const handleDelete = (flow: CompanyFlowView) => {
    setOpenDelete(true);
    setPressedFlow(flow);
  };

  const onDelete = (flow: CompanyFlowView | undefined) => {
    flow &&
      HttpCompanyFlow.removeHistoricFlow(
        companyId,
        flow[EntityWithIdFields.Id],
      ).then(() => {
        getHistoricList(companyId);
        setOpenDelete(false);
      });
  };

  const deleteDialog = () => {
    return (
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'¿Desea eliminar el movimiento actual de los históricos?'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button onClick={() => onDelete(pressedFlow)} autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const columns: ITableColumn[] = [
    {
      label: 'Fecha',
      onRenderCell: (flow: CompanyFlowView) => (
        <Typography textAlign={'center'}>
          {dateFormatter.toMonthNameWithYear(
            flow[CompanyFlowFields.Date],
            true,
          )}
        </Typography>
      ),
    },
    {
      label: 'Ingreso',
      onRenderCell: (flow: CompanyFlowView) => (
        <Typography>
          {numberFormatter.toStringWithAmount(
            flow[CompanyFlowFields.Income],
            '$',
          )}
        </Typography>
      ),
    },
    {
      label: 'Egreso',
      onRenderCell: (flow: CompanyFlowView) => (
        <Typography>
          {numberFormatter.toStringWithAmount(
            flow[CompanyFlowFields.Sale],
            '$',
          )}
        </Typography>
      ),
    },
    {
      label: '',
      onRenderCell: (flow: CompanyFlowView) => (
        <DeleteActionButton onDelete={() => handleDelete(flow)} />
      ),
    },
  ];

  const postMovement = (data: CompanyFlowInsert) => {
    HttpCompanyFlow.insertNewList(companyId, data).then(() => {
      getHistoricList(companyId);
    });
  };

  const getMaxDate = useCallback(() => {
    return new Date(
      historicList
        .map((f) => f[CompanyFlowFields.Date])
        .reduce((a, b) => (a > b ? a : b), new Date()),
    );
  }, [historicList]);

  useEffect(() => {
    getHistoricList(companyId);
  }, [companyId]);

  return (
    <DrawerBase
      show={open}
      title={'Movimientos Históricos'}
      width={'600px'}
      onCloseDrawer={onClose}
    >
      {deleteDialog()}
      <Box sx={{ width: '100%' }} mt={2}>
        {showForm ? (
          <CompanyFlowHistoryForm
            onSubmitted={(data: CompanyFlowInsert) => {
              postMovement(data);
              setShowForm(false);
            }}
            onBack={() => {
              setShowForm(false);
            }}
            maxDate={getMaxDate()}
          />
        ) : (
          <TableList
            onNewRegister={() => setShowForm(true)}
            entityList={historicList}
            columns={columns}
            isLoading={loading}
            error={errorState()}
          />
        )}
      </Box>
    </DrawerBase>
  );
}

export default CompanyFlowHistoryDrawer;
