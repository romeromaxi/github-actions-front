import React, {useRef, useState} from 'react';
import {Box} from '@mui/material';

import ButtonsStyles from './Buttons.styles';
import {BaseIconWrapper} from "../icons/Icons";
import DrawerCropperImage from "../drawers/DrawerCropperImage";
import {PencilIcon} from "lucide-react";

interface LinkFileProps {
    onChange: (file: File) => void;
    accept?: string;
    className?: string;
    children?: React.ReactNode;
    inBadge?: boolean;
    shape?: 'rect' | 'round',
    cropSize: { width: number, height: number };
    borderRadius?: number
}

export const ButtonIconFile = (props: LinkFileProps) => {
  const hiddenFileInput = useRef<any>();
  const classes = ButtonsStyles();
  const [imageToCropper, setImageToCropper] = useState<File>();

  const handleClick = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };
  
  const handleSaveImage = (file: File) => {
      props.onChange(file);
      setImageToCropper(undefined);
  }

  if (props.inBadge) {
      return (
          <React.Fragment>
              <div className={classes.inputHidden}>
                  <Box onClick={handleClick} sx={{cursor: 'pointer'}}>
                      <BaseIconWrapper Icon={PencilIcon} size={'xs'} width={'10px'} height={'10px'} />
                  </Box>
    
                  <input
                      type="file"
                      accept={props.accept}
                      ref={hiddenFileInput}
                      onChange={(e: any) => setImageToCropper(e.target.files[0])}
                      style={{ display: 'none' }}
                  />
              </div>
              
              <DrawerCropperImage image={imageToCropper} 
                                  shape={props.shape}
                                  onClose={() => setImageToCropper(undefined)} 
                                  onSaveImage={handleSaveImage}
                                  cropSize={props.cropSize}
                                  sx={{ borderRadius: `${props.borderRadius || 8}px !important` }}
              />
          </React.Fragment>
      )
  }
  
  return (
    <div className={classes.inputHidden}>
      <Box onClick={handleClick} sx={{cursor: 'pointer', position: 'absolute',
          bottom: '5%',
          left: '20%',}}>
          <BaseIconWrapper Icon={PencilIcon} bg={'white'} sx={{borderRadius: '100px'}} size={'sm'} width={'24px'} height={'24px'}/>
      </Box>

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
