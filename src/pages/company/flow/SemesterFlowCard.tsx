import {
  Box, Stack, Table, TableBody, TableCell, TableHead, TableRow,
  Typography,
} from '@mui/material';
import {
  CloseButton,
  DeleteButton,
  EditButton,
  SaveButton,
} from 'components/buttons/Buttons';
import { ControlledTextFieldFilled } from 'components/forms';
import { useForm } from 'react-hook-form';
import React, {useContext, useState} from 'react';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {TypographyBase} from "components/misc/TypographyBase";
import {FlowUseContext} from "../../../hooks/contexts/FlowUseContext";
import {
  FlowFields, FlowInsert,
  FlowInsertRequest, FlowInsertRequestFields,
  FlowSemesterDataFields, FlowSemesterDelete, FlowSemesterView,
  FlowSemesterViewFields
} from "../../../types/general/generalFinanceData";
import {DialogAlert} from "../../../components/dialog";

interface SemesterFlowCardProps {
  semester: FlowSemesterView;
  triggerEditing: (semester?: FlowSemesterView) => void;
  editing: boolean;
  onSubmitEdit: (data: FlowInsertRequest) => void;
}

const SemesterFlowCard = ({
  semester,
  triggerEditing,
  editing,
  onSubmitEdit
}: SemesterFlowCardProps) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const { handleDelete } = useContext(FlowUseContext)

  const handleEdit = () => triggerEditing(semester);

  const onCloseEdit = () => triggerEditing(undefined);

  const { control, handleSubmit } = useForm<FlowInsertRequest>({
    defaultValues: {
      [FlowInsertRequestFields.FlowList]: semester[
        FlowSemesterViewFields.Flows
      ] as FlowInsert[],
    },
  });

  const onSubmitForm = (data: FlowInsertRequest) => {
    onSubmitEdit(data);
    onCloseEdit();
  };

  const handleFocus = (e: any) => e.target.select();

  const onDeleteSemester = () => setOpenDelete(true);

  const onConfirmDelete = () => {
    const deleteBody: FlowSemesterDelete = {
      [FlowSemesterViewFields.SemesterYear]:
          semester[FlowSemesterViewFields.SemesterYear],
      [FlowSemesterViewFields.SemesterNumber]:
          semester[FlowSemesterViewFields.SemesterNumber],
    };

    handleDelete(deleteBody)
  };
  
  return (
      <React.Fragment>
        <Box sx={{border: '1px solid #EDF2F7', borderRadius: '24px', overflow: 'hidden'}}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Stack spacing={2}>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                pt={'12px'} px={'16px'}
              >
                <TypographyBase variant={'label'} fontWeight={500}>
                  {`Semestre ${semester[FlowSemesterViewFields.SemesterNumber]}`}
                </TypographyBase>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  {editing ? (
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                      {semester[FlowSemesterViewFields.AllowDelete] && (
                        <DeleteButton onClick={onDeleteSemester} size={'small'} id={"entity-flows-delete-btn"}>
                          Eliminar
                        </DeleteButton>
                      )}
                      <CloseButton onClick={onCloseEdit} variant={'text'} size={'small'} id={"entity-flows-close-btn"}>
                        Cancelar
                      </CloseButton>
                      <SaveButton type={'submit'} size={'small'} id={"entity-flows-save-btn"}>
                        Guardar
                      </SaveButton>
                    </Stack>
                  ) : (
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                      {semester[FlowSemesterViewFields.AllowDelete] && (
                        <DeleteButton onClick={onDeleteSemester} size={'small'} id={"entity-flows-delete-btn"}>
                          Eliminar
                        </DeleteButton>
                      )}
                      {
                        semester[FlowSemesterViewFields.Flows].some((f) => f[FlowSemesterDataFields.AllowEdit]) &&
                        <EditButton onClick={handleEdit} size={'small'} id={"entity-flows-edit-btn"}>
                          Editar
                        </EditButton>
                      }
                    </Stack>
                  )}
                </Stack>
              </Stack>
                <Table variant={'basic-style'}>
                  <TableHead>
                    <TableRow>
                      <TableCell><div></div></TableCell>
                      {semester[FlowSemesterViewFields.Flows].map((f) => (
                          <TableCell width={130}>{f[FlowSemesterDataFields.Month]}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Compras</TableCell>
                      {semester[FlowSemesterViewFields.Flows].map((f, idx) =>
                          <TableCell sx={{ textAlign: 'right !important' }}>
                            {
                              editing ?
                                  <ControlledTextFieldFilled
                                      control={control}
                                      currency
                                      label={''}
                                      name={`${FlowInsertRequestFields.FlowList}.${idx}.${FlowFields.Income}`}
                                      size={'small'}
                                      onFocus={handleFocus}
                                      textAlign={'right'}
                                      fullWidth
                                      disabled={
                                        !f[FlowSemesterDataFields.AllowEdit]
                                      }
                                      defaultValue={f[FlowFields.Income]}
                                  />
                                  :
                                  <Typography fontWeight={600} fontSize={'.85rem'}>
                                    {numberFormatter.toStringWithAmount(
                                        f[FlowFields.Income] || 0,
                                        '$',
                                        0,
                                    )}
                                  </Typography>
                            }
                          </TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>Ventas</TableCell>
                      {semester[FlowSemesterViewFields.Flows].map((f, idx) =>
                          <TableCell sx={{ textAlign: 'right !important' }}>
                            {
                              editing ?
                                  <ControlledTextFieldFilled
                                      control={control}
                                      currency
                                      label={''}
                                      name={`${FlowInsertRequestFields.FlowList}.${idx}.${FlowFields.Sale}`}
                                      size={'small'}
                                      onFocus={handleFocus}
                                      textAlign={'right'}
                                      fullWidth
                                      disabled={
                                        !f[FlowSemesterDataFields.AllowEdit]
                                      }
                                      defaultValue={f[FlowFields.Sale]}
                                  />
                                  :
                                  <Typography fontWeight={600} fontSize={'.85rem'}>
                                    {numberFormatter.toStringWithAmount(
                                        f[FlowFields.Sale] || 0,
                                        '$',
                                        0,
                                    )}
                                  </Typography>
                            }
                          </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
            </Stack>
          </form>
        </Box>

        <DialogAlert open={openDelete}
                     severity={'error'}
                     title={'Eliminar semestre'}
                     textContent={`¿Estás seguro que deseás eliminar el semestre ${semester[FlowSemesterViewFields.SemesterNumber]} correspondiente al año ${semester[FlowSemesterViewFields.SemesterYear]}?`}
                     onClose={() => setOpenDelete(false)}
                     onConfirm={onConfirmDelete}
                     textConfirm={"Sí, eliminar"}
        />
      </React.Fragment>
  );
};

export default SemesterFlowCard;
