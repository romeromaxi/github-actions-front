import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import moment from "moment/moment";
import {Grid} from "@mui/material";
import {ControlledTextFieldFilled} from "components/forms";
import {ControlledDatePicker} from "components/forms/ControlledDatePicker";
import {FileTypes} from "types/files/filesEnums";
import {DocumentFields} from "types/files/filesData";
import NewFileDocumentFormPartTitle from "./NewFileDocumentFormPartTitle";
import {NewFileDocumentFormPartProps} from "../NewFileDocumentForm";

interface VisibilityDatesState {
    fromDate: boolean,
    toDate: boolean,
    expirationDate: boolean,
    emissionDate: boolean,
}

function NewFileDocumentFormAdditionalPart({ step }: NewFileDocumentFormPartProps) {
    const methods = useFormContext();
    const watchTypeCode = methods.watch(DocumentFields.FileTypeCode);
    const todayDate = moment().toDate();

    const [startDate, setStartDate] = useState<Date>();
    const [visibilityDates, setVisibilityDates] = useState<VisibilityDatesState>({
        fromDate: false, toDate: false, expirationDate: false, emissionDate: false,
    });

    const changeVisibility = (typeCode: number | undefined) => {
        let newVisibilityDates = {
            fromDate: false, toDate: false, expirationDate: false, emissionDate: false,
        };

        if (!!typeCode) {
            switch (typeCode) {
                case FileTypes.Statute:
                    newVisibilityDates.fromDate = true;
                    newVisibilityDates.toDate = true;
                    break;

                default:
                    newVisibilityDates.expirationDate = true;
                    newVisibilityDates.emissionDate = true;
            }
        }

        setVisibilityDates(newVisibilityDates)
    };
    
    useEffect(() => {
        changeVisibility(watchTypeCode);
    }, [watchTypeCode]);
    
    return (
        <Grid container spacing={1} item xs={12}>
            <Grid item xs={12}>
                <NewFileDocumentFormPartTitle label={"Si te es útil, completá esta información adicional"}
                                              step={step}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <ControlledTextFieldFilled label="Descripción" 
                                           name={DocumentFields.DescriptionDocument} 
                                           control={methods.control} 
                                           fullWidth
                />
            </Grid>
            {
                visibilityDates.fromDate && (
                    <Grid item xs={12} sm={6} md={3}>
                        <ControlledDatePicker label="Fecha de Emisión" 
                                              control={methods.control} 
                                              maxDate={todayDate} 
                                              handleChange={(date: Date) => setStartDate(date)} 
                                              name={DocumentFields.FromDate} 
                                              filled
                        />
                    </Grid>
            )}
            {
                visibilityDates.toDate && (
                    <Grid item xs={12} sm={6} md={3}>
                        <ControlledDatePicker label="Fecha de Vencimiento" 
                                              control={methods.control} 
                                              minDate={startDate} 
                                              name={DocumentFields.ToDate} 
                                              filled
                        />
                    </Grid>
            )}
            {
                visibilityDates.emissionDate && (
                    <Grid item xs={12} sm={6} md={3}>
                        <ControlledDatePicker label="Fecha de Emisión" 
                                              control={methods.control} 
                                              maxDate={todayDate} 
                                              handleChange={(date: Date) => setStartDate(date)} 
                                              name={DocumentFields.EmissionDate} 
                                              filled
                        />
                    </Grid>
            )}
            {
                visibilityDates.expirationDate && (
                    <Grid item xs={12} sm={6} md={3}>
                        <ControlledDatePicker label="Fecha de Vencimiento" 
                                              control={methods.control} 
                                              minDate={startDate} 
                                              name={DocumentFields.ExpirationDate} 
                                              filled
                        />
                    </Grid>
            )}
            
        </Grid>
    )
}

export default NewFileDocumentFormAdditionalPart;