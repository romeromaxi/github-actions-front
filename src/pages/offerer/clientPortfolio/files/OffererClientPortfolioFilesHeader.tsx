import React, {useContext, useState} from "react";
import {Folders} from "@phosphor-icons/react";
import {Card, CardContent, Stack} from "@mui/material";
import {BaseIconWrapper} from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";
import {AddButton} from "components/buttons/Buttons";
import FileNewDialog from "components/files/NewFileDialog";
import {OffererContext} from "../../components/OffererContextProvider";
import {Sections} from "types/general/generalEnums";
import {BaseRequestFields, EntityWithIdFields} from "types/baseEntities";
import {DocumentToFileLinkRequestOfferer, DocumentToFileRequestLinkFields} from "types/files/filesData";
import {HttpFilesClientPortfolio} from "http/files/httpFilesClientPortfolio";
import useAxios from "hooks/useAxios";
import {useSnackbarActions} from "hooks/useSnackbarActions";

interface OffererClientPortfolioFilesHeaderProps {
    clientPortfolioGuid: string,
    onReload: () => void
}

function OffererClientPortfolioFilesHeader(props: OffererClientPortfolioFilesHeaderProps) {
    const offerer = useContext(OffererContext);
    const {fetchData} = useAxios();
    const {addSnackbarSuccess} = useSnackbarActions();
    const [openNewFile, setOpenNewFile] = useState<boolean>(false);

    const handleOpenNew = () => setOpenNewFile(true)

    const onCloseDialog = () => setOpenNewFile(false)

    const handleSaveFromLibrary = (docIdLst: number[]) => {
        const fileRequest: DocumentToFileLinkRequestOfferer = {
            [DocumentToFileRequestLinkFields.DocumentIdList]: docIdLst,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };

        fetchData(
            () => HttpFilesClientPortfolio.linkWithExistent(props.clientPortfolioGuid, fileRequest),
            true,
        )
            .then(() => {
                addSnackbarSuccess('Se relacionaron los archivos correctamente');
            })
            .finally(() => {
                onCloseDialog();
                props.onReload();
            });
    }
    
    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <BaseIconWrapper Icon={Folders} size={'md'} bg={'#F7FAFC'}/>
                            <Stack>
                                <TypographyBase variant={'h4'} fontWeight={500}>
                                    Documentos
                                </TypographyBase>
                            </Stack>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <AddButton size='small' onClick={handleOpenNew}>Nuevo Documento</AddButton>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {
                openNewFile &&
                    <FileNewDialog offererId={offerer[EntityWithIdFields.Id]} 
                                   clientPortfolioGuid={props.clientPortfolioGuid} 
                                   section={Sections.ClientPortfolio}
                                   onCloseDialog={onCloseDialog} 
                                   onReload={props.onReload}
                                   allowFromLibrary
                                   onSubmitFromLibrary={handleSaveFromLibrary}
                                   blockSection
                    />
            }
            
        </React.Fragment>
    )
}

export default OffererClientPortfolioFilesHeader;