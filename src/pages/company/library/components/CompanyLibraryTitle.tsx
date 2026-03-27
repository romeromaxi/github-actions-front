import React, {useState} from "react";
import {Folders} from "@phosphor-icons/react";
import {Card, CardContent, Stack} from "@mui/material";
import {BaseIconWrapper} from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";
import {AddButton, ShareButton} from "components/buttons/Buttons";
import FileNewDialog from "components/files/NewFileDialog";
import SharedDocumentationRelateFilesDialog from "../../../sharedDocumentation/SharedDocumentationRelateFilesDialog";

interface CompanyLibraryTitleProps {
    companyId: number,
    onReload: () => void
}

function CompanyLibraryTitle(props: CompanyLibraryTitleProps) {
    const [openNewFile, setOpenNewFile] = useState<boolean>(false);
    const [openShareFiles, setOpenShareFiles] = useState<boolean>(false);

    const handleOpenNew = () => setOpenNewFile(true)

    const onCloseDialog = () => setOpenNewFile(false)
    
    const handleOpenShare = () => setOpenShareFiles(true)
    
    const onCloseShare = () => setOpenShareFiles(false)
    
    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <BaseIconWrapper Icon={Folders} size={'md'} bg={'#F7FAFC'}/>
                            <Stack>
                                <TypographyBase variant={'h4'} fontWeight={500}>
                                    Mis documentos
                                </TypographyBase>
                                <TypographyBase variant={'caption'} color={'text.lighter'} fontWeight={500}>
                                    Gestioná toda la documentación de tu empresa en un solo lugar
                                </TypographyBase>
                            </Stack>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <ShareButton variant='outlined'
                                         color={'secondary'}
                                         size='small' 
                                         onClick={handleOpenShare}>
                                Compartir
                            </ShareButton>
                            <AddButton size='small' onClick={handleOpenNew}>Nuevo Documento</AddButton>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {
                openNewFile &&
                    <FileNewDialog
                        companyId={props.companyId}
                        onCloseDialog={onCloseDialog}
                        onReload={props.onReload}
                    />
            }
            <SharedDocumentationRelateFilesDialog companyId={props.companyId}
                                                  onClose={onCloseShare}
                                                  open={openShareFiles}
            />
        </React.Fragment>
    )
}

export default CompanyLibraryTitle;