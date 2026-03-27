import React, { useRef } from 'react';

import { Control, Controller } from 'react-hook-form';
import { makeStyles } from '@mui/styles';
import { Button, Icon, TextField } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  inputHidden: {
    '& > div > div > .MuiInputBase-input, .MuiOutlinedInput-notchedOutline, .MuiInput-underline':
      {
        display: 'none !important',
      },
  },
}));

interface ControlledFileFieldButtonProps {
  name?: string;
  control: Control<any>;
}

export const ControlledFileFieldButton = (
  props: ControlledFileFieldButtonProps,
) => {
  const hiddenFileInput = useRef<any>();
  const classes = useStyles();

  const handleClick = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

  return (
    <Controller
      control={props.control}
      name={props.name || ''}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div className={classes.inputHidden}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<Icon className="fas fa-file-upload" fontSize="small" />}
            onClick={handleClick}
          >
            Subir Archivo
          </Button>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={(e: any) => onChange(e.target.files[0])}
            style={{ display: 'none' }}
          />
          <TextField
            {...props}
            variant="standard"
            size="small"
            onChange={(e: any) => onChange(e.target.files[0] as File)}
            error={!!error}
            helperText={error ? error.message : null}
          />
        </div>
      )}
    />
  );
};
