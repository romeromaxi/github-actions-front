import { Button, IconButton } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SearchOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import PanToolIcon from '@mui/icons-material/PanTool';
import CheckIcon from '@mui/icons-material/Check';

export interface ITableButtonProps {
  onClick: () => void;
  text?: string;
  min?: boolean;
}

function TableButtonEdit(props: ITableButtonProps) {
  if (props.min) {
    return (
      <IconButton onClick={props.onClick} color="primary" size="small">
        <EditIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      style={{ marginRight: '4px' }}
      startIcon={<EditIcon />}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text || 'Editar'}
    </Button>
  );
}

function TableButtonDownload(props: ITableButtonProps) {
  if (props.min) {
    return (
      <IconButton onClick={props.onClick} color="primary" size="small">
        <EditIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      style={{ marginRight: '4px' }}
      startIcon={<GetAppRoundedIcon />}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text || 'Descargar'}
    </Button>
  );
}

function TableButtonSelect(props: ITableButtonProps) {
  if (props.min) {
    return (
      <IconButton onClick={props.onClick} color="primary" size="small">
        <CheckIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      style={{ marginRight: '4px' }}
      startIcon={<PanToolIcon />}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text || 'Seleccionar'}
    </Button>
  );
}

function TableButtonDelete(props: ITableButtonProps) {
  if (props.min) {
    return (
      <IconButton onClick={props.onClick} color="secondary" size="small">
        <DeleteIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="contained"
      color="error"
      size="small"
      className="MuiButton-containedDanger"
      style={{ marginRight: '4px' }}
      startIcon={<DeleteIcon />}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text || 'Eliminar'}
    </Button>
  );
}

function TableButtonSeeRow(props: ITableButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      style={{ marginRight: '4px' }}
      startIcon={<VisibilityIcon />}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text || 'Ver'}
    </Button>
  );
}

function TableButtonNew(props: ITableButtonProps) {
  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      style={{ marginRight: '4px' }}
      startIcon={<AddIcon />}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text || 'Nuevo'}
    </Button>
  );
}

function TableButtonInspect(props: ITableButtonProps) {
  return (
    <IconButton
      aria-label="inspect"
      color="primary"
      size="small"
      onClick={() => {
        props.onClick();
      }}
      style={{ marginRight: '4px', backgroundColor: '#bbdefb' }}
    >
      <SearchOutlined color="primary" />
    </IconButton>
  );
}

export {
  TableButtonEdit,
  TableButtonDownload,
  TableButtonDelete,
  TableButtonSeeRow,
  TableButtonInspect,
  TableButtonNew,
  TableButtonSelect,
};
