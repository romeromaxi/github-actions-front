import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack, Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import UserPersonalModifyData from './components/UserPersonalModifyData';

import { UserModelView, UserModelViewFields } from 'types/user';
import { HttpUser } from 'http/user/httpUser';
import UserPersonalDataCardSummary from './components/UserPersonalDataCardSummary';
import { useAction } from '../../../hooks/useAction';
import VerifiedIcon from '@mui/icons-material/Verified';
import { ValidationStatesType } from '../../../types/person/personEnums';
import UserPersonValidateCard from './components/UserPersonValidateCard';
import { userStorage } from '../../../util/localStorage/userStorage';
import { Module } from '../../../types/form/login/login-enum';
import {BaseResponseFields} from "../../../types/baseEntities";
import useAxios from "../../../hooks/useAxios";
import CompanyLabelWithValueComponent from "../../companyFile/company/components/CompanyLabelWithValueComponent";

export const UserProfilePageContext = React.createContext({
  user: {} as UserModelView | undefined,
  setReload: (value: boolean) => {},
});

function UserProfilePage() {
  const [user, setUser] = useState<UserModelView>();
  const [lastName, firstName] = user?.[UserModelViewFields.UserName].split(
    ',',
  ) || [null, null];
  const [reload, setReload] = useState<boolean>(true);
  const { setTitle, snackbarSuccess } = useAction();
  const { fetchData } = useAxios()
  const [allowNotifications, setAllowNotifications] = useState<boolean>(false)

  setTitle(
    user ? `${user[UserModelViewFields.UserName]} - Mi Perfil` : 'Mi Perfil',
  );

  const searchDataUser = () => {
    setUser(undefined);

    HttpUser.getUserDataLogged().then((responseUser) => {
      setUser(responseUser);
      setReload(false);
      setAllowNotifications(responseUser[UserModelViewFields.AllowMailNotifications])
    });
  };

  useEffect(() => {
    if (reload) searchDataUser();
  }, [reload]);

  const onSubmitAllowNotifications = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchData(
        () => HttpUser.insertNotifications(!allowNotifications),
        true
    ).then((r) => {
      if (!r[BaseResponseFields.HasError]){
        if (!allowNotifications) {
          snackbarSuccess('A partir de ahora vas a recibir notificaciones vía mail')
        } else {
          snackbarSuccess('A partir de ahora vas a dejar de recibir notificaciones vía mail')
        }
      }
    })
    setAllowNotifications(!allowNotifications)
  }
  
  const isUserCompany = userStorage.getUserType() === Module.Company
  const isUserOfferer = userStorage.getUserType() === Module.Offerer

  return (
    <Grid container spacing={2}>
      {user ? (
        <React.Fragment>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems={'center'} spacing={4}>
                  <Avatar
                    sx={{
                      fontSize: '3.5rem !important',
                      width: 100,
                      height: 100,
                      color: 'primary.contrastText',
                      backgroundColor: 'primary.main',
                    }}
                  >
                    {`${firstName?.trim()[0]}${lastName?.trim()[0]}`}
                  </Avatar>
                  <Stack spacing={2} sx={{ width: '90% !important' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        fontSize={18}
                        fontWeight={600}
                        pt={0.1}
                      >{`${firstName} ${lastName}`}</Typography>
                      {user?.[
                        UserModelViewFields.ValidationIdentityStatusCode
                      ] === ValidationStatesType.Validated &&
                          isUserCompany && (
                          <Tooltip title={'Usuario validado'}>
                            <VerifiedIcon fontSize="small" color="primary" />
                          </Tooltip>
                        )}
                      {user?.[
                        UserModelViewFields.ValidationIdentityStatusCode
                      ] === ValidationStatesType.PendingValidation &&
                          isUserCompany && (
                          <Tooltip title={'Usuario pendiente de validación'}>
                            <></>
                            {/*<SafetyCheckRoundedIcon fontSize='small' color='warning' />*/}
                          </Tooltip>
                        )}
                    </Stack>
                    <UserPersonalDataCardSummary
                      cuit={user[UserModelViewFields.CUIT]}
                      mail={user[UserModelViewFields.Mail]}
                    />
                    <UserProfilePageContext.Provider
                      value={{ user, setReload }}
                    >
                      <UserPersonalModifyData />
                    </UserProfilePageContext.Provider>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            {
              !isUserOfferer &&
              <CompanyLabelWithValueComponent label={'Recibir notificaciones por mail'} value={
                <Switch checked={allowNotifications}
                        onChange={onSubmitAllowNotifications}
                        size={'small'}
                />
              }
              />
            }
          </Grid>
          {isUserCompany && (
            <Grid item xs={12}>
              <UserPersonValidateCard user={user} onSubmit={searchDataUser} />
            </Grid>
          )}
        </React.Fragment>
      ) : (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems={'center'} spacing={4}>
                  <Skeleton variant="circular" width={100} height={100} />
                  <Stack spacing={2} sx={{ width: '90% !important' }}>
                    <Skeleton sx={{ width: '20% !important' }} />
                    <Skeleton width={'100% !important'} />
                    <Skeleton width={'100% !important'} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          {isUserCompany && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Skeleton sx={{ width: '100%' }} height="30px" />
                </CardContent>
              </Card>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
}

export default UserProfilePage;
