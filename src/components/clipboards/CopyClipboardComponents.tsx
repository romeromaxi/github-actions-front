import {IconButton, IconButtonProps, Stack, Tooltip} from "@mui/material";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {copyToClipboard} from "util/helpers/clipboardHelper";
import {FilesIcon} from "lucide-react";
import {TypographyBase, TypographyBaseProps} from "../misc/TypographyBase";

interface CopyClipboardCommonProps {
    textToCopy: string,
    icon?: React.ReactNode
}

interface CopyClipboardButtonProps extends CopyClipboardCommonProps, Omit<IconButtonProps, 'onClick'> {
}

function CopyClipboardButton({ textToCopy, icon, ...props }: CopyClipboardButtonProps) {
    const { addSnackbarSuccess, addSnackbarWarning } = useSnackbarActions();
    
    const handleCopyToClipboard = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const ok = await copyToClipboard(textToCopy);

        if (ok) {
            addSnackbarSuccess(`'${textToCopy}' copiado al portapapeles`);
        } else {
            addSnackbarWarning('No se pudo copiar al portapapeles');
        }
    };
    
    return (
        <Tooltip title={'Copiar al portapapeles'}>
            <IconButton color={'secondary'} 
                        size={'small'}
                        variant={'text'}
                        {...props}
                        onClick={handleCopyToClipboard}
            >
                {icon ? icon : <FilesIcon />}
            </IconButton>
        </Tooltip>
    )
}

interface CopyClipboardTypographyProps extends CopyClipboardCommonProps, Omit<TypographyBaseProps, 'onClick'> {
    addIcon?: boolean
}

function CopyClipboardTypography({ textToCopy, addIcon, icon, ...props }: CopyClipboardTypographyProps) {
    const { addSnackbarSuccess, addSnackbarWarning } = useSnackbarActions();

    const handleCopyToClipboard = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const ok = await copyToClipboard(textToCopy);

        if (ok) {
            addSnackbarSuccess(`'${textToCopy}' copiado al portapapeles`);
        } else {
            addSnackbarWarning('No se pudo copiar al portapapeles');
        }
    };
    
    return (
        (!addIcon && !icon) ?
            <TypographyBase onClick={handleCopyToClipboard}
                            labelTooltip={'Copiar al portapapeles'}
                            { ...props }
            />
            :
            <Tooltip title={'Copiar al portapapeles'}>
                <Stack onClick={handleCopyToClipboard} 
                       direction={'row'}
                       alignItems={'center'}
                       spacing={0.5}
                       color={props.color}
                       sx={{ 
                           '&:hover': {
                               cursor: 'pointer',
                               color: 'primary.main'
                           }
                       }}
                >
                    <TypographyBase onClick={handleCopyToClipboard}
                                    { ...props }
                    />

                    {icon ? icon : <FilesIcon  />}
                </Stack>
            </Tooltip>
    )
}

export {
    CopyClipboardButton,
    CopyClipboardTypography
}
