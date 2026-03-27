import { useCallback } from 'react';
import {
  Control,
  Controller,
  FieldError,
  UseFormSetValue,
} from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DropzoneFieldStyles from './DropzoneField.styles';

interface DropZoneFieldProps {
  name: string;
  multiple: boolean;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}

interface DropzoneProps {
  onChange: (...event: any[]) => void;
  multiple: boolean;
  name: string;
  setValue: UseFormSetValue<any>;
  error?: FieldError;
}

export const DropzoneField = ({
  name,
  control,
  ...rest
}: DropZoneFieldProps) => {
  return (
    <Controller
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Box>
          <Dropzone
            onChange={(e) =>
              onChange(rest.multiple ? e.target.files : e.target.files[0])
            }
            name={name}
            error={error}
            {...rest}
          />
          {error && (
            <Typography variant="caption" color="error">
              {error?.message}
            </Typography>
          )}
        </Box>
      )}
      name={name}
      control={control}
      defaultValue=""
    />
  );
};


interface DropzoneFieldCustomWrapperProps extends DropZoneFieldProps{
    children?: React.ReactNode
}

export const DropzoneFieldCustomWrapper = ({
                                  name,
                                  control,
                                  ...rest
                              }: DropzoneFieldCustomWrapperProps) => {

    const onDrop = useCallback((acceptedFiles) => {
        rest.setValue(name, acceptedFiles);
    }, []);
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        ...rest,
    });
    
    return (
        <Box {...getRootProps()}>
            <input {...getInputProps({ onDrop })} />
            { rest.children }
        </Box>
    );
};

const Dropzone = ({
  onChange,
  setValue,
  name,
  error,
  ...rest
}: DropzoneProps) => {
  const classes = DropzoneFieldStyles();

  const onDrop = useCallback((acceptedFiles) => {
    setValue(name, acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...rest,
  });
  return (
    <Box
      {...getRootProps()}
      className={`${classes.dropzoneBox} ${isDragActive ? classes.borderDrag2 : classes.border} ${error && classes.borderError}`}
    >
      <input {...getInputProps({ onChange })} />
      {isDragActive ? (
        <p>Arrastrar aquí...</p>
      ) : (
        <p>Arrastrar aquí o hacer click para seleccionar el archivo</p>
      )}
    </Box>
  );
};
