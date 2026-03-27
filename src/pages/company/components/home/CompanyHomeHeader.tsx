import React, {useEffect, useState} from 'react';
import { Box, Grid, Link, Stack, Typography } from '@mui/material';
import { userStorage } from 'util/localStorage/userStorage';
import { HttpUser } from 'http/index';
import { UserModelViewFields } from 'types/user';
import { ValidationStatesType } from 'types/person/personEnums';
import VerifiedIcon from '@mui/icons-material/Verified';
import ValidateUserIdentityDialog from "../../../user/components/ValidateUserIdentityDialog";

// @ts-ignore
//const listMenu = ListMenuTypeByLayoutType[MenuLayoutType.Home](0).filter(x => x.code !== MenuCode.Home);

interface CompanyHomeHeaderProps {
  hasCompanies: boolean,
  onReload: () => void
}

function CompanyHomeHeader({ hasCompanies, onReload }: CompanyHomeHeaderProps) {
  const name = userStorage.getFullName();
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);
  const [newStatusCode, setStatusCode] = useState<number>();

  //const classes = LayoutHomeStyles();
  const formattedName = (name: string) =>
    name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

  const getFormattedName = () => {
    // @ts-ignore
    const [surname, newName] = name?.toLowerCase().split(', ');

    const surnameFormatted = formattedName(surname);
    const nameFormatted = formattedName(newName);

    return `${nameFormatted} ${surnameFormatted}`;
  };

  useEffect(() => {
    if (!canValidate) {
      if (!userStorage.hasValidatedIdentity()) {
        HttpUser.getValidateIdentity().then((r) => {
          const statusCode =
            r[UserModelViewFields.ValidationIdentityStatusCode];
          userStorage.setValidatedIdentityCode(statusCode);
          setStatusCode(statusCode);
        });
      } else setStatusCode(ValidationStatesType.Validated);
    }
  }, [canValidate]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      const validateIdentityCode = userStorage.getValidatedIdentityCode();
        if (validateIdentityCode && validateIdentityCode != newStatusCode)
          setStatusCode(validateIdentityCode);
    };

    const unsubscribe = userStorage.subscribe(handleStorageUpdate);
    return () => unsubscribe();
  }, []);
  
  const handleValidate = () => setOpenValidate(true);

  if (!hasCompanies)
    return (
      <Grid container>
        <Grid item xs={12}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={1}
            flexWrap={'wrap'}
          >
            <Typography
              fontSize={19}
              variant="body2"
              component="div"
              style={{ wordWrap: 'break-word' }}
            >
              Bienvenido/a{' '}
              <Box
                component="span"
                fontWeight={600}
                lineHeight={1.2}
                fontSize={'1.5rem'}
                sx={{ color: 'primary.light' }}
              >
                {getFormattedName()}
              </Box>
              {(() => {
                switch (newStatusCode) {
                  case ValidationStatesType.PendingValidation:
                    return (
                      <React.Fragment>
                        , ya eres un usuario registrado, estamos verificando tu
                        identidad para garantizar la seguridad de tu cuenta
                      </React.Fragment>
                    );
                  case ValidationStatesType.Validated:
                    return (
                      <React.Fragment>
                        {' '}
                        <VerifiedIcon color="primary" fontSize={'small'} />, ya
                        eres un usuario con identidad verificada.
                      </React.Fragment>
                    );
                  case ValidationStatesType.LoadProcess:
                  case ValidationStatesType.Returned:
                    return (
                      <React.Fragment>
                        , ya eres un usuario registrado.
                      </React.Fragment>
                    );
                  default:
                    return <React.Fragment> </React.Fragment>;
                }
              })()}
            </Typography>
          </Stack>
        </Grid>
        {/*<Grid item xs={12}>
                    <Typography fontSize={18}>
                        Para solicitar precalificaciones en el Market y aprovechar las soluciones que LUC tiene para tus empresas, el primer paso es agregar la/las MiPyMEs
                    </Typography>
                </Grid>*/}
        {
          /*
          <ValidateUserDialog
            open={openValidate}
            onClose={() => setOpenValidate(false)}
            onSubmit={() => {
              setCanValidate(false);
              setStatusCode(ValidationStatesType.PendingValidation);
            }}
          />
           */
        }
        <ValidateUserIdentityDialog open={openValidate}
                                    onClose={() => setOpenValidate(false)}
                                    onReload={onReload}
        />
      </Grid>
    );

  return (
    <></>
    /*        <Grid container>
            <Grid item xs={12}>
                <Typography fontSize={18}>
                    Ya podés solicitar precalificaciones para tus empresas y utilizar las soluciones LUC desde la barra lateral.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Typography fontSize={18}>
                        Recordá que también podes agregar otras MiPyMEs.
                    </Typography>
                    {
                        <div style={{display: 'flex', gap: 6}}>
                            {
                                listMenu.map((item: ItemMenuType) => (
                                    <ListItem sx={{p: 0}}>
                                        <Tooltip title={item.label} arrow placement="bottom">
                                            <ListItemButton className={classes.listMenuItemSmall}>
                                                {item.icon}
                                            </ListItemButton>
                                        </Tooltip>
                                    </ListItem>
                                ))
                            }
                        </div>
                    }
                </Stack>
            </Grid>
        </Grid>*/
  );
}

export default CompanyHomeHeader;
