import {useEffect, useState} from "react";
import {Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, Grid, Stack} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {HttpCompany} from "http/index";
import {
    CompanyHomeGeneralDataExportForm, CompanyHomeGeneralDataExportFormFields,
    CompanySectionsWithFileType,
    CompanySectionsWithFileTypeFields
} from "types/company/companyData";
import {Skeleton} from "@mui/material";
import {useForm} from "react-hook-form";
import {TypographyBase} from "components/misc/TypographyBase";
import useAxios from "hooks/useAxios";


interface CompanyHomeGeneralDataExportDialogProps {
    open: boolean;
    onClose: () => void;
    companyId: number;
}


const CompanyHomeGeneralDataExportDialog = ({open, onClose, companyId} : CompanyHomeGeneralDataExportDialogProps) => {
    const [options, setOptions] = useState<CompanySectionsWithFileType[]>();
    const [selectedValues, setSelectedValues] = useState<number[]>([]);
    const { handleSubmit } = useForm<CompanyHomeGeneralDataExportForm>();
    const { fetchAndDownloadFile } = useAxios();

    useEffect(() => {
        HttpCompany.getFileSections(companyId).then((r) => setOptions(r.filter((o) => o[CompanySectionsWithFileTypeFields.IsSectionCompanyRepository])));
    }, []);

    const handleCheckboxChange = (id: number) => {
        setSelectedValues((prevValues) => 
            prevValues.includes(id) 
                ? prevValues.filter((val) => val !== id) 
                : [...prevValues, id]
        );
    };

    const handleSelectAll = () => {
        if (options && options.length > 0) {
            const allIds = options.map((option) => option[CompanySectionsWithFileTypeFields.Id]);
            setSelectedValues(selectedValues.length === allIds.length ? [] : allIds);
        }
    };
    
    const handleClose = () => {
        onClose();
        setSelectedValues([]);
    }
    
    const onSubmit = () => {
        const submitData: CompanyHomeGeneralDataExportForm = {
            [CompanyHomeGeneralDataExportFormFields.Sections]: selectedValues
        }
        fetchAndDownloadFile(
            () => HttpCompany.exportSectionsToExcel(companyId, submitData)
        ).then(() => {
            handleClose();
        })
    }
    
    return (
        <Dialog open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
        >
            <BaseDialogTitle onClose={handleClose} title="Exportar Datos" />
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
                <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)} disabled={selectedValues.length === 0}>
                    Exportar como Excel
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default CompanyHomeGeneralDataExportDialog;