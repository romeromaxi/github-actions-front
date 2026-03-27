import React, {useState} from "react";
import {Button, Dialog, DialogContent, Stack, Tooltip} from "@mui/material";
import {BalancesSourceType} from "hooks/contexts/BalancesContext";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import FinancialStatementIAOptionButton from "./FinancialStatementIAOptionButton";
import FinancialStatementIASelectedFile from "./FinancialStatementIASelectedFile";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsSizeOverrides} from "@mui/material/Button/Button";

interface FinancialStatementIAButtonProps {
    dataId?: number | string,
    dataSource?: BalancesSourceType,
    financialId: number,
    onReload: () => void,
    size?: OverridableStringUnion<'small' | 'medium' | 'large', ButtonPropsSizeOverrides>
}

function FinancialStatementIAButton({ dataId, dataSource, financialId, onReload, size }: FinancialStatementIAButtonProps) {
    const [openSelectedDialog, setOpenSelectedDialog] = useState<boolean>(false);
    const [ocrTypeSelected, setOcrTypeSelected] = useState<'standard' | 'dynamic'>();
    
    const onClickStantardProcess = () => {
        setOcrTypeSelected('standard');
        setOpenSelectedDialog(false);
    }

    const onClickDynamicProcess = () => {
        setOcrTypeSelected('dynamic');
        setOpenSelectedDialog(false);
    }
    
    const onHandleSubmit = () => {
        onReload();
        setOcrTypeSelected(undefined);
    }
    
    return (
        <React.Fragment>
            <Tooltip title={'Subí el archivo del Estado Contable y la IA de LUC se ocupa de completar el ejercicio'}>
                <Button id={'financial-ia-assistant-btn'}
                        variant='contained'
                        size={size}
                        onClick={() => setOpenSelectedDialog(true)}
                >
                    Asistente de carga con IA
                </Button>
            </Tooltip>
            
            <Dialog open={openSelectedDialog}
                    maxWidth={'md'}
                    fullWidth
            >
                <BaseDialogTitle
                    title={'Asistente de carga de EECC con Inteligencia Artificial'}
                    subtitle={'Subí el archivo del estado contable o relacionalo desde LUC (biblioteca o LUFE) para procesar y extraer los datos mediante inteligencia artificial'}
                    onClose={() => setOpenSelectedDialog(false)}
                />
                
                <DialogContent>
                    <Stack spacing={2}
                           justifySelf={'center'}
                           justifyItems={'center'}
                           width={{ xs: 1, md: 0.75 }}
                    >
                        <FinancialStatementIAOptionButton logoUrl={""}
                                                          title={"Procesamiento Estándar"}
                                                          description={"Extracción de datos principales"}
                                                          onClick={onClickStantardProcess}
                        />
    
                        <FinancialStatementIAOptionButton logoUrl={""}
                                                          title={"Procesamiento Avanzado"}
                                                          description={"Análisis completo del balance incluyendo anexos, notas y cuadros"}
                                                          onClick={onClickDynamicProcess}
                                                          disabled={window.IS_PRODUCTION_ENV}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
            
            <FinancialStatementIASelectedFile open={!!ocrTypeSelected}
                                              type={ocrTypeSelected || 'standard'} 
                                              dataId={dataId}
                                              dataSource={dataSource}
                                              financialId={financialId} 
                                              onClose={() => setOcrTypeSelected(undefined)} 
                                              onSubmit={onHandleSubmit}
            />
        </React.Fragment>
    )
}

export default FinancialStatementIAButton;