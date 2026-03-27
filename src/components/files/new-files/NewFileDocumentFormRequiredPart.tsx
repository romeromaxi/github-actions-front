import React, {useContext, useEffect, useMemo, useState} from "react";
import {useFormContext} from "react-hook-form";
import {
    NewFileDocumentFormContext,
    NewFileDocumentFormContextType,
    NewFileDocumentFormPartProps
} from "../NewFileDocumentForm";
import {Button, Grid} from "@mui/material";
import {ControlledTextFieldFilled} from "components/forms";
import {DocumentFields} from "types/files/filesData";
import {CompanySectionsWithFileType, CompanySectionsWithFileTypeFields} from "types/company/companyData";
import {EntityWithIdAndDescription} from "types/baseEntities";
import NewFileDocumentFormPartTitle from "./NewFileDocumentFormPartTitle";
import SectionRelatedDrawer from "../../misc/SectionRelatedDrawer";
import {PersonTypes} from "../../../types/person/personEnums";

interface SpecificSectionDataType {
    relatedDataLabel?: string;
    alertText?: string;
    isLegalPerson: boolean;
}

function NewFileDocumentFormRequiredPart({ step, companyId }: NewFileDocumentFormPartProps) {
    const methods = useFormContext();
    const { 
        section, fileType, getFileSections, getRelatedData, sectionHasRelatedData, setSectionHasRelatedData,
        isSectionCompanyRepository, setIsSectionCompanyRepository
    } = useContext<NewFileDocumentFormContextType>(NewFileDocumentFormContext);
    const watchSection = methods.watch(DocumentFields.FileSectionCode);
    const titleStep = useMemo(() =>
        (section || !isSectionCompanyRepository) ? 
            "Ponele título" : 
            "Ponele título y relacionalo con una sección y una subsección temática de LUC"
        , [section, isSectionCompanyRepository]);

    const [firstRender, setFirstRender] = useState<boolean>(true); 
    const [sections, setSections] = useState<CompanySectionsWithFileType[]>();
    const [fileTypes, setFileTypes] = useState<EntityWithIdAndDescription[]>([]);
    const [relatedData, setRelatedData] = useState<EntityWithIdAndDescription[]>([]);
    const [openNewEntity, setOpenNewEntity] = useState<boolean>(false);

    const specificSectionData: SpecificSectionDataType = useMemo(() => {
        const defaultSection: SpecificSectionDataType = { 
            relatedDataLabel: undefined, alertText: undefined, isLegalPerson: false 
        };
        
        if (!!section) return defaultSection;
        
        const currentSection = sections?.find((s) => s[CompanySectionsWithFileTypeFields.Id] === watchSection)
        
        if (!currentSection) return defaultSection;
        
        let sectionData: SpecificSectionDataType = { ...defaultSection };
        
        if (currentSection[CompanySectionsWithFileTypeFields.HasRelatedData]) {
            sectionData.relatedDataLabel = currentSection[CompanySectionsWithFileTypeFields.RelatedDataLabel] ?? 'Datos Relacionados';
        }
        
        if (!!currentSection[CompanySectionsWithFileTypeFields.PersonTypeCode])
            sectionData.isLegalPerson = currentSection[CompanySectionsWithFileTypeFields.PersonTypeCode] === PersonTypes.Legal;
        
        return sectionData;
    }, [watchSection, section, sections]);
    
    useEffect(() => {
        if (!sections && !!getFileSections) {
            getFileSections()
                .then((responseSection) => {
                    if (!section) {
                        setSections(responseSection.filter(s => s[CompanySectionsWithFileTypeFields.IsSectionCompanyRepository]));
                        if (watchSection) {
                            const sec = responseSection?.find((s) => s[CompanySectionsWithFileTypeFields.Id] === watchSection)
                            setFileTypes(sec?.[CompanySectionsWithFileTypeFields.FileTypes] ?? []);

                            setIsSectionCompanyRepository(
                                !!responseSection.find(x => x[CompanySectionsWithFileTypeFields.Id] === watchSection)?.esSeccionEmpresaRepositorio
                            )
                            setSectionHasRelatedData(
                                !!responseSection.find(x => x[CompanySectionsWithFileTypeFields.Id] === watchSection)?.tieneDatosRelacionados
                            )
                        }
                    } else {
                        setIsSectionCompanyRepository(
                            !!responseSection.find(x => x[CompanySectionsWithFileTypeFields.Id] === section)?.esSeccionEmpresaRepositorio
                        )
                    }
                })
                .finally(() => setFirstRender(false));
        } else {
            setFirstRender(false);
        }
    }, []);
    
    const onCloseNewEntity = () => setOpenNewEntity(false)
    
    useEffect(() => {
        if (!firstRender) {
            if (watchSection) {
                const sec = sections?.find((s) => s[CompanySectionsWithFileTypeFields.Id] === watchSection)
                setFileTypes(sec?.[CompanySectionsWithFileTypeFields.FileTypes] ?? []);
                if (!fileType) {
                    methods.setValue(DocumentFields.FileTypeCode, 0);
                    methods.setValue(DocumentFields.RelatedId, 0);
                }
                
                if (sec?.[CompanySectionsWithFileTypeFields.HasRelatedData] && getRelatedData) {
                    getRelatedData(watchSection).then(setRelatedData)
                } else {
                    setRelatedData([]);
                }
                setSectionHasRelatedData((!!sec?.[CompanySectionsWithFileTypeFields.HasRelatedData]) && !!getRelatedData);
                setIsSectionCompanyRepository(!!sec?.[CompanySectionsWithFileTypeFields.IsSectionCompanyRepository]);
            } else {
                methods.setValue(DocumentFields.FileTypeCode, 0);
                setFileTypes([]);
                setRelatedData([]);
            }
        } else {
            if (watchSection && getRelatedData)
                getRelatedData(watchSection).then(setRelatedData)
            
            if (watchSection && sections) 
                setIsSectionCompanyRepository(!!sections.find(x => x[CompanySectionsWithFileTypeFields.Id] === watchSection)?.esSeccionEmpresaRepositorio);
        }
    }, [watchSection]);
    
    const reloadRelatedData = () => {
        if (watchSection && getRelatedData) getRelatedData(watchSection).then(setRelatedData);
    }
    
    return (
        <Grid item xs={12} container spacing={1}>
            <Grid item xs={12}>
                <NewFileDocumentFormPartTitle label={titleStep}
                                              step={step}
                />
            </Grid>
            
            <Grid item xs={12}>
                <ControlledTextFieldFilled label="Título" 
                                           name={DocumentFields.TitleDocument} 
                                           control={methods.control} 
                                           required
                                           fullWidth
                />
            </Grid>

            {
                isSectionCompanyRepository &&
                <React.Fragment>
                    {
                        !section &&
                        <Grid item xs={12} md={4}>
                            <ControlledTextFieldFilled label={'Sección'}
                                                       control={methods.control} 
                                                       options={sections} 
                                                       name={DocumentFields.FileSectionCode} 
                                                       select
                                                       required
                            />
                        </Grid>
                    }
        
                    {
                        !fileType &&
                        <Grid item xs={12} md={4}>
                            <ControlledTextFieldFilled label={'Subsección'}
                                                       control={methods.control}
                                                       options={fileTypes || []}
                                                       name={DocumentFields.FileTypeCode}
                                                       disabled={!fileTypes || fileTypes.length <= 1}
                                                       select
                                                       required
                                                       fullWidth
                            />
                        </Grid>
                    }
                    {
                        (!fileType && sectionHasRelatedData) &&
                        <Grid item xs={12} md={4}>
                            <ControlledTextFieldFilled label={specificSectionData.relatedDataLabel}
                                                       control={methods.control}
                                                       options={relatedData}
                                                       name={DocumentFields.RelatedId}
                                                       select
                                                       required
                            />
                            
                            <Button size={'extra-small'}
                                    onClick={() => setOpenNewEntity(true)}
                            >
                                Si no encontrás el dato, creá uno nuevo
                            </Button>
                        </Grid>
                    }
                </React.Fragment>
            }
            
            {
                !!watchSection && companyId && sectionHasRelatedData &&
                    <SectionRelatedDrawer section={watchSection}
                                          open={openNewEntity}
                                          onClose={onCloseNewEntity}
                                          companyId={companyId}
                                          isLegalPerson={specificSectionData.isLegalPerson}
                                          onReloadRelatedData={reloadRelatedData}
                    />
            }
        </Grid>
    )
}

export default NewFileDocumentFormRequiredPart;