import {useContext, useEffect, useState} from "react";
import {Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, Grid, Skeleton, Stack} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {HttpCacheCompany} from "http/index";
import {EntityWithIdAndDescription, EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {useForm} from "react-hook-form";
import {TypographyBase} from "components/misc/TypographyBase";
import {PersonRelationshipFilter, PersonRelationshipFilterFields} from "types/person/personData";
import {RelatedPersonContext} from "hooks/contexts/RelatedPersonContext";


interface RelatedPersonExportDialogProps {
    open: boolean;
    onClose: () => void;
    legalPerson?: boolean;
}


const RelatedPersonExportDialog = ({open, onClose, legalPerson}: RelatedPersonExportDialogProps) => {
    const {handleExportLst} = useContext(RelatedPersonContext);
    const [options, setOptions] = useState<EntityWithIdAndDescription[]>();
    const [selectedValues, setSelectedValues] = useState<number[]>([]);
    const {handleSubmit} = useForm();

    useEffect(() => {
        if (open) {
            const callbackRelationshipTypes = legalPerson
                ? HttpCacheCompany.getRelationshipTypesLegal
                : HttpCacheCompany.getRelationshipTypesPhysical;

            callbackRelationshipTypes()
                .then(response => {
                    setSelectedValues(response.map(rel => rel[EntityWithIdFields.Id]));
                    setOptions(response);
                });
        }
    }, [open, legalPerson]);

    const handleCheckboxChange = (id: number) => {
        setSelectedValues((prevValues) =>
            prevValues.includes(id)
                ? prevValues.filter((val) => val !== id)
                : [...prevValues, id]
        );
    };

    const handleSelectAll = () => {
        if (options && options.length > 0) {
            const allIds = options.map((option) => option[EntityWithIdAndDescriptionFields.Id]);
            setSelectedValues(selectedValues.length === allIds.length ? [] : allIds);
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedValues([]);
    };

    const onSubmit = () => {
        const filter: PersonRelationshipFilter = {
            [PersonRelationshipFilterFields.ListRelationshipTypes]: selectedValues
        };
        handleExportLst(filter).then(() => {
            handleClose();
        });
    };

    return (
        <Dialog open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
        >
            <BaseDialogTitle onClose={handleClose} title="Exportar Datos"/>
            <DialogContent>
                <Grid container spacing={3}>
                    {
                        options ?
                            options.length !== 0 ?
                                options.map((option) => (
                                    <Grid item md={6} xs={12} alignContent={'center'} key={option[EntityWithIdAndDescriptionFields.Id]}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Checkbox
                                                checked={selectedValues.includes(option[EntityWithIdAndDescriptionFields.Id])}
                                                onChange={() => handleCheckboxChange(option[EntityWithIdAndDescriptionFields.Id])}
                                            />
                                            <TypographyBase variant={"button2"}>
                                                {option[EntityWithIdAndDescriptionFields.Description]}
                                            </TypographyBase>
                                        </Stack>
                                    </Grid>
                                ))
                                :
                                <Alert severity="info">Al parecer no hay datos para exportar</Alert>
                            :
                            Array.from({length: 4}).map((_, idx) => <Grid item md={6} xs={12}
                                                                          key={idx}><Skeleton/></Grid>)
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
                <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}
                        disabled={selectedValues.length === 0}>
                    Exportar como Excel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RelatedPersonExportDialog;
