import FileNewDialog from "../../../../../components/files/NewFileDialog";
import React, {useCallback, useContext, useMemo} from "react";
import {useSnackbarActions} from "../../../../../hooks/useSnackbarActions";
import {HttpOcr} from "../../../../../http/general/httpOcr";
import useAxios from "../../../../../hooks/useAxios";
import { BalancesSourceType } from "hooks/contexts/BalancesContext";
import {OffererContext} from "../../../../offerer/components/OffererContextProvider";
import {EntityWithIdFields} from "types/baseEntities";
import { Sections } from 'types/general/generalEnums';
import {FileBase, FileBaseFields} from "../../../../../types/files/filesData";
import {BalancesContext} from "../../../../../hooks/contexts/BalancesContext";
import {
    FinancialStatementOCRProcess,
    FinancialStatementOCRProcessFields
} from "../../../../../types/general/generalFinanceData";

interface FinancialStatementIASelectedFileProps {
    open: boolean,
    type: 'standard' | 'dynamic',
    dataId?: number | string;
    dataSource?: BalancesSourceType;
    financialId: number;
    onClose: () => void;
    onSubmit: () => void;
}

function FinancialStatementIASelectedFile({ open, type, dataId, dataSource, financialId, onClose, onSubmit }: FinancialStatementIASelectedFileProps) {
    const offerer = useContext(OffererContext)
    const { onUploadOcrFile } = useContext(BalancesContext);
    const { addSnackbarWarning, addSnackbarSuccess } = useSnackbarActions();
    const { fetchData } = useAxios();
    
    const companyId = useMemo(() => {
        if (dataSource === BalancesSourceType.Company) return dataId as number
        return undefined
    }, [dataId, dataSource]);

    const solicitationId = useMemo(() => {
        if (dataSource === BalancesSourceType.Solicitation) return dataId as number
        return undefined
    }, [dataId, dataSource]);

    const offererId = useMemo(() => {
        if (dataSource === BalancesSourceType.ClientPortfolio || dataSource === BalancesSourceType.Solicitation)
            return offerer[EntityWithIdFields.Id]

        return undefined
    }, [dataSource, offerer]);

    const clientPortfolioGuid = useMemo(() => {
        if (dataSource === BalancesSourceType.ClientPortfolio) return dataId as string

        return undefined
    }, [dataId, dataSource]);
    
    const section = useMemo(() => {
        switch (dataSource) {
            case BalancesSourceType.Company: return Sections.FinancialYear
            case BalancesSourceType.Solicitation: return Sections.Solicitations
            case BalancesSourceType.ClientPortfolio: return Sections.ClientPortfolio
        }
    }, [dataSource])
    
    const handleSubmitFromLibrary = useCallback((docIdLst: number[]) => {
        if (docIdLst.length !== 1)
            addSnackbarWarning('Selecciona solo un archivo para analizar con IA')
        else {
            const docId = docIdLst[0]

            const ocrProcessData : FinancialStatementOCRProcess = {
                [FinancialStatementOCRProcessFields.SectionCode]: section || Sections.ClientPortfolio,
                [FinancialStatementOCRProcessFields.RelatedId]: financialId,
            }

            const promiseToFetch = type === 'standard' ?
                () => HttpOcr.processDocumentById(docId, ocrProcessData) :
                () => HttpOcr.processDocumentByIdDynamic(docId, ocrProcessData);

            fetchData(
                promiseToFetch,
                true
            )
                .then(() => {
                    addSnackbarSuccess("El documento fue enviado a procesar con éxito");
                    onSubmit();
                })
        }
    }, [type, section])
    
    const handleSubmitFile = async (
        newFileBase: FileBase,
        file: File
    ) => {
        await onUploadOcrFile(financialId, newFileBase, file);
        const ocrProcessData : FinancialStatementOCRProcess = {
            [FinancialStatementOCRProcessFields.SectionCode]: section || Sections.ClientPortfolio,
            [FinancialStatementOCRProcessFields.RelatedId]: financialId,
        }

        const promiseToFetch = type === 'standard' ?
            () => HttpOcr.processDocumentById(newFileBase[FileBaseFields.DocumentId], ocrProcessData) :
            () => HttpOcr.processDocumentByIdDynamic(newFileBase[FileBaseFields.DocumentId], ocrProcessData);

        fetchData(
            promiseToFetch,
            true
        )
            .then(() => {
                addSnackbarSuccess("El documento fue enviado a procesar con éxito");
                onSubmit();
            })
        return Promise.resolve()
    }
    
    return (
        <React.Fragment>
            {
                open &&
                    <FileNewDialog title={'Asistente de carga de EECC con Inteligencia Artificial'}
                                   subtitle='Subí el archivo del estado contable o relacionalo desde LUC (biblioteca o LUFE) para procesar y extraer los datos mediante inteligencia artificial'
                                   onCloseDialog={onClose}
                                   onSubmitDialog={handleSubmitFile}
                                   companyId={companyId}
                                   solicitationId={solicitationId}
                                   offererId={offererId}
                                   clientPortfolioGuid={clientPortfolioGuid}
                                   section={section}
                                   onReload={onSubmit}
                                   blockSection
                                   allowFromLibrary
                                   buttonTxt={'Procesar'}
                                   onSubmitFromLibrary={handleSubmitFromLibrary}
                    />
            }
        </React.Fragment>
    )
}

export default FinancialStatementIASelectedFile;