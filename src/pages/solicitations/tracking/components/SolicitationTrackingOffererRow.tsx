import React, {useState} from "react";
import * as yup from 'yup';
import {useForm} from "react-hook-form";
import {
    SolicitationTrackingFields,
    SolicitationTrackingUpdateStatus,
    SolicitationTrackingView
} from "types/solicitations/solicitationTrackingData";
import {Chip, Stack, TableCell, TableRow, Tooltip} from "@mui/material";
import {AsyncSelect, ControlledTextFieldFilled} from "../../../../components/forms";
import {EntityWithIdAndDescription, EntityWithIdFields} from "../../../../types/baseEntities";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {CloseIconButton, EditIconButton, SaveIconButton} from "../../../../components/buttons/Buttons";
import useAxios from "../../../../hooks/useAxios";
import {HttpSolicitationTracking} from "../../../../http/solicitations/httpSolicitationTracking";
import {useAction} from "../../../../hooks/useAction";
import {RequiredSelectSchema, RequiredStringSchema} from "../../../../util/validation/validationSchemas";
import {yupResolver} from "@hookform/resolvers/yup";

interface SolicitationTrackingOffererRowProps {
    solicitationId: number,
    tracking: SolicitationTrackingView,
    loadTrackingStatus: () => Promise<EntityWithIdAndDescription[]> | undefined,
    onReload: () => void,
    allowEdit?: boolean
}

function SolicitationTrackingOffererRow({ solicitationId, tracking, loadTrackingStatus, onReload, allowEdit }: SolicitationTrackingOffererRowProps) {
    const {snackbarSuccess} = useAction();
    const {fetchData} = useAxios();
    const hasResult = tracking[SolicitationTrackingFields.SolicitationTrackingStatusCode] !== 1;
    const [editingMode, setEditingMode] = useState<boolean>(!hasResult && !!allowEdit);
    
    const solicitationTrackingUpdateStatusSchema = yup.object().shape({
        [SolicitationTrackingFields.SolicitationTrackingStatusCode]: RequiredSelectSchema,
        [SolicitationTrackingFields.Observations]: RequiredStringSchema,
    });
    const { control, handleSubmit, reset } = useForm<SolicitationTrackingUpdateStatus>({
        resolver: yupResolver(solicitationTrackingUpdateStatusSchema)
    });
    
    const changeToEditingMode = () => {
        reset({
            [SolicitationTrackingFields.SolicitationTrackingStatusCode]: tracking[SolicitationTrackingFields.SolicitationTrackingStatusCode],
            [SolicitationTrackingFields.Observations]: tracking[SolicitationTrackingFields.Observations],
        })
        setEditingMode(true);
    }
    
    const onHandleSubmitUpdateStatus = (data: SolicitationTrackingUpdateStatus) => 
        fetchData(
            () => HttpSolicitationTracking.updateTrackingStatus(solicitationId, tracking[EntityWithIdFields.Id], data),
            true
        )
            .then(() => {
                snackbarSuccess("Se actualizó el seguimiento exitosamente!");
                onReload();
            })
    
    return (
        <TableRow>
            <TableCell sx={{ textAlign: 'left !important', maxWidth: '10px !important' }}>
                <Stack>
                    <TypographyBase tooltip maxLines={2}>
                        {tracking[SolicitationTrackingFields.FinancialEntityBusinessName]}
                    </TypographyBase>

                    <TypographyBase variant={'caption'} color={'text.lighter'}>
                        {
                            dateFormatter.toShortDate(tracking[SolicitationTrackingFields.BeginDate]) !== '01/01/0001' ?
                                `Envío: ${dateFormatter.toShortDate(tracking[SolicitationTrackingFields.BeginDate])}`
                                :
                                '-'
                        }
                    </TypographyBase>
                </Stack>
            </TableCell>
            <TableCell sx={{ maxWidth: '100px !important', alignContent: hasResult ? 'center' : 'start' }}>
                {
                    !editingMode ?
                        <Stack alignItems={'center'}>
                            <Tooltip title={tracking[SolicitationTrackingFields.SolicitationTrackingStatusDesc]}>
                                <Chip label={tracking[SolicitationTrackingFields.SolicitationTrackingStatusDesc]} 
                                      size={'small'}
                                />
                            </Tooltip>


                            {
                                tracking[SolicitationTrackingFields.LastModifiedStatusDate] && 
                                    <TypographyBase variant={'subtitle2'} fontWeight={400} color={'text.lighter'}>
                                        {`Últ. Modificación: ${dateFormatter.toShortDate(tracking[SolicitationTrackingFields.BeginDate])}`}
                                    </TypographyBase>
                            }
                            
                        </Stack>
                        :
                        <AsyncSelect control={control}
                                     loadOptions={loadTrackingStatus}
                                     name={SolicitationTrackingFields.SolicitationTrackingStatusCode}
                        />
                }
            </TableCell>
            <TableCell sx={{ textAlign: 'left !important', maxWidth: '100px !important', alignContent: hasResult ? 'center' : 'start' }}>
                {
                    !editingMode ?
                        <TypographyBase tooltip maxLines={4} whiteSpace={'pre-line'}>
                            {tracking[SolicitationTrackingFields.Observations]}
                        </TypographyBase>
                        :
                        <ControlledTextFieldFilled control={control}
                                                   name={SolicitationTrackingFields.Observations}
                                                   multiline
                                                   maxRows={8}
                        />
                }
            </TableCell>

            {
                allowEdit &&
                    <TableCell sx={{ maxWidth: '10px !important' }}>
                        {
                            editingMode ?
                                <Stack>
                                    <SaveIconButton tooltipTitle={"Establecer estado"}
                                                    onClick={handleSubmit(onHandleSubmitUpdateStatus)}
                                                    size={'small'}
                                    />
        
                                    {
                                        hasResult &&
                                            <CloseIconButton tooltipTitle={"Cancelar edición"} 
                                                             onClick={() => setEditingMode(false)}
                                                             size={'small'}
                                            />
                                    }
                                </Stack>
                                :
                                <EditIconButton tooltipTitle={"Modificar estado"}
                                                onClick={changeToEditingMode}
                                                size={'small'}
                                />
                        }
                    </TableCell>
            }
        </TableRow>
    )
}

export default SolicitationTrackingOffererRow;