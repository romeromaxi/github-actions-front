import React, { useMemo } from 'react';
import {
  Box,
  BoxProps,
  Drawer,
  IconButton,
  Stack,
  StackProps, Theme,
  Typography, useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {grey} from "@mui/material/colors";
import {WrapperIcons} from "../icons/Icons";
import { X } from '@phosphor-icons/react';
import {TypographyBase} from "./TypographyBase";
import {SxProps} from "@mui/system/styleFunctionSx";

interface DrawerBaseProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  onCloseDrawer: () => void;
  width?: string;
  contentProps?: StackProps;
  titleProps?: BoxProps;
  children?: React.ReactNode;
  titleAction?: React.ReactNode;
  Icon?: React.ReactElement
  action?: React.ReactElement | React.ReactElement[],
  sx?: SxProps,
  aboveDialogs?: boolean
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

function DrawerBase(props: DrawerBaseProps) {
  const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  const styleDrawerContent: SxProps<Theme> = useMemo(() => {
    if (isMobileScreenSize) {
      /*Esto es para que el scroll en Y no tenga tanto ancho, sino quita mucho
      * espacio en X al child y para resoluciones pequeñas trae problemas */
      return ({      
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
          scrollbarWidth: 'none'
        },
        scrollbarWidth: 'none', // para Firefox
      });
    }
    
    return ({ overflowY: 'auto', });
  }, [isMobileScreenSize]);
  
  const handleClose = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      props.onCloseDrawer();
  }
  
  return (
    <Drawer
      anchor="right"
      open={props.show}
      onClose={handleClose}
      sx={{
        ...props.sx,
        zIndex: props.aboveDialogs ? 1350 : undefined
     }}
      PaperProps={{
        sx: {
          maxWidth: props.width ? props.width : '574px',
          width: '100%',
          padding: '24px',
        },
      }}
    >
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
      >
        <DrawerHeader style={{ alignItems: 'center' }}>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            { props.Icon && props.Icon }
            
            <Stack>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography variant="h4" fontWeight={500}>
                  {props.title ?? ''}
                </Typography>
                <Box>
                  { props.titleAction }
                </Box>
              </Stack>
              <TypographyBase color={grey[600]} fontSize={12} tooltip maxLines={3}>
                {props.subtitle ?? ''}
              </TypographyBase>
            </Stack>
          </Stack>

          <IconButton size={'medium'} onClick={handleClose}>
            <WrapperIcons Icon={X} />
          </IconButton>
        </DrawerHeader>

        
        <Box flexGrow={1}
             mt={2}
             sx={styleDrawerContent}
        >
          <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ width: '100%', '& > *': { minWidth: '100% !important', maxWidth: '100% !important' } }}
          >
            {props.children}
          </Stack>
        </Box>

        {
          props.action &&
            <Box gap={1} display={'grid'} position={'relative'} bottom={0}
                sx={{ width: '100%', '& > *': { minWidth: '100% !important' } }}
            >
              {props.action}
            </Box>
        }
        
      </Box>
    </Drawer>
  );
}

export default DrawerBase;
