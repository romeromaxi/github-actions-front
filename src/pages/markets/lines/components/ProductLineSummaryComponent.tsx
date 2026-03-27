import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import { Box, Button, Checkbox, Collapse, Stack, Theme, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { BaseRequestFields, EntityWithIdFields } from "types/baseEntities";
import { OffererLogoWithName } from "../../../offerer/components/OffererLogo";
import { ProductLineFields, ProductLineView, ProductLineViewDetail } from "types/lines/productLineData";
import { WrapperIcons } from "components/icons/Icons";
import { TextFieldFilled } from "components/forms/StyledTextField";
import useAxios from "hooks/useAxios";
import { useAction } from "hooks/useAction";
import { SolicitationInitialMessageDTO, SolicitationInitialMessageDTOFields } from "types/solicitations/solicitationData";
import { HttpProductLine, HttpSolicitation } from "http/index";
import ProductLineSummaryDetailDrawer from "../detail/ProductLineSummaryDetailDrawer";
import { LoaderBlockUI } from "../../../../components/loader";

interface ProductLineSummaryComponentProps {
    productLine: ProductLineView | ProductLineViewDetail;
    handleCheckboxClick?: (line: ProductLineView) => void;
    handleDeleteClick?: (line: ProductLineView) => void;
    key?: string;
    startDisplayMessage?: boolean;
    allowsViewMessage?: boolean;
    allowsModifyMessage?: boolean;
    checked?: boolean;
    action?: React.ReactElement;
}

function ProductLineSummaryComponent({
    key,
    productLine,
    handleCheckboxClick,
    handleDeleteClick,
    checked,
    startDisplayMessage = false,
    allowsViewMessage = false,
    allowsModifyMessage = false,
    action,
}: ProductLineSummaryComponentProps) {
    const componentKey: string = key ?? `productLineSummaryComponent_${productLine[EntityWithIdFields.Id]}`;
    const canViewMessage: boolean = (allowsViewMessage || allowsModifyMessage) && !!productLine[ProductLineFields.SolicitationId];
    const showModifyMessage: boolean = allowsModifyMessage && !!productLine[ProductLineFields.SolicitationId];
    
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const { fetchData } = useAxios();
    const { snackbarSuccess } = useAction();

    const [isEditingMessage, setIsEditingMessage] = React.useState(startDisplayMessage);
    const [initialMessage, setInitialMessage] = React.useState(productLine[ProductLineFields.InitialMessage]);
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [lineDetail, setLineDetail] = useState<ProductLineViewDetail | undefined>(undefined);

    const onHandleCheckboxClick = () => handleCheckboxClick && handleCheckboxClick(productLine);

    const onHandleDelete = () => handleDeleteClick && handleDeleteClick(productLine);

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
        if (!!lineDetail) viewProductLine();
        else {
            setLoading(true);
            HttpProductLine.getByProductLineId(productLine[EntityWithIdFields.Id]).then((r) => {
                setLoading(false);
                setLineDetail(r);
                viewProductLine();
            });
        }
    };

    return (
        <Box
            key={componentKey}
            sx={{
                padding: "16px",
                borderRadius: "24px",
                border: "1px solid #EDF2F7",
                backgroundColor: "white",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Stack spacing={1}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "flex-start" },
                        justifyContent: "space-between",
                    }}
                >
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
    
                            {handleDeleteClick && (
                                <Box onClick={onHandleDelete} sx={{ cursor: "pointer" }}>
                                    <WrapperIcons Icon={X} size={"sm"} />
                                </Box>
                            )}
                        </Stack>
                    </Box>
    
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
                                            <Typography color="text.lighter" fontSize={12} fontWeight={500} sx={{width: "fit-content"}}>
                                                 {productLine[ProductLineFields.ProductServiceDesc]}
                                             </Typography>}
                                             size={'sm'}
                        />
                    </Box>
    
                    <Box
                        sx={{
                            alignSelf: "flex-start",
                            display: { xs: "none", sm: "block" }, 
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography color="text.lighter" fontSize={12} fontWeight={500} sx={{width: "fit-content"}}>
                                {productLine[ProductLineFields.ProductServiceDesc]}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
    
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ width: "100%" }}>
                    <Box sx={{ flex: 1, minWidth: 0, maxWidth: "calc(100% - 48px)", wordWrap: "break-word" }}>
                        <Typography
                            onClick={handleOpenDetail}
                            sx={{
                                cursor: "pointer",
                                "&:hover": { color: "primary.main" },
                                wordWrap: "break-word",
                            }}
                            fontWeight={500}
                            fontFamily="inherit"
                        >
                            {productLine[ProductLineFields.Line]}
                        </Typography>
                    </Box>
    
                    {handleCheckboxClick && (
                        <Box sx={{ ml: 2, flexShrink: 0 }}>
                            <Checkbox disabled={false} onClick={onHandleCheckboxClick} checked={checked} />
                        </Box>
                    )}
                </Stack>
    
                {showModifyMessage && !isMobileScreenSize && (
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
    
                {!isMobileScreenSize && canViewMessage && !showModifyMessage && (
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
                {!isMobileScreenSize && canViewMessage ? (
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
                lineDetail && (
                    <ProductLineSummaryDetailDrawer open={openDetail} line={lineDetail} onClose={() => setOpenDetail(false)} />
                )
            ) : (
                <LoaderBlockUI />
            )}
        </Box>
    );
}

export default ProductLineSummaryComponent;