import React, {useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Stack,
    Card,
    Button,
    Tooltip, IconButton,
} from '@mui/material';
import {CompanyFinanceHeader, CompanyFinanceHeaderFields} from 'types/company/companyFinanceInformationData';
import {EntityWithIdFields} from 'types/baseEntities';
import {TypographyBase} from 'components/misc/TypographyBase';
import FileNewButton from 'components/files/FileNewButton';
import {Sections} from 'types/general/generalEnums';
import {FileBase} from 'types/files/filesData';
import {HttpFilesCompanyDeclarationAssets} from 'http/index';
import {ChevronDownIcon, SaveIcon, ShareIcon, TrashIcon} from 'lucide-react';
import {dateFormatter} from 'util/formatters/dateFormatter';
import CompanyDeclarationOfAssetsEditCard from './CompanyDeclarationOfAssetsEditCard';
import DeclarationOfAssetsDocumentList from './DeclarationOfAssetsDocumentList';
import {useAction} from 'hooks/useAction';
import {HttpCompanyDeclarationOfAssets} from 'http/index';
import {downloadFileBlobHelper} from 'util/helpers';
import {DialogAlert} from 'components/dialog';

interface DeclarationOfAssetsAccordionProps {
    declarationOfAssets: CompanyFinanceHeader;
    reloadTable: () => void;
    onDelete: (declarationOfAssets: CompanyFinanceHeader) => void;
}

function DeclarationOfAssetsAccordion({
                                          declarationOfAssets,
                                          reloadTable,
                                          onDelete
                                      }: DeclarationOfAssetsAccordionProps) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
    const [reloadDocsKey, setReloadDocsKey] = useState<number>(0);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [resetHandler, setResetHandler] = useState<(() => void) | undefined>();
    const {snackbarSuccess} = useAction();

    const declarationId: number = declarationOfAssets[EntityWithIdFields.Id];
    const companyFinanceHeaderId: number = declarationOfAssets[CompanyFinanceHeaderFields.CompanyId];

    const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        if (!isExpanded && isDirty) {
            setShowUnsavedDialog(true);
            return;
        }

        setExpanded(isExpanded);
    };

    const handleExportClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        HttpCompanyDeclarationOfAssets.exportToExcel(companyFinanceHeaderId, declarationId)
            .then(downloadFileBlobHelper)
            .then(() => snackbarSuccess('Archivo descargado correctamente'));
    };

    const handleSaveChanges = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShouldSubmit(true);
    };

    const handleDialogSave = () => {
        setShouldSubmit(true);
        setShowUnsavedDialog(false);
    };

    const handleDialogDiscard = () => {
        resetHandler?.();
        setIsDirty(false);
        setShowUnsavedDialog(false);
        setExpanded(false);
    };

    const onSaveFile = (fileBase: FileBase, file: File) => {
        const savePromise = HttpFilesCompanyDeclarationAssets.insert(companyFinanceHeaderId, declarationId, fileBase, file);
        return savePromise.then(() => {
            setReloadDocsKey(prev => prev + 1);
        });
    };

    return (
        <Card variant={'accordionCompanyData'}>
            <Accordion variant={'companyData'}
                       expanded={expanded}
                       onChange={handleAccordionChange}
            >
                <AccordionSummary expandIcon={<ChevronDownIcon size={26} strokeWidth={'2px'} color={'black'}/>}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        spacing={2}
                    >
                        <TypographyBase fontWeight={600} maxLines={1} tooltip variant="h5">
                            {`Manifestación al ${dateFormatter.toShortDate(declarationOfAssets[CompanyFinanceHeaderFields.Date])}`}
                        </TypographyBase>
                        {expanded && (
                            <Stack direction="row" alignItems="center" spacing={2} pr={2}>
                                {!!onDelete && (
                                    <Tooltip title={'Eliminar'}>
                                        <IconButton
                                            color="secondary"
                                            variant="outlined"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(declarationOfAssets);
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
                    </Stack>
                </AccordionSummary>

                <AccordionDetails>
                    {expanded && (
                        <Stack spacing={3}>
                            <CompanyDeclarationOfAssetsEditCard
                                declarationOfAssetsHeader={declarationOfAssets}
                                onShowList={() => {
                                }}
                                onReloadTable={reloadTable}
                                expanded={true}
                                expandable={false}
                                shouldSubmit={shouldSubmit}
                                setShouldSubmit={setShouldSubmit}
                                onDirtyChange={setIsDirty}
                                onResetReady={setResetHandler}
                                onSaveSuccess={() => setExpanded(false)}
                            />

                            <Stack spacing={3}>
                                <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                                    <TypographyBase variant="h6" fontWeight={600}>
                                        Documentos relacionados
                                    </TypographyBase>
                                </Stack>
                                <DeclarationOfAssetsDocumentList
                                    declarationOfAssetsId={declarationId}
                                    reloadTable={reloadTable}
                                    reloadKey={reloadDocsKey}
                                />
                                <FileNewButton
                                    section={Sections.DeclarationOfAssets}
                                    onSaveFile={onSaveFile}
                                    onReload={reloadTable}
                                />
                            </Stack>
                        </Stack>
                    )}
                </AccordionDetails>
            </Accordion>

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

export default DeclarationOfAssetsAccordion;
