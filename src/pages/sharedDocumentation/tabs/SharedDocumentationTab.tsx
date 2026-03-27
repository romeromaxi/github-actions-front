import {Card, CardContent, Stack} from "@mui/material";
import {BaseIconWrapper} from "components/icons/Icons";
import {Files} from "@phosphor-icons/react";
import {TypographyBase} from "components/misc/TypographyBase";
import React, {useEffect, useState} from "react";
import {HttpSharedFiles} from "http/files/httpSharedFiles";
import {Document} from "types/files/filesData";
import FileDocumentList from "components/files/FileDocumentList";


interface SharedDocumentationTabProps {
    guid: string
}


const SharedDocumentationTab = ({guid} : SharedDocumentationTabProps) => {
    const [docs, setDocs] = useState<Document[]>();
    
    const getSharedDocs = () => {
        HttpSharedFiles.getDocsByGuid(guid).then(setDocs)
    }
    
    useEffect(() => {
        getSharedDocs()
    }, [guid]);
    
    return (
        <Stack spacing={2}>
            <Card>
                <CardContent>
                    <Stack direction='row' spacing={2} alignItems={'center'}>
                        <BaseIconWrapper Icon={Files} size={'md'} bg={'#F7FAFC'} />
                        <TypographyBase variant={'h4'} fontWeight={500}>
                            Documentos Compartidos
                        </TypographyBase>
                    </Stack>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <FileDocumentList filesDocument={docs}
                                      onReload={getSharedDocs}
                                      download
                                      preview
                                      dropdown
                    />
                </CardContent>
            </Card>
        </Stack>
    )
}


export default SharedDocumentationTab