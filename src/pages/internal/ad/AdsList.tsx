import {Stack} from "@mui/material";
import React, {useEffect, useState} from "react";
import {HttpAds} from "../../../http/ad/httpAds";
import {AdViewDetail, AdViewDetailFields} from "../../../types/ad/adData";
import {AddButton, ButtonIconDropdown, SearchButton, SendButton} from "../../../components/buttons/Buttons";
import {ITableColumn, TableColumnType, TableList} from "../../../components/table";
import AdDrawer from "./AdDrawer";
import AdsPreviewDialog from "./AdsPreviewDialog";
import AdsApplyDialog from "./AdsApplyDialog";
import {WrapperIcons} from "../../../components/icons/Icons";
import {Pencil} from "phosphor-react";
import {MagnifyingGlass} from "@phosphor-icons/react";
import AdsHistoryDrawer from "./AdsHistoryDrawer";


const AdsList = () => {
    const [ads, setAds] = useState<AdViewDetail[]>()
    const [adDetail, setAdDetail] = useState<AdViewDetail>()
    const [open, setOpen] = useState<boolean>(false)
    const [openPreview, setOpenPreview] = useState<boolean>(false)
    const [openApply, setOpenApply] = useState<boolean>(false)
    const [openHistory, setOpenHistory] = useState<boolean>(false)
    const onOpenNew = () => setOpen(true)
    
    const onOpenEdit = (ad: AdViewDetail) => {
        setOpen(true)
        setAdDetail(ad)
    }
    
    const onOpenHistory = (ad: AdViewDetail) => {
        setOpenHistory(true)
        setAdDetail(ad)
    }
    const onCloseNew = () => {
        setOpen(false)
        setAdDetail(undefined)
    }
    
    const loadAds = () => {
        HttpAds.search().then(setAds)
    }
    
    useEffect(() => {
        loadAds()
    }, []);
    
    const columns: ITableColumn[] = [
        {label: 'Encabezado', value: AdViewDetailFields.ProposalHeader},
        {label: 'Título', value: AdViewDetailFields.ProposalDescription},
        {label: 'Detalle', value: AdViewDetailFields.ProposalDetail, textAlign: 'left'},
        {label: 'Nombre botón', value: AdViewDetailFields.ProposalButtonName, textAlign: 'left'},
        {label: 'Ubicación', value: AdViewDetailFields.AdLocationTypeDesc},
        {label: 'Orden', value: AdViewDetailFields.Order},
        {label: 'Activa', value: AdViewDetailFields.Active, type: TableColumnType.Boolean},
        {label: 'Orden propuesta', value: AdViewDetailFields.ProposalOrder},
        {label: 'Activa propuesta', value: AdViewDetailFields.ProposalActive, type: TableColumnType.Boolean},
        {label: '', onRenderCell: (ent: AdViewDetail) => 
            <ButtonIconDropdown label={''}
                                items={[
                                    {label: 'Editar', icon: <WrapperIcons Icon={Pencil} size='sm' />, onClick: () => onOpenEdit(ent) },
                                    {label: 'Ver historial', icon: <WrapperIcons Icon={MagnifyingGlass} size='sm' />, onClick: () => onOpenHistory(ent) }
                                ]}
                                size='small'
            />
        }
    ]


    const renderAction = () => {
        return (
            <Stack spacing={2} direction='row' alignItems='center'>
                <SearchButton size="small" onClick={() => setOpenPreview(true)} 
                              variant="outlined"
                              color={'secondary'}
                              disabled={!ads || ads.length === 0}>
                    Vista previa
                </SearchButton>
                <SendButton size="small" onClick={() => setOpenApply(true)} 
                            variant="outlined"
                            color={'secondary'}
                            disabled={!ads || ads.length === 0}>
                    Aplicar
                </SendButton>
                <AddButton size="small" onClick={onOpenNew}>Nueva</AddButton>
            </Stack>
        )
    }
    
    const onCloseHistory = () => {
        setOpenHistory(false)
        setAdDetail(undefined)
    }
    
    return (
        <Stack spacing={3}>
            <TableList entityList={ads}
                       columns={columns}
                       isLoading={!ads}
                       error={false}
                       title='Publicidades'
                       action={renderAction()}
            />
            <AdDrawer open={open}
                      onClose={onCloseNew}
                      onReload={loadAds}
                      adToEdit={adDetail}
            />
            <AdsPreviewDialog open={openPreview}
                              onClose={() => setOpenPreview(false)}
            />
            <AdsApplyDialog open={openApply}
                            onClose={() => setOpenApply(false)}
                            onReload={loadAds}
            />
            {
                !!adDetail &&
                <AdsHistoryDrawer open={openHistory}
                                  onClose={onCloseHistory}
                                  adDetail={adDetail}
                />
            }
        </Stack>
    )
}


export default AdsList