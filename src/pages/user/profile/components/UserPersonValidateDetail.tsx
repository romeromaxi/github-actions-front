import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { UserModelView, UserModelViewFields } from 'types/user';
import { Document } from '../../../../types/files/filesData';
import FileDocumentDetail, {
  FileDocumentDetailLoading,
} from '../../../../components/files/FileDocumentDetail';
import { HttpUser } from '../../../../http';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { ValidationStatesType } from '../../../../types/person/personEnums';

interface UserPersonValidateDetailProps {
  user: UserModelView;
}

function UserPersonValidateDetail({ user }: UserPersonValidateDetailProps) {
  const [documents, setDocuments] = useState<Document[]>();
  const hasObservations =
    !!user[UserModelViewFields.ValidationIdentityObservations];
  const finalObservations =
    user[UserModelViewFields.ValidationIdentityStatusCode] ===
    ValidationStatesType.PendingValidation
      ? 'En análisis'
      : user[UserModelViewFields.ValidationIdentityObservations] ||
        'Sin observaciones';

  const getDocumentsByUserId = (userId: number) => {
    HttpUser.getIdentityValidationDocuments(userId)
      .then(setDocuments)
      .catch(() => setDocuments([]));
  };

  useEffect(() => {
    getDocumentsByUserId(user[EntityWithIdFields.Id]);
  }, [user]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Stack spacing={2}>
          <Typography fontStyle={hasObservations ? '' : 'italic'}>
            {finalObservations}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={2}>
          {documents
            ? documents.map((d) => (
                <FileDocumentDetail document={d} download preview />
              ))
            : Array.from({ length: 2 }).map(() => (
                <FileDocumentDetailLoading
                  key={Math.random().toString(36).substring(7)}
                />
              ))}
        </Stack>
      </Grid>
    </Grid>
  );
}

export default UserPersonValidateDetail;
