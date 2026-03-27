import React, { useState } from 'react';
import { DialogContent } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { OffererRole, OffererRolePost } from 'types/offerer/rolesData';
import RoleMultipleEditComponent from './components/RoleMultipleEditComponent';
import DrawerBase from "../../../components/misc/DrawerBase";
import {SaveButton} from "../../../components/buttons/Buttons";

interface OffererRoleDetailProps {
  role: OffererRole;
  onShowList: () => void;
  onSave?: () => void;
}

function OffererRoleDetail({
  role,
  onShowList,
  onSave,
}: OffererRoleDetailProps) {
  const [open, setOpen] = useState<boolean>(true);

  const methods = useForm<OffererRolePost>({
    defaultValues: role,
  });

  const handleClose = () => {
    setOpen(false);
    onShowList();
  };

  return (
    <DrawerBase show={open}
                onCloseDrawer={handleClose}
                title={'Edición de rol'}
                action={
                  <SaveButton
                      variant="contained"
                      type="submit"
                      form="form-offerer-edit-role"
                      fullWidth
                  >
                    Guardar
                  </SaveButton>
                }
    >
      <DialogContent>
        <FormProvider {...methods}>
          <RoleMultipleEditComponent role={role} onSave={onSave} />
        </FormProvider>
      </DialogContent>
    </DrawerBase>
  );
}
export default OffererRoleDetail;
