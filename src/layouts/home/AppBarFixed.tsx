import React, { useContext } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { greyColor900 } from 'util/themes/ThemeItapTec';
import { LayoutHomeContext } from './LayoutHome';
import { KeyboardBackspace, MenuTwoTone } from '@mui/icons-material';
import MenuDrawerResponsive from './components/MenuDrawerResponsive';
import LayoutHomeStyles from './LayoutHome.styles';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';
import { MenuLayoutType } from '../../types/menu/menuLink';
import UserAvatarWithMenu from './components/UserAvatarWithMenu';
import AvatarTitleAppBar from './components/AvatarTitleAppBar';
import { SubTitleAppBar, TitleAppBar } from '../../components/text';
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";

interface AppBarFixedProps {
  layoutType: MenuLayoutType;
}

function AppBarFixed({ layoutType }: AppBarFixedProps) {
  const { title, actions, subtitle } = useTypedSelector((state) => state.title);
  const classes = LayoutHomeStyles();

  const { setSideBarOpen, mediumWindow } = useContext(LayoutHomeContext);
  const navigate = useNavigate();

  const onClickBack = () => navigate(-1);

  const renderTitle = () => (
    <Stack direction={'row'} spacing={1.2}>
      <AvatarTitleAppBar />
      <Stack>
        {/*icon && icon
                            <Box sx={{
                                objectFit: 'contain',
                                width: 80,
                                height: 40
                            }}
                                 component="img"
                                 alt="Logo Banco"
                                 src={bankLogo}/>
                            */}

        {!title || typeof title === 'string' ? (
          <TitleAppBar>{title}</TitleAppBar>
        ) : (
          title
        )}

        <SubTitleAppBar>{subtitle}</SubTitleAppBar>
      </Stack>
    </Stack>
  );

  const renderBackButton = () => (
    <Button
      variant={'contained'}
      color={'inherit'}
      onClick={onClickBack}
      startIcon={<KeyboardBackspace />}
    >
      Volver
    </Button>
  );

  if (mediumWindow) {
    return (
      <Grid
        container
        item
        xs={12}
        mt={{ sm: '-1.5rem', lg: '10px' }}
        mb={{ sm: '20px', lg: '35px' }}
      >
        <Stack direction="column">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width={'100%'}
            mb={'1rem'}
          >
            <IconButton onClick={() => setSideBarOpen(true)}>
              <MenuTwoTone className={classes.iconMenu} />
            </IconButton>

            <Box
              component="img"
              sx={{
                height: 30,
                width: 60,
              }}
              alt={'LOGO'}
              src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
            />

            <MenuDrawerResponsive layoutType={layoutType} />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width={'100%'}
          mt={'-15px'}
        >
          {renderTitle()}
          <Stack direction="row" alignItems="center" spacing={1}>
            {actions && actions}

            <UserAvatarWithMenu />
          </Stack>
        </Stack>
      </Grid>
    );
  }

  return (
    <Grid
      container
      mt={{ sm: '-1.5rem', lg: '-20px' }}
      mb={{ sm: '20px', lg: '35px' }}
    >
      <Grid item xs={12}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width={'100%'}
        >
          {renderTitle()}
          <Stack direction="row" alignItems="center" spacing={1}>
            {actions && actions}

            <UserAvatarWithMenu />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default AppBarFixed;
