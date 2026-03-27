import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { EntityWithIdAndDescription } from 'types/baseEntities';
import { HttpCacheSecurityObject } from 'http/index';
import ProfileTableList from './components/ProfileTableList';
import ProfileAdminPermissions from './components/ProfileAdminPermissions';

function ProfileSettingsPage() {
  const [profiles, setProfiles] = useState<EntityWithIdAndDescription[]>();
  const [editProfile, setEditProfile] = useState<EntityWithIdAndDescription>();

  const searchProfiles = () => {
    setProfiles(undefined);
    HttpCacheSecurityObject.getProfiles().then(setProfiles);
  };

  const closeEditProfile = () => setEditProfile(undefined);

  useEffect(() => {
    searchProfiles();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <ProfileTableList profiles={profiles} onClickProfile={setEditProfile} />
      </Grid>

      <Grid item xs={8}>
        {editProfile && (
          <ProfileAdminPermissions
            profile={editProfile}
            onBackPage={closeEditProfile}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default ProfileSettingsPage;
