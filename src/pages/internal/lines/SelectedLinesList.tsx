import React, {useEffect, useState} from "react";
import {
    ProductLineChosenView, ProductLineChosenViewFields,
    ProductLineInternalSelected,
    ProductLineInternalSelectedFields
} from "../../../types/lines/productLineData";
import {ITableColumn, TableColumnType, TableList} from "../../../components/table";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {AddButton, ButtonIconDropdown, SearchButton, SendButton} from "../../../components/buttons/Buttons";
import DrawerInternalSelectedLines from "./components/DrawerInternalSelectedLines";
import {Stack, Typography} from "@mui/material";
import DialogSelectedLinesPreview from "./components/DialogSelectedLinesPreview";
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {MagnifyingGlass, Sparkle} from "@phosphor-icons/react";
import OffererLogo from "pages/offerer/components/OffererLogo";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {HttpProductLineChosen} from "../../../http/line/httpProductLineChosen";
import DialogProposalLinesApply from "./components/DialogProposalLinesApply";
import {WrapperIcons} from "../../../components/icons/Icons";
import {Pencil} from "phosphor-react";
import DialogHistoryLine from "./components/DialogHistoryLine";


const SelectedLinesList = () => {
    const [selectedLines, setSelectedLines] = useState<ProductLineChosenView[]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [lineEdit, setLineEdit] = useState<ProductLineChosenView>()
    const [open, setOpen] = useState<boolean>(false)
    const [openPreview, setOpenPreview] = useState<boolean>(false)
    const [openApply, setOpenApply] = useState<boolean>(false)
    const [openHistory, setOpenHistory] = useState<boolean>(false)
    
    const loadSelectedLines = () => {
        setLoading(true)
        HttpProductLineChosen.getChosenSelectedProductLines()
            .then(setSelectedLines)
            .finally(() => setLoading(false))
    }
    
    useEffect(() => {
        loadSelectedLines()
    }, []);
    
    const onEdit = (line: ProductLineChosenView) => {
        setLineEdit(line)
        setOpen(true)
    }
    
    const onViewHistory = (line: ProductLineChosenView) => {
        setLineEdit(line)
        setOpenHistory(true)
    }
    
    const columns: ITableColumn[] = [
        {label: 'ID', value: EntityWithIdFields.Id},
        {
            label: 'Oferente', textAlign: 'left',
            onRenderCell: (ent: ProductLineChosenView) =>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <OffererLogo offererId={ent[ProductLineInternalSelectedFields.OffererId]}
                                 size={'lg'}
                    />
                    
                    <TypographyBase tooltip maxLines={2}>
                        {ent[ProductLineInternalSelectedFields.OffererBusinessName]}
                    </TypographyBase>
                </Stack>
        },
        {label: 'Linea', value: ProductLineInternalSelectedFields.ProductLineDesc, textAlign: 'left',
            onRenderCell: (ent: ProductLineChosenView) => 
            <Stack>
                <Typography>{ent[ProductLineInternalSelectedFields.ProductLineDesc]}</Typography>
                <Typography color={'text.lighter'} variant={'caption'}>{ent[ProductLineInternalSelectedFields.ProductLineLongDesc]}</Typography>
            </Stack>
        },
        {label: 'Orden', value: ProductLineInternalSelectedFields.Order},
        {label: 'Orden propuesta', value: ProductLineChosenViewFields.ProposalOrder},
        {label: 'Activa', value: ProductLineInternalSelectedFields.Active, type: TableColumnType.Boolean},
        {label: 'Propuesta activa', value: ProductLineChosenViewFields.ProposalActive, type: TableColumnType.Boolean},
        {label: '', onRenderCell: (line: ProductLineChosenView) => 
                <ButtonIconDropdown label={''}
                                    items={[
                                        {
                                            icon: <WrapperIcons Icon={Pencil} size={'sm'} />,
                                            label: 'Editar',
                                            onClick: () => onEdit(line)
                                        },
                                        {
                                            icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />,
                                            label: 'Ver historial',
                                            onClick: () => onViewHistory(line)
                                        }
                                    ]}
                                    size='small'
                />
        }
    ]
    
    const onClose = () => {
        setOpen(false)
        setLineEdit(undefined)
    }
    
    const renderAction = () => {
        return (
            <Stack spacing={2} direction='row' alignItems='center'>
                <SearchButton size="small" onClick={() => setOpenPreview(true)} 
                              variant="outlined"
                              color={'secondary'}
                              disabled={!selectedLines || selectedLines.length === 0}>
                    Vista previa
                </SearchButton>
                <SendButton size="small" onClick={() => setOpenApply(true)} 
                            variant="outlined"
                            color={'secondary'}
                            disabled={!selectedLines || selectedLines.length === 0}>
                    Aplicar
                </SendButton>
                <AddButton size="small" onClick={() => setOpen(true)}>Agregar</AddButton>
            </Stack>
        )
    }
    
    const onCloseHistory = () => {
        setOpenHistory(false)
        setLineEdit(undefined)
    }
    
    return (
        <Stack spacing={2}>
            <TabSectionCardHeader icon={Sparkle}
                                  sectionTitle={'Líneas destacadas'}
                                  actions={renderAction()}
            />
            <TableList<ProductLineInternalSelected> entityList={selectedLines}
                                                    columns={columns}
                                                    isLoading={loading}
                                                    error={false}
                                                    keepBorderRadius
            />
            <DrawerInternalSelectedLines open={open}
                                         onClose={onClose}
                                         selectedLine={lineEdit}
                                         onReload={loadSelectedLines}
            />
            <DialogSelectedLinesPreview open={openPreview}
                                        onClose={() => setOpenPreview(false)}
            />
            <DialogProposalLinesApply open={openApply}
                                      onClose={() => setOpenApply(false)}
                                      onReload={loadSelectedLines}
            />
            {
                lineEdit &&
                <DialogHistoryLine open={openHistory}
                                   onClose={onCloseHistory}
                                   selectedLine={lineEdit}
                />
            }
        </Stack>
    )
}


export default SelectedLinesList