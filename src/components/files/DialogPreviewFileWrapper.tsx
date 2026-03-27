import DialogPreviewFile from "./DialogPreviewFile";
import React, {ReactElement, useState} from "react";

interface DialogPreviewFileWrapperProps {
    titleDialog: string,
    fileUrl: string,
    children: ReactElement
}

function DialogPreviewFileWrapper(props: DialogPreviewFileWrapperProps) {
    const [openPreviewDialog, setOpenPreviewDialog] = useState<boolean>(false);
    
    const onOpenPreviewDialog = () => setOpenPreviewDialog(true);
    
    const onClosePreviewDialog = () => setOpenPreviewDialog(false);
    
    return (
        <React.Fragment>
            { React.cloneElement(props.children, { onClick: onOpenPreviewDialog }) }

            <DialogPreviewFile open={openPreviewDialog}
                               onClose={onClosePreviewDialog}
                               filePath={props.fileUrl}
                               title={props.titleDialog}
            />
        </React.Fragment>
    )
}

export { DialogPreviewFileWrapper }