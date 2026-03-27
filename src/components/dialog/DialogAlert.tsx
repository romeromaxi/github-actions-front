import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps, FormControlLabel,
    Stack,
} from '@mui/material';
import {DefaultStylesButton} from '../buttons/Buttons';
import ValidateIdentityHandle from '../../pages/user/components/ValidateIdentityHandle';
import React, {ReactElement, ReactNode, useMemo, useState} from "react";
import {TypographyBase} from "../misc/TypographyBase";

const titleDefault: string = '¡Atención!';
const textContentDefault: string =
    '¿Estás seguro que deseás confirmar la operación?';
const textCheckConfirmDefault: string = "Sí, estoy seguro"

interface DialogAlertProps extends DialogProps {
    // text props
    title?: string;
    textContent?: string;
    children?: string | ReactElement;

    // button props
    onClose: () => void;
    onConfirm?: (() => void) | ((value: boolean) => void);
    textClose?: string;
    textConfirm?: string;
    onReject?: () => void;
    confirmBtn?: ReactNode;

    // check props
    mustConfirm?: boolean; // Muestra checkbox siendo obligatorio
    showConfirm?: boolean; // Muestra checkbox pero NO es obligatorio
    textCheckConfirm?: string; // Texto a mostrar en checkbox

    // identity validation props
    validateIdentity?: boolean;
    validationRedirectUrl?: string;
    waitValidationProcessing?: boolean;

    // extras props
    hideTitle?: boolean;
    severity?: 'primary' | 'error';
    persist?: boolean; // Si es true, permite solo cerrarlo al accionar algun boton
}

export function DialogAlert({
                                textConfirm = "Confirmar",
                                severity = "primary",
                                ...props
                            }: DialogAlertProps) {
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const isStringChildren = typeof props.children === 'string';

    const finalTitle: string = props.title ?? titleDefault;
    const textContentFinal: string = props.textContent ?? textContentDefault;
    const textFinalButtonClose: string = useMemo(() => {
        if (!!props.textClose) return props.textClose;

        return severity === 'error' ? "No, volver" : "Cancelar"
    }, [props.textClose, severity]);


    const toggleConfirmed = () => setConfirmed(!confirmed);

    const onHandleCloseDialog = () => {
        props.onClose()
        setConfirmed(false);
    }

    const onHandleCloseFromCancelButton = () => {
        if (props.onReject)
            props.onReject()
        else
            props.onClose()
        setConfirmed(false);
    }

    const onHandleConfirm = () => {
        if (props.onConfirm) {
            if (props.onConfirm.length === 0) {
                // @ts-ignore
                props.onConfirm();
            } else {
                props.onConfirm(confirmed);
            }
        }
    }

    return (
        <Dialog {...props}
                onClose={!props.persist ? onHandleCloseDialog : undefined}
                maxWidth={props.maxWidth ?? 'xs'}
                fullWidth
        >
            <Stack spacing={3}>
                <DialogContent sx={{overflow: 'hidden', padding: '0 !important'}}>
                    <Stack spacing={1} alignItems={'center'} textAlign={'center'}>
                        {
                            !props.hideTitle &&
                            <TypographyBase variant={'body3'}>
                                {finalTitle}
                            </TypographyBase>
                        }

                        <TypographyBase variant={'h5'} sx={{whiteSpace: 'pre-line'}}>
                            {textContentFinal}
                        </TypographyBase>

                        {
                            props.children &&
                            (
                                isStringChildren ?
                                    <TypographyBase variant={'body2'}>
                                        {props.children}
                                    </TypographyBase>
                                    :
                                    props.children
                            )
                        }

                        {
                            (props.mustConfirm || props.showConfirm) && (
                                <FormControlLabel
                                    label={props.textCheckConfirm || textCheckConfirmDefault}
                                    style={{width: '100%'}}
                                    control={
                                        <Checkbox checked={confirmed}
                                                  onChange={toggleConfirmed}
                                                  color="primary"
                                        />}
                                />
                            )}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{display: 'flex', gap: 2, flexDirection: {xs: 'column', sm: 'row'}}}>
                    <Button variant={'outlined'} color={'secondary'} size={'medium'}
                            onClick={onHandleCloseFromCancelButton}
                            fullWidth
                    >
                        {textFinalButtonClose}
                    </Button>

                    {
                        props.onConfirm &&
                        (props.validateIdentity ? (
                            <ValidateIdentityHandle onClick={onHandleConfirm} 
                                                    redirectUrl={props.validationRedirectUrl}
                                                    waitBackgroundProcessing={props.waitValidationProcessing}
                            >
                                <DefaultStylesButton fullWidth>{textConfirm}</DefaultStylesButton>
                            </ValidateIdentityHandle>
                        ) : (
                            <Button size={'medium'}
                                    variant={'contained'}
                                    color={severity}
                                    onClick={onHandleConfirm}
                                    disabled={!confirmed && props.mustConfirm}
                                    fullWidth
                            >
                                {textConfirm}
                            </Button>
                        ))
                    }

                    {props.confirmBtn && props.confirmBtn}
                </DialogActions>
            </Stack>
        </Dialog>
    );
}
