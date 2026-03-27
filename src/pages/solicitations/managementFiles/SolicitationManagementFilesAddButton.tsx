import React, {useState} from "react";
import {SolicitationNoteRelatedData} from "types/solicitations/solicitationsNotesData";
import {Button} from "@mui/material";
import {PlusIcon} from "lucide-react";
import NewFileDialog from "components/files/NewFileDialog";
import {Sections} from "types/general/generalEnums";
import {FileBase} from "types/files/filesData";
import {HttpFilesSolicitationManagement} from "http/index";
import {SolicitationNoteFields} from "types/solicitations/solicitationsNotesData";
import useAxios from "hooks/useAxios";

interface SolicitationManagementAddButtonProps {
    solicitationId: number,
    onReloadFiles: () => void,
    relatedData?: SolicitationNoteRelatedData
}

function SolicitationManagementFilesAddButton({ solicitationId, onReloadFiles, relatedData }: SolicitationManagementAddButtonProps) {
    const {fetchData} = useAxios();
    const [openNewFile, setOpenNewFile] = useState<boolean>(false);
    
    const handleOpenNewFile = () => setOpenNewFile(true)
    
    const handleCloseNewFile = () => setOpenNewFile(false);

    const handleNewFileSubmit = (newFileBase: FileBase, file: File) => {
        if (!!relatedData) {
            return fetchData(
                () => HttpFilesSolicitationManagement.insert(
                    solicitationId, relatedData[SolicitationNoteFields.RelatedDataCode], 
                    relatedData[SolicitationNoteFields.RelatedDataId], newFileBase, file
                ),
                true
            ).then(() => {
                setOpenNewFile(false);
                onReloadFiles();
            });
        }
        return Promise.resolve();
    }
    
    return (
        <React.Fragment>
            <Button variant={'outlined'}
                    color={'secondary'}
                    size={'small'}
                    startIcon={<PlusIcon />}
                    onClick={handleOpenNewFile}
            >
                Añadir documento
            </Button>


            {
                openNewFile &&
                <NewFileDialog title={'Añadir documento'}
                               onCloseDialog={handleCloseNewFile} 
                               onSubmitDialog={handleNewFileSubmit} 
                               section={Sections.Solicitations} 
                               blockSection
                />
            }
        </React.Fragment>
    )
}

export default SolicitationManagementFilesAddButton;