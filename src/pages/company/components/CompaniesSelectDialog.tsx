import {CompanyViewDTO, CompanyViewDTOFields} from "../../../types/company/companyData";
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import BaseDialogTitle from "../../../components/dialog/BaseDialogTitle";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {Skeleton} from "@mui/lab";
import {EntityWithIdFields} from "../../../types/baseEntities";
import React, {useState} from "react";
import {ShoppingBagListItem} from "../../markets/lines/shoppingbag/components/ShoppingBagListItem";


interface CompaniesSelectDialogProps {
    open: boolean,
    onClose: () => void,
    title: string,
    companies?: CompanyViewDTO[],
    onSelect: (companyId: number) => void,
    onReloadCompanies: () => void
}


const CompaniesSelectDialog = ({open, onClose, companies, onSelect, title, onReloadCompanies} : CompaniesSelectDialogProps) => {
    const [uniqueIdx, setUniqueIdx] = useState<number>(-1)
    
    const handleListItemClick = (index: number, checked: boolean | null) => {
        setUniqueIdx(index)
    }
    
    const handleOnClick = () => onSelect(companies?.[uniqueIdx][EntityWithIdFields.Id] ?? 0)
    
    const handleClose = () => {
        onClose();
        setUniqueIdx(-1);
    }
    
    return (
        <Dialog
            open={open}
            maxWidth={'sm'}
            fullWidth
            onClose={handleClose}
        >
            <BaseDialogTitle onClose={handleClose} title={title} />
            <DialogContent>

                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <List component="nav" aria-label="secondary mailbox folder" sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {!companies && <Skeleton />}

                        {companies?.map((company, idx) => (
                            <ShoppingBagListItem
                                companyId={company[EntityWithIdFields.Id]}
                                businessName={company[CompanyViewDTOFields.BusinessName]}
                                companyPersonType={company[CompanyViewDTOFields.PersonTypeCode]}
                                onClick={(selected) => handleListItemClick(idx, selected)}
                                selected={uniqueIdx === idx}
                                key={`companyListItem_${idx}`}
                                hasPermissions={company[CompanyViewDTOFields.AllowFullAccess]}
                                allowChoose={company[CompanyViewDTOFields.AllowFullAccess]}
                            />
                        ))}

                    </List>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button variant={'contained'}
                        onClick={handleOnClick}
                        disabled={uniqueIdx < 0}
                        fullWidth
                >
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default CompaniesSelectDialog