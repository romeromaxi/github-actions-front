import React, {useEffect, useState} from "react";
import {SolicitationNote, SolicitationNoteFields} from "types/solicitations/solicitationsNotesData";
import {Document, DocumentFields} from "types/files/filesData";
import {Stack} from "@mui/material";
import DataBorderBox from "../misc/DataBorderBox";
import {dateFormatter} from "util/formatters/dateFormatter";
import {EntityWithIdFields} from "types/baseEntities";
import {fileFormatter} from "../../util/formatters/fileFormatter";
import {DownloadIcon, Trash2Icon} from "lucide-react";
import {MenuItemDropdown} from "../buttons/Buttons";
import {WrapperIcons} from "../icons/Icons";
import LabelFormBase from "components/forms/LabelFormBase";
import useAxios from "hooks/useAxios";
import {HttpFileDocument} from "http/index";
import SolicitationNoteComponent from "pages/solicitations/notes/SolicitationNoteComponent";

export interface MixedItem {
    type: 'note' | 'document';
    creationDate: string | Date;
    data: SolicitationNote | Document;
}

interface SolicitationActivityListProps {
    title?: string,
    fetchNotes?: () => Promise<SolicitationNote[]>;
    fetchDocuments?: () => Promise<Document[]>;
    reloadTrigger?: number;
    onDeleteDocument?: (documentId: number) => Promise<void>;
    onItemsLoaded?: (items: MixedItem[]) => void;
}

function SolicitationActivityList({ title, fetchNotes, fetchDocuments, onDeleteDocument, onItemsLoaded }: SolicitationActivityListProps) {
    const {fetchAndDownloadFile} = useAxios();
    
    const [items, setItems] = useState<MixedItem[]>();

    useEffect(() => {
        loadData();
    }, [fetchNotes, fetchDocuments]);
    
    const loadData = () => {
        const promises: Promise<any>[] = [];
        if (fetchNotes) promises.push(fetchNotes());
        else promises.push(Promise.resolve([]));
        
        if (fetchDocuments) promises.push(fetchDocuments());
        else promises.push(Promise.resolve([]));
        
        Promise.all(promises).then(([notes, documents]) => {
            const mixedItems: MixedItem[] = [
                ...(notes as SolicitationNote[]).map(n => ({
                    type: 'note' as const,
                    creationDate: n[SolicitationNoteFields.CreationDate],
                    data: n
                })),
                ...(documents as Document[]).map(d => ({
                    type: 'document' as const,
                    creationDate: d[DocumentFields.BeginDate],
                    data: d
                }))
            ];

            mixedItems.sort((a, b) => {
                const dateA = new Date(a.creationDate).getTime();
                const dateB = new Date(b.creationDate).getTime();
                return dateB - dateA;
            });

            setItems(mixedItems);
            if (onItemsLoaded) onItemsLoaded(mixedItems);
        });
    }

    const handleDownloadDocument = (documentId: number) => {
        fetchAndDownloadFile(() => HttpFileDocument.download(documentId))
    }
    
    const handleDelete = (id: number) => {
        if (onDeleteDocument) {
            onDeleteDocument(id).then(() => loadData());
        }
    }
    
    if (!!items && !items.length)
        return null;
    
    return (
        <Stack spacing={2}>
            {
                !!title &&
                    <LabelFormBase label={title} />
            }

            {
                !items ?
                    <DataBorderBox title={''}
                                   loading
                    />
                    :
                    items.map((item) => {
                        if (item.type === 'note') {
                            const note = item.data as SolicitationNote;
                            
                            return (
                                <SolicitationNoteComponent key={`note_${note[EntityWithIdFields.Id]}`} 
                                                           note={note}
                                />
                            );
                        } else {
                            const doc = item.data as Document;
                            const itemsDropdown: MenuItemDropdown[] = [];

                            itemsDropdown.push({
                                label: 'Descargar',
                                icon: <WrapperIcons Icon={DownloadIcon} />,
                                onClick: () => handleDownloadDocument(doc[EntityWithIdFields.Id])
                            });

                            if (onDeleteDocument) {
                                itemsDropdown.push({
                                    label: 'Eliminar',
                                    icon: <WrapperIcons Icon={Trash2Icon} />,
                                    onClick: () => handleDelete(doc[EntityWithIdFields.Id])
                                });
                            }

                            return (
                                <DataBorderBox
                                    key={`doc_${doc[EntityWithIdFields.Id]}`}
                                    title={doc[DocumentFields.TitleDocument]}
                                    subtitle={dateFormatter.toShortDate(doc[DocumentFields.BeginDate])}
                                    icon={fileFormatter.getIconByFileName(doc[DocumentFields.FileDesc])}
                                    description={`${doc[DocumentFields.FileDesc] || ''}`}
                                    items={itemsDropdown.length > 0 ? itemsDropdown : undefined}
                                />
                            );
                        }
                    })
            }
        </Stack>
    )
}

export default SolicitationActivityList;

