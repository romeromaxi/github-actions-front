import {
    ProductLineChosenHistoryView,
    ProductLineChosenView, ProductLineChosenViewFields,
    ProductLineInternalSelectedLineForm,
    ProductLineInternalSelectedLineFormFields
} from "../../../../types/lines/productLineData";
import DrawerBase from "../../../../components/misc/DrawerBase";
import {useForm} from "react-hook-form";
import {Stack} from "@mui/material";
import {AsyncSelect, ControlledCheckBox, ControlledTextFieldFilled} from "../../../../components/forms";
import {HttpProductLine} from "../../../../http";
import React, {useEffect, useState} from "react";
import {BaseResponseFields, EntityWithIdFields} from "../../../../types/baseEntities";
import {SendButton} from "../../../../components/buttons/Buttons";
import useAxios from "../../../../hooks/useAxios";
import {useAction} from "../../../../hooks/useAction";
import * as yup from 'yup';
import {RequiredSelectSchema} from "../../../../util/validation/validationSchemas";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {HttpProductLineChosen} from "../../../../http/line/httpProductLineChosen";
import TabSectionCardHeader from "../../../../components/cards/TabSectionCardHeader";
import { ClipboardText } from "phosphor-react";
import ProductLineHistoricDataContent from "./ProductLineHistoricDataContent";


interface DrawerInternalSelectedLinesProps {
    open: boolean;
    onClose: () => void;
    selectedLine?: ProductLineChosenView;
    onReload: () => void;
}


const DrawerInternalSelectedLines = ({open, onClose, selectedLine, onReload} : DrawerInternalSelectedLinesProps) => {
    const [history, setHistory] = useState<ProductLineChosenHistoryView[]>()
    const schema = yup.object().shape({
        [ProductLineInternalSelectedLineFormFields.Id]: RequiredSelectSchema
    })
    
    const { control, handleSubmit, reset, watch } = useForm<ProductLineInternalSelectedLineForm>({
        resolver: yupResolver(schema)
    })
    const { fetchData } = useAxios()
    const { snackbarSuccess } = useAction();
    const watchSelectedLineId = watch(ProductLineInternalSelectedLineFormFields.Id);
    
    const onSubmit = (data: ProductLineInternalSelectedLineForm) => {
        const submitData = {
            ...data,
            [ProductLineInternalSelectedLineFormFields.Order]: data[ProductLineInternalSelectedLineFormFields.Order] || null
        }
        fetchData(
            () => HttpProductLineChosen.insertSelectedProductLine(submitData),
            true
        ).then((r) => {
            if (!r[BaseResponseFields.HasError]){
                snackbarSuccess('La línea se guardó correctamente')
                handleClose()
                onReload()
            }
        })
    }

    useEffect(() => {
        if (selectedLine) {
            reset({
                [ProductLineInternalSelectedLineFormFields.Id]: selectedLine[EntityWithIdFields.Id],
                [ProductLineInternalSelectedLineFormFields.Order]: selectedLine[ProductLineChosenViewFields.ProposalOrder],
                [ProductLineInternalSelectedLineFormFields.Active]: selectedLine[ProductLineChosenViewFields.ProposalActive]
            })
        }
    }, [selectedLine]);

    useEffect(() => {
        if (!!watchSelectedLineId) {
            HttpProductLineChosen.getHistoriesByProductLineId(watchSelectedLineId).then(setHistory)
        }
    }, [watchSelectedLineId]);
    
    const handleClose = () => {
        reset({
            idProductoLinea: 0,
            orden: null,
            activo: false
        })
        setHistory(undefined);
        onClose()
    }
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={handleClose}
                    title={selectedLine ? 'Editar línea destacada' : 'Nueva línea destacada'}
                    action={<SendButton onClick={handleSubmit(onSubmit)}>{selectedLine ? 'Actualizar' : 'Guardar'}</SendButton>}
        >
            <Stack spacing={2} maxWidth={'-webkit-fill-available'}>
                <AsyncSelect loadOptions={HttpProductLine.getBasicData}
                             control={control}
                             name={ProductLineInternalSelectedLineFormFields.Id}
                             label={'Línea'}
                             fullWidth
                             disabled={!!selectedLine}
                />
                <Stack spacing={2} direction='row' alignItems='center'>
                    <ControlledTextFieldFilled control={control}
                                               name={ProductLineInternalSelectedLineFormFields.Order}
                                               label={'Orden'}
                                               fullWidth
                    />
                    <ControlledCheckBox label={'Activo'}
                                        name={ProductLineInternalSelectedLineFormFields.Active}
                                        control={control}
                    />
                </Stack>

                {
                    history && !!history.length &&
                        <TabSectionCardHeader icon={ClipboardText}
                                              sectionTitle={'Historial'}
                                              size={'small'}
                                              defaultCollapsed
                        >
                            <ProductLineHistoricDataContent history={history} />
                        </TabSectionCardHeader>
                }
            </Stack>
        </DrawerBase>
                    
    )
}


export default DrawerInternalSelectedLines