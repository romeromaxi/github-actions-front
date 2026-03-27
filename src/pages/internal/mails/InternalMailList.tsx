import {useAction} from "../../../hooks/useAction";
import {ITableColumn, TableList} from "../../../components/table";
import {MailView, MailViewFields} from "../../../types/general/generalMailData";
import React, {useEffect, useState} from "react";
import {Card, Typography} from "@mui/material";
import {EntityWithIdAndDescriptionFields} from "../../../types/baseEntities";
import {EditButton} from "../../../components/buttons/Buttons";
import {HttpMailTemplate} from "../../../http/configuration/httpMailTemplate";
import MailUpdateDialog from "./MailUpdateDialog";
import {WrapperIcons} from "../../../components/icons/Icons";
import {Check, X} from "phosphor-react";


const InternalMailList = () => {
    const {setTitle} = useAction()
    const [mails, setMails] = useState<MailView[]>()
    const [mailDetail, setMailDetail] = useState<MailView>()
    
    setTitle('Plantillas de mails')
    
    const columns: ITableColumn[] = [
        {label: 'ID', value: EntityWithIdAndDescriptionFields.Id, width: 100},
        {label: 'Nombre de la plantilla', value: EntityWithIdAndDescriptionFields.Description, width: 1000},
        {label: 'Asunto', value: MailViewFields.Subject, width: 400},
        {label: 'Orden', onRenderCell: (v: MailView) =>
                <Typography>{v[MailViewFields.Order] ?? '-'}</Typography>
        },
        {label: 'Clasificación', value: MailViewFields.ClassificationDesc, onRenderCell: (ent: MailView) =>
                <Typography>{ent[MailViewFields.ClassificationDesc] ?? '-'}</Typography>
        },
        {label: 'Activa', value: MailViewFields.Active, onRenderCell: (ent: MailView)=> (
                <WrapperIcons Icon={ent[MailViewFields.Active] ? Check : X} color={ent[MailViewFields.Active] ? 'success' : 'error'} size={'sm'}/>
            )
        },
        {label: '', onRenderCell: (v: MailView) =>
            <EditButton size={'small'} onClick={() => setMailDetail(v)}>
                Editar
            </EditButton>
        }
    ]

    const loadMails = () => HttpMailTemplate.getSummaryList().then(setMails)
    
    useEffect(() => {
        loadMails()
    }, []);
    
    return (
        <React.Fragment>
            <TableList<MailView>
                entityList={mails}
                columns={columns}
                error={false}
                isLoading={!mails}
                keepBorderRadius
            />
            
            {
                !!mailDetail &&
                <MailUpdateDialog mail={mailDetail}
                                  open={!!mailDetail}
                                  onClose={() => setMailDetail(undefined)}
                                  onReload={loadMails}
                />
            }
        </React.Fragment>
    )
}


export default InternalMailList