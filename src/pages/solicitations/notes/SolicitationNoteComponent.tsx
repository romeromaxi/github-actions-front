import React, {useState} from "react";
import { WrapperIcons } from "components/icons/Icons";
import DataBorderBox from "components/misc/DataBorderBox";
import {SolicitationNote, SolicitationNoteFields} from "types/solicitations/solicitationsNotesData";
import { dateFormatter } from "util/formatters/dateFormatter";
import { NotepadTextIcon, SearchIcon } from "lucide-react";
import {MenuItemDropdown} from "../../../components/buttons/Buttons";
import SolicitationNoteDetailDialog from "./SolicitationNoteDetailDialog";

interface SolicitationNoteComponentProps {
    note: SolicitationNote
}

function SolicitationNoteComponent({ note }: SolicitationNoteComponentProps) {
    const [selectedNote, setSelectedNote] = useState<SolicitationNote | null>(null);

    const handleCloseNoteDetailDialog = () => setSelectedNote(null);
    
    const itemsDropdown: MenuItemDropdown[] = [
        {
            label: 'Ver detalle',
            icon: <WrapperIcons Icon={SearchIcon} />,
            onClick: () => setSelectedNote(note)
        }
    ];
    
    return (
        <React.Fragment>
            <DataBorderBox title={note[SolicitationNoteFields.UserBusinessName]}
                           subtitle={dateFormatter.toShortDate(note[SolicitationNoteFields.CreationDate])}
                           icon={<WrapperIcons Icon={NotepadTextIcon} size={'md'} />}
                           description={note[SolicitationNoteFields.Message]}
                           items={itemsDropdown}
            />

            <SolicitationNoteDetailDialog open={!!selectedNote} 
                                          note={selectedNote} 
                                          onClose={handleCloseNoteDetailDialog}
            />
        </React.Fragment>
    )
}

export default SolicitationNoteComponent;