import React, { ReactNode, useRef } from 'react';

import { makeStyles } from '@mui/styles';
import { Link } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  inputHidden: {
    '& > div > div > .MuiInputBase-input, .MuiOutlinedInput-notchedOutline, .MuiInput-underline':
      {
        display: 'none !important',
      },
  },
}));

interface LinkFileProps {
  onChange: (file: File) => void;
  label?: string;
  accept?: string;
  className?: string;
  children?: ReactNode;
}

export const LinkFile = (props: LinkFileProps) => {
  const hiddenFileInput = useRef<any>();
  const classes = useStyles();

  const handleClick = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

  return (
    <div className={classes.inputHidden}>
      <Link
        href="#"
        underline="none"
        onClick={handleClick}
        className={props.className}
        sx={{ display: 'inline-flex' }}
      >
        {props.label ? props.label : 'Subir archivo'}

        <div style={{ marginLeft: '3px' }}>{props.children}</div>
      </Link>

      <input
        type="file"
        accept={props.accept}
        ref={hiddenFileInput}
        onChange={(e: any) => props.onChange(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
};
