import React, {useEffect, useMemo, useState} from "react";
import {
    DocumentFolderViewDTO,
    DocumentFolderViewDTOFields
} from "../../types/files/filesFoldersData";
import {EntityWithIdFields} from "../../types/baseEntities";
import {HttpFilesFolders} from "../../http";
import {Alert, Stack} from "@mui/material";
import RelatedFolderTreeViewNode from "./RelatedFolderTreeViewNode";
import {LoaderBlockUI} from "../loader";
import DrawerBase from "../misc/DrawerBase";


interface RelatedFoldersViewDrawerProps {
    open: boolean;
    onClose: () => void;
    companyId?: number;
    offererId?: number; 
}


const RelatedFoldersViewDrawer = ({
                                      open,
                                      onClose,
                                      companyId,
                                      offererId
                                  } : RelatedFoldersViewDrawerProps) => {
    const [folders, setFolders] = useState<DocumentFolderViewDTO[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const hasFoldersCreated = useMemo(() => !!folders && !!folders.length, [folders]);

    const checkIfPresent = (fol: DocumentFolderViewDTO, lst: number[]) => {
        if (fol[DocumentFolderViewDTOFields.IsPresent]) {
            lst.push(fol[EntityWithIdFields.Id]);
        }
    };

    const getFolderValue = (fol: DocumentFolderViewDTO, lst: number[]) => {
        checkIfPresent(fol, lst);
        if (fol[DocumentFolderViewDTOFields.DaughtersFolders].length !== 0) {
            fol[DocumentFolderViewDTOFields.DaughtersFolders].map((childFol) => {
                getFolderValue(childFol, lst);
            });
        }
    };

    useEffect(() => {
        if (open) {
            setLoading(true);
            if (companyId) {
                HttpFilesFolders.getFoldersByCompanyId(companyId).then((r) => {
                    setFolders(r);
                    setLoading(false);
                });
            }
            if (offererId) {
                HttpFilesFolders.getOffererFolders(offererId).then(
                    (r) => {
                        setFolders(r);
                        setLoading(false);
                    },
                );
            }
        }
    }, [open]);



    return (
        <DrawerBase show={open} onCloseDrawer={onClose} title={'Mis carpetas personalizadas'}>
            <Stack spacing={3}>
                {
                    !hasFoldersCreated &&
                        <Alert severity={'info'} color={'info'}>
                            No tenés carpetas personalizadas por el momento.
                        </Alert>
                }
                <Stack>
                    {folders &&
                        folders.length !== 0 &&
                        folders.map((fol) => (
                            <RelatedFolderTreeViewNode folder={fol}/>
                        ))}
                </Stack>
            </Stack>

            {loading && <LoaderBlockUI />}
        </DrawerBase>
    );
}


export default RelatedFoldersViewDrawer