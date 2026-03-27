import React, {useContext, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Stack,
    Card,
    Button, Tooltip, IconButton
} from '@mui/material';
import {PersonRelationship, PersonRelationshipFields} from 'types/person/personData';
import {EntityWithIdFields} from 'types/baseEntities';
import {stringFormatter} from 'util/formatters/stringFormatter';
import {TypographyBase} from 'components/misc/TypographyBase';
import RelatedPersonMultipleRelationshipDetail from './RelatedPersonMultipleRelationshipDetail';
import RelatedPersonDocumentList from './components/RelatedPersonDocumentList';
import {CompanyRelatedPersonTableContext} from './RelatedPersonTable';
import {RelatedPersonContext, RelatedPersonSourceType} from 'hooks/contexts/RelatedPersonContext';
import FileNewButton from 'components/files/FileNewButton';
import {Sections} from 'types/general/generalEnums';
import {FileBase} from 'types/files/filesData';
import {HttpFilesCompanyRelationship} from 'http/index';
import {LayoutHomeContext} from "../../../layouts/home/LayoutHome";
import {ChevronDownIcon, SaveIcon, SquareArrowOutUpRightIcon, ShareIcon, TrashIcon} from 'lucide-react';
import {PersonRelationshipTypeClassification} from 'types/company/companyEnums';
import {DialogAlert} from 'components/dialog';

interface RelatedPersonAccordionProps {
    relationship: PersonRelationship;
    legalPerson?: boolean;
    reloadTable: () => void;
    onDelete: (id: number) => void;
    isInverseRelationship?: boolean;
}

function RelatedPersonAccordion({
                                    relationship,
                                    legalPerson,
                                    reloadTable,
                                    onDelete,
                                    isInverseRelationship = false,
                                }: RelatedPersonAccordionProps) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
    const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [resetHandler, setResetHandler] = useState<(() => void) | undefined>();
    const [closeOnSave, setCloseOnSave] = useState<boolean>(false);
    const {allowsDocumentation, handleExport, dataSrc} = useContext(RelatedPersonContext);
    const {companyId} = useContext(LayoutHomeContext);

    const companyPersonId: number = relationship[EntityWithIdFields.Id];
    const personId: number = relationship[PersonRelationshipFields.PersonId];

    const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        if (!isExpanded && isDirty) {
            setShowUnsavedDialog(true);
            return;
        }

        setExpanded(isExpanded);
        if (isExpanded && !isLoadingDetail) {
            setIsLoadingDetail(true);
        }
    };

    const onSaveFile = (fileBase: FileBase, file: File) =>
        HttpFilesCompanyRelationship.insert(companyId, companyPersonId, fileBase, file);

    const handleSaveChanges = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCloseOnSave(false);
        setShouldSubmit(true);
    };

    const handleDialogSave = () => {
        setCloseOnSave(true);
        setShouldSubmit(true);
    };

    const handleDialogDiscard = () => {
        resetHandler?.();
        setIsDirty(false);
        setShowUnsavedDialog(false);
        setExpanded(false);
    };

    const handleAfterSave = () => {
        if (!closeOnSave) return;

        setIsDirty(false);
        setShowUnsavedDialog(false);
        setExpanded(false);
        setCloseOnSave(false);
    };

    const handleExportClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleExport(
            personId,
            relationship[PersonRelationshipFields.PersonRelationshipTypeClassificationCode] as PersonRelationshipTypeClassification
        );
    };
    
    const navigateToDetail = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (dataSrc === RelatedPersonSourceType.ClientPortfolio) {
            window.open(`/offerer/clientPortfolio/${relationship[PersonRelationshipFields.OriginEntityId]}`, '_blank')
        }
    }

    return (
        <Card variant={'accordionCompanyData'}>
            {
                isInverseRelationship ? (
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        spacing={2}
                    >
                        <Stack overflow="hidden" flex={1} spacing={0.75}>
                            <Stack direction="row" alignItems="end" spacing={1}>
                                <TypographyBase fontWeight={600} maxLines={1} tooltip variant="h5">
                                    {relationship[PersonRelationshipFields.LegalName]}
                                </TypographyBase>
                                {(() => {
                                    const roles = [];
                                    if (relationship[PersonRelationshipFields.PositionAuthorityDesc]) {
                                        roles.push(relationship[PersonRelationshipFields.PositionAuthorityDesc]);
                                    }
                                    if (relationship[PersonRelationshipFields.PositionEmployeeDesc]) {
                                        roles.push(relationship[PersonRelationshipFields.PositionEmployeeDesc]);
                                    }
                                    if (!!relationship[PersonRelationshipFields.ParticipationPercent] &&
                                        relationship[PersonRelationshipFields.ParticipationPercent] !== 0) {
                                        roles.push(`Socio ${relationship[PersonRelationshipFields.ParticipationPercent]}%`);
                                    }

                                    return roles.map((role, index) => (
                                        <TypographyBase key={index} variant="button3" color="text.secondary">
                                            {role}{index < roles.length - 1 ? ',' : ''}
                                        </TypographyBase>
                                    ));
                                })()}
                            </Stack>
                            <TypographyBase color="text.lighter" variant="body3">
                                {stringFormatter.formatCuit(relationship[PersonRelationshipFields.CUIT])}
                            </TypographyBase>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            {dataSrc === RelatedPersonSourceType.ClientPortfolio &&
                                relationship[PersonRelationshipFields.OriginEntityId] && (
                                    <Button size="small"
                                            startIcon={<SquareArrowOutUpRightIcon />}
                                            variant="outlined"
                                            color="secondary"
                                            onClick={navigateToDetail}
                                    >
                                        Navegar al detalle
                                    </Button>
                                )}
                        </Stack>
                    </Stack>
                ) : (
                    <Accordion
                        expanded={expanded}
                        variant={'companyData'}
                        onChange={handleAccordionChange}
                    >
                        <AccordionSummary expandIcon={<ChevronDownIcon size={26} strokeWidth={'2px'} color={'black'}/>}
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                                spacing={2}
                            >
                                <Stack overflow="hidden" flex={1} spacing={0.75}>
                                    <Stack direction="row" alignItems="end" spacing={1}>
                                        <TypographyBase fontWeight={600} maxLines={1} tooltip variant="h5">
                                            {relationship[PersonRelationshipFields.LegalName]}
                                        </TypographyBase>
                                        {(() => {
                                            const roles: string[] = [];
                                            if (relationship[PersonRelationshipFields.PositionAuthorityDesc]) {
                                                roles.push(relationship[PersonRelationshipFields.PositionAuthorityDesc]);
                                            }
                                            if (relationship[PersonRelationshipFields.PositionEmployeeDesc]) {
                                                roles.push(relationship[PersonRelationshipFields.PositionEmployeeDesc]);
                                            }
                                            if (!!relationship[PersonRelationshipFields.ParticipationPercent] &&
                                                relationship[PersonRelationshipFields.ParticipationPercent] !== 0) {
                                                roles.push(`Socio ${relationship[PersonRelationshipFields.ParticipationPercent]}%`);
                                            }

                                            return roles.map((role, index) => (
                                                <TypographyBase key={index} variant="button3" color="text.secondary">
                                                    {role}{index < roles.length - 1 ? ',' : ''}
                                                </TypographyBase>
                                            ));
                                        })() as React.ReactNode}
                                    </Stack>
                                    <TypographyBase color="text.lighter" variant="body3">
                                        {stringFormatter.formatCuit(relationship[PersonRelationshipFields.CUIT])}
                                    </TypographyBase>
                                </Stack>

                                {expanded && (
                                    <Stack direction="row" alignItems="center" spacing={3} pr={2}>
                                        {!!onDelete && (
                                            <Tooltip title={'Eliminar'}>
                                                <IconButton
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(companyPersonId);
                                                    }}
                                                    size={'small'}
                                                >
                                                    <TrashIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Button
                                            size="small"
                                            startIcon={<ShareIcon size={18}/>}
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleExportClick}
                                        >
                                            Exportar
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SaveIcon size={18}/>}
                                            onClick={handleSaveChanges}
                                        >
                                            Guardar cambios
                                        </Button>
                                    </Stack>
                                )}

                                {
                                    !expanded && (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {
                                                dataSrc === RelatedPersonSourceType.ClientPortfolio &&
                                                relationship[PersonRelationshipFields.OriginEntityId] && (
                                                    <Button size="small"
                                                            startIcon={<SquareArrowOutUpRightIcon />}
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={navigateToDetail}
                                                    >
                                                        Navegar al detalle
                                                    </Button>
                                                )
                                            }
                                        </Stack>
                                    )
                                }
                            </Stack>
                        </AccordionSummary>

                        <AccordionDetails>
                            {expanded && (
                                <CompanyRelatedPersonTableContext.Provider
                                    value={{
                                        reloadRelatedPerson: () => reloadTable(),
                                        editing: true,
                                    }}
                                >
                                    <Stack spacing={3}>
                                        <RelatedPersonMultipleRelationshipDetail
                                            relationship={relationship}
                                            legalPerson={legalPerson}
                                            reloadTable={reloadTable}
                                            isCollapsible
                                            shouldSubmit={shouldSubmit}
                                            setShouldSubmit={setShouldSubmit}
                                            onDirtyChange={setIsDirty}
                                            onResetReady={setResetHandler}
                                            onAfterSave={handleAfterSave}
                                        />

                                        {allowsDocumentation && (
                                            <Stack spacing={3}>
                                                <Stack direction="row" alignItems="center" spacing={1}
                                                       justifyContent="space-between">
                                                    <TypographyBase variant="h6" fontWeight={600}>
                                                        Documentos relacionados
                                                    </TypographyBase>
                                                </Stack>
                                                <RelatedPersonDocumentList
                                                    companyPersonId={companyPersonId}
                                                    reloadTable={reloadTable}
                                                />
                                                <FileNewButton
                                                    section={Sections.RelatedPerson}
                                                    onSaveFile={onSaveFile}
                                                    onReload={reloadTable}
                                                />
                                            </Stack>
                                        )}
                                    </Stack>
                                </CompanyRelatedPersonTableContext.Provider>
                            )}
                        </AccordionDetails>
                    </Accordion>        
                )
            }
            
            <DialogAlert
                open={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                onConfirm={handleDialogSave}
                onReject={handleDialogDiscard}
                textContent={'Tenés cambios sin guardar. ¿Querés guardarlos o descartarlos?'}
                textConfirm={'Guardar cambios'}
                textClose={'Descartar cambios'}
                persist
            />
        </Card>
    );
}

export default RelatedPersonAccordion;
