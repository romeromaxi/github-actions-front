import {MarketCategoryNode, MenuMarketCategoryNode} from "../MenuMarketCategories";
import {Button, Dialog, DialogContent, Stack} from "@mui/material";
import BaseDialogTitle from "../../dialog/BaseDialogTitle";
import React from "react";
import {useNavigate} from "react-router-dom";


interface MenuHomeMarketLinksAsDialogProps {
    open: boolean,
    onClose: () => void,
    tree?: MarketCategoryNode[],
    onNavigate: (path: string) => void;
}


const MenuHomeMarketLinksAsDialog = ({open, onClose, tree, onNavigate} : MenuHomeMarketLinksAsDialogProps) => {
    const navigate = useNavigate()
    
    return (
        <Dialog maxWidth={'md'}
                fullWidth
                open={open}
                onClose={onClose}
        >
            <BaseDialogTitle onClose={onClose} title={'Nuestros productos'} subtitle={'Presioná la categoría que busques para navegar'}/>
            <DialogContent>
                <Stack direction={'row'} spacing={3} p={'0.2rem 1.1rem'}>
                    {tree?.map((categoryNode) => (
                        <MenuMarketCategoryNode
                            node={categoryNode}
                            leaf={0}
                            onNavigate={onNavigate}
                        />
                    ))}
                </Stack>
                {
                    !window.location.toString().includes('landing') &&
                    <Stack direction={'row-reverse'} sx={{width: '100%'}}>
                        <Button variant={'text'} size={'small'} sx={{fontSize: '1.3rem !important'}} onClick={() => navigate('/market/landing')}>
                            Ir a la tienda
                        </Button>
                    </Stack>
                }
            </DialogContent>
        </Dialog>
    )
}


export default MenuHomeMarketLinksAsDialog