import {Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, Grid, Skeleton, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {CompanySectionsWithFileTypeFields} from "types/company/companyData";
import {TypographyBase} from "components/misc/TypographyBase";
import {CompanyFileType} from "types/company/companyEnums";
import {HttpCacheSections} from "http/cache/httpCacheSections";
import {EntityWithIdAndDescription} from "types/baseEntities";

interface CompanyFileExportDialogProps {
    open: boolean,
    companyFileType: CompanyFileType,
    onClose: () => void,
    onSubmit: (codsSections: number[]) => void
}

function CompanyFileExportDialog({ open, companyFileType, onClose, onSubmit }: CompanyFileExportDialogProps) {
    const [options, setOptions] = useState<EntityWithIdAndDescription[]>();
    const [selectedValues, setSelectedValues] = useState<number[]>([]);

    const handleCheckboxChange = (id: number) => {
        setSelectedValues((prevValues) =>
            prevValues.includes(id)
                ? prevValues.filter((val) => val !== id)
                : [...prevValues, id]
        );
    };
    
    const handleClose = () => {
        onClose();
        setSelectedValues([]);
    }

    const handleSelectAll = () => {
        if (options && options.length > 0) {
            const allIds = options.map((option) => option[CompanySectionsWithFileTypeFields.Id]);
            setSelectedValues(selectedValues.length === allIds.length ? [] : allIds);
        }
    };
    
    const handleSubmit = () => {
        onSubmit(selectedValues);
        setSelectedValues([]);
    }

    useEffect(() => {
        if (open && companyFileType) 
            HttpCacheSections.getByCompanyFileType(companyFileType)
                .then(setOptions)
    }, [open, companyFileType]);
    
    return (
        <Dialog open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
        >
            <BaseDialogTitle onClose={handleClose} title="Exportar Legajo" />
            <DialogContent>
                <Grid container spacing={3}>
                    {
                        options ?
                            options.length !== 0 ?
                                options.map((option) => (
                                    <Grid item md={6} xs={12} alignContent={'center'} key={option[CompanySectionsWithFileTypeFields.Id]}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Checkbox
                                                checked={selectedValues.includes(option[CompanySectionsWithFileTypeFields.Id])}
                                                onChange={() => handleCheckboxChange(option[CompanySectionsWithFileTypeFields.Id])}
                                            />
                                            <TypographyBase variant={"button2"}>
                                                {option[CompanySectionsWithFileTypeFields.Description]}
                                            </TypographyBase>
                                        </Stack>
                                    </Grid>
                                ))
                                :
                                <Alert severity="info">Al parecer no hay datos para exportar</Alert>
                            :
                            Array.from({length: 4}).map((_, idx) => <Grid item md={6} xs={12} key={idx}><Skeleton  /></Grid>)
                    }

                    {
                        options && options.length !== 0 &&
                        <Grid item xs={12}>
                            <Button variant="text" onClick={handleSelectAll}>
                                {'Seleccionar Todo'}
                            </Button>
                        </Grid>
                    }
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button variant="contained" fullWidth onClick={handleSubmit} disabled={selectedValues.length === 0}>
                    Exportar como Excel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CompanyFileExportDialog;