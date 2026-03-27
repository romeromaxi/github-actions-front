import React, {useState} from "react";
import {Box, Button, ButtonProps, Card, CardContent, CardHeader, Divider, Stack} from "@mui/material";
import {PencilIcon, SaveIcon} from "lucide-react";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import {BaseResponse, BaseResponseFields} from "types/baseEntities";

interface CardEditingWithContextProps {
    title: string | React.ReactNode,
    startEditing?: boolean,
    children?: React.ReactNode | React.ReactNode[],
    onDiscard?: () => void,
    onSubmit: () => Promise<void | BaseResponse>,
    useAppCommon?: boolean,
    btnProps?: ButtonProps,
    discardBtnProps?: ButtonProps,
    hideHeaderActions?: boolean,
    additionalActions?: React.ReactNode,
}

export const CardEditingContext = React.createContext({
    editing: false,
    setEditing: (_: boolean) => { }
})

function CardEditingWithContext(props: CardEditingWithContextProps) {
    const { setShouldWarnBeforeSwitch } = useApplicationCommon();

    const [editing, setEditing] = useState<boolean>(!!props.startEditing);

    const onHandleDiscard = () => {
        props.onDiscard && props.onDiscard();
        setEditing(false);
        if (props.useAppCommon)
            setShouldWarnBeforeSwitch(false);
    }
    
    const onHandleSubmit = () => {
        props.onSubmit()
            .then(response => {
                if (!!response && response[BaseResponseFields.HasError]) {
                    return
                }
                
                setEditing(false);
                
                if (props.useAppCommon)
                    setShouldWarnBeforeSwitch(false);
            })
    }
    
    const CardHeaderActions = () => (
        <Stack direction={'row'} spacing={1.5}>
            {props.additionalActions}
            
            {
                !editing && !props.hideHeaderActions &&
                    <Button variant={'contained'}
                            color={'primary'}
                            size={'small'}
                            onClick={() => setEditing(true)}
                            startIcon={<PencilIcon />}
                            {...props.btnProps}
                    >
                        Editar
                    </Button>
            }
            
            {
                editing && !props.hideHeaderActions && (
                    <React.Fragment>
                        <Button variant={'outlined'}
                                color={'secondary'}
                                size={'small'}
                                onClick={onHandleDiscard}
                                {...props.discardBtnProps}
                        >
                            Descartar
                        </Button>
                        
                        <Button variant={'contained'}
                                color={'primary'}
                                size={'small'}
                                onClick={onHandleSubmit}
                                startIcon={<SaveIcon />}
                                {...props.btnProps}
                        >
                            Guardar cambios
                        </Button>
                    </React.Fragment>
                )
            }
        </Stack>
    )

    return (
        <Card sx={{borderRadius: 3}}>
            <CardHeader title={props.title}
                        action={<CardHeaderActions />}
            />
            
            <CardContent>
                <Box mb={3}>
                    <Divider />
                </Box>
                
                <CardEditingContext.Provider value={{ editing, setEditing }}>
                    {props.children}
                </CardEditingContext.Provider>
            </CardContent>
        </Card>
    )
}

export default CardEditingWithContext;