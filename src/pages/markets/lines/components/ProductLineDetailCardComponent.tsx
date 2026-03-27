import React, { useState } from "react";
import { Box, Button, Checkbox, Collapse, Stack, Tooltip, Typography } from "@mui/material";
import { BaseRequestFields, EntityWithIdFields } from "types/baseEntities";
import { OffererLogoWithName } from "../../../offerer/components/OffererLogo";
import { ProductLineFields, ProductLineView, ProductLineViewDetail } from "types/lines/productLineData";
import { WrapperIcons } from "components/icons/Icons";
import { TextFieldFilled } from "components/forms/StyledTextField";
import useAxios from "hooks/useAxios";
import { useAction } from "hooks/useAction";
import { SolicitationInitialMessageDTO, SolicitationInitialMessageDTOFields } from "types/solicitations/solicitationData";
import { HttpSolicitation } from "http/index";
import ProductLineSummaryDetailDrawer from "../detail/ProductLineSummaryDetailDrawer";
import { LoaderBlockUI } from "../../../../components/loader";
import ButtonHoverSwitch from "../../../../components/buttons/ButtonHoverSwitch";
import {CheckIcon} from "lucide-react";
import {TypographyBase} from "../../../../components/misc/TypographyBase";

interface ProductLineDetailCardComponentProps {
    productLine: ProductLineView | ProductLineViewDetail;
    handleCheckboxClick?: (line: ProductLineView) => void;
    handleDeselectClick?: (line: ProductLineView) => void;
    key?: string;
    startDisplayMessage?: boolean;
    allowsViewMessage?: boolean;
    allowsModifyMessage?: boolean;
    allowsOpenDetail?: boolean;
    checked?: boolean;
    action?: React.ReactElement;
}

function ProductLineDetailCardComponent({
    key,
    productLine,
    handleCheckboxClick,
    handleDeselectClick,
    checked,
    startDisplayMessage = false,
    allowsViewMessage = false,
    allowsModifyMessage = false,
    allowsOpenDetail = true,
    action,
}: ProductLineDetailCardComponentProps) {
    const componentKey: string = key ?? `productLineDetailCardComponent_${productLine[EntityWithIdFields.Id]}`;
    const canViewMessage: boolean = (allowsViewMessage || allowsModifyMessage) && !!productLine[ProductLineFields.SolicitationId];
    const showModifyMessage: boolean = allowsModifyMessage && !!productLine[ProductLineFields.SolicitationId];

    const { fetchData } = useAxios();
    const { snackbarSuccess } = useAction();

    const [isEditingMessage, setIsEditingMessage] = React.useState(startDisplayMessage);
    const [initialMessage, setInitialMessage] = React.useState(productLine[ProductLineFields.InitialMessage]);
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [lineDetail, setLineDetail] = useState<ProductLineViewDetail>(productLine as ProductLineViewDetail);

    const onHandleCheckboxClick = () => handleCheckboxClick && handleCheckboxClick(productLine);

    const onHandleDelete = () => handleDeselectClick && handleDeselectClick(productLine);

    const onConfirmInitialMessage = () => {
        const messageDTO: SolicitationInitialMessageDTO = {
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
            [SolicitationInitialMessageDTOFields.Message]: initialMessage,
        };

        fetchData(() => HttpSolicitation.setInitialMessage(productLine[ProductLineFields.SolicitationId], messageDTO)).then(() => {
            productLine[ProductLineFields.InitialMessage] = initialMessage;
            snackbarSuccess("El mensaje se ha guardado con éxito");
            setIsEditingMessage(false);
        });
    };

    const onChangeInitialMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isEditingMessage) setInitialMessage(event.target.value);
    };

    const viewProductLine = () => {
        setOpenDetail(true);
    };

    const handleOpenDetail = () => {
        viewProductLine();
    };

    return (
        <Box
            key={componentKey}
            sx={{
                padding: "24px",
                borderRadius: "16px",
                backgroundColor: "white",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Stack spacing={2.5}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                    }}
                >
                    {
                        /*
                            <Box
                                sx={{
                                    alignSelf: "flex-end",
                                    display: { xs: "block", sm: "none" }, 
                                    mb: { xs: 1, sm: 0 },
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography color="text.lighter" fontSize={12} fontWeight={500} sx={{width: "fit-content"}}>
                                        {productLine[ProductLineFields.ProductServiceDesc]}
                                    </Typography>
            
                                    {handleDeselectClick && (
                                        <Box onClick={onHandleDelete} sx={{ cursor: "pointer" }}>
                                            <WrapperIcons Icon={X} size={"sm"} />
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                         */
                    }
    
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            maxWidth: "100%",
                            wordWrap: "break-word",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <OffererLogoWithName offererId={productLine[ProductLineFields.OffererId]}
                                             offererBusinessName={productLine[ProductLineFields.OffererBusinessName]}
                                             header={
                                            <TypographyBase variant={'body3'} color="text.lighter" sx={{width: "fit-content"}}>
                                                 {productLine[ProductLineFields.ProductServiceDesc]}
                                             </TypographyBase>}
                                             NameProps={{ variant: 'body1' }}
                                             size={'md'}
                        />
                    </Box>
    
                    <Box
                        sx={{
                            alignSelf: "flex-start",
                            display: "block", 
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            {handleDeselectClick && startDisplayMessage && (
                                <ButtonHoverSwitch
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    onClick={onHandleDelete}
                                    normalProps={{
                                        startIcon: <WrapperIcons Icon={CheckIcon} size={"sm"} />,
                                        variant: "outlined"
                                    }}
                                    hoverChildren="Deshacer"
                                >
                                    Seleccionada
                                </ButtonHoverSwitch>
                            )}
                        </Stack>
                    </Box>
                </Box>
    
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ width: "100%" }}>
                    <Box sx={{ flex: 1, minWidth: 0, wordWrap: "break-word" }}>
                        <TypographyBase
                            variant={"h4"}
                            onClick={allowsOpenDetail ? handleOpenDetail : undefined}
                            sx={{
                                cursor: allowsOpenDetail ? "pointer" : "default",
                                "&:hover": allowsOpenDetail ? { color: "primary.main" } : {},
                                wordWrap: "break-word",
                            }}
                        >
                            {productLine[ProductLineFields.Line]}
                        </TypographyBase>
                    </Box>
    
                    {handleCheckboxClick && (
                        <Box sx={{ ml: 2, flexShrink: 0 }}>
                            <Checkbox disabled={false} onClick={onHandleCheckboxClick} checked={checked} />
                        </Box>
                    )}
                </Stack>
    
                {showModifyMessage && (
                    <Collapse in={isEditingMessage} sx={{ marginTop: "0px !important" }}>
                        <Stack sx={{ width: "100%" }}>
                            <TextFieldFilled
                                multiline
                                rows={2}
                                disabled={!isEditingMessage}
                                value={initialMessage || ""}
                                onChange={onChangeInitialMessageInput}
                                helperText={isEditingMessage ? "Recordá guardar para confirmar cambios" : ""}
                            />
                        </Stack>
                    </Collapse>
                )}
    
                {canViewMessage && !showModifyMessage && (
                    <Stack direction={"row"} width={1} sx={{ mt: 2 }}>
                        {!!productLine[ProductLineFields.InitialMessage] && (
                            <Typography variant={"caption"} color={"text.lighter"}>
                                <strong style={{ fontWeight: 500 }}>Mensaje: </strong>
                                {productLine[ProductLineFields.InitialMessage]}
                            </Typography>
                        )}
                    </Stack>
                )}
            </Stack>
    
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "auto",
                    pt: 2,
                }}
            >
                {canViewMessage ? (
                    showModifyMessage ? (
                        !isEditingMessage ? (
                            <Button variant="text" size="small" color={"primary"} onClick={() => setIsEditingMessage(true)}>
                                {!!productLine[ProductLineFields.InitialMessage] ? "Ver mensaje" : "Agregar mensaje"}
                            </Button>
                        ) : (
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Button variant="text" size="small" color={"error"} onClick={() => {
                                    setIsEditingMessage(false);
                                    setInitialMessage(productLine[ProductLineFields.InitialMessage]);
                                }}>
                                    Cancelar
                                </Button>
                                <Tooltip title={"El mensaje guardado podrás enviarlo en el paso siguiente"}>
                                    <Button variant="text" size="small" color={"primary"} onClick={onConfirmInitialMessage}>
                                        Guardar
                                    </Button>
                                </Tooltip>
                            </Stack>
                        )
                    ) : null
                ) : (
                    <Box />
                )}
    
                {action && action}
            </Box>
    
            {!loading ? (
                <ProductLineSummaryDetailDrawer open={openDetail} line={lineDetail} onClose={() => setOpenDetail(false)} />
            ) : (
                <LoaderBlockUI />
            )}
        </Box>
    );
}

export default ProductLineDetailCardComponent;
