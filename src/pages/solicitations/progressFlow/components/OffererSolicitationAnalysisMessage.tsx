import React, {useState} from "react";
import {Button, Stack} from "@mui/material";
import {ControlledTextFieldFilled} from "components/forms";
import LabelFormBase from "components/forms/LabelFormBase";
import {TypographyBase} from "components/misc/TypographyBase";
import {PlusIcon} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";

interface OffererSolicitationAnalysisMessageProps {
    type: SolicitationProposedApprovalFlowTypes,
    name: string,
    isSuitable: boolean
}

function OffererSolicitationAnalysisMessage({ type, name, isSuitable }: OffererSolicitationAnalysisMessageProps) {
    const methods = useFormContext();
    
    const [showInput, setShowInput] = useState<boolean>(false); 
    
    const onClearMessage = () => {
        methods.setValue(name, '');
        setShowInput(false);
    }
    
    if (type === SolicitationProposedApprovalFlowTypes.AdmissionReception && isSuitable)
        return null;
    
    return (
        <Stack spacing={2.5}>
            <Stack spacing={1.25}>
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <LabelFormBase label={isSuitable ? 'Propuesta para la PyME' : 'Mensaje para la PyME'} />

                    {
                        (showInput && !isSuitable) &&
                            <Button variant={'text'}
                                    color={'error'}
                                    size={'small'}
                                    onClick={onClearMessage}
                                    minPadding
                            >
                                Borrar
                            </Button>
                    }
                </Stack>

                {
                    (showInput || isSuitable) ?
                        <ControlledTextFieldFilled control={methods.control} 
                                                   name={name} 
                                                   minRows={3}
                                                   multiline
                                                   fullWidth
                        />
                        :
                        <TypographyBase variant={'body4'}>
                            Si no se adjunta un mensaje, se enviará una comunicación genérica
                        </TypographyBase>
                }

                {
                    (showInput && !isSuitable) &&
                        <TypographyBase variant={'body4'} color={'#3677ED'}>
                            La PyME recibirá una alerta del rechazo junto con tu mensaje.
                        </TypographyBase>
                }
            </Stack>

            {
                (!showInput && !isSuitable) && (
                    <Button variant={'outlined'}
                            color={'secondary'}
                            size={'small'}
                            startIcon={<PlusIcon />}
                            onClick={() => setShowInput(true)}
                    >
                        Añadir mensaje para la PyME
                    </Button>
                )
            }
        </Stack>
    )
}

export default OffererSolicitationAnalysisMessage;