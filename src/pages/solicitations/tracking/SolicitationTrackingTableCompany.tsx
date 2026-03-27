import React, {useEffect, useState} from "react";
import {Alert, Link, Stack} from "@mui/material";
import { HttpSolicitationTracking } from "http/solicitations/httpSolicitationTracking";
import { SolicitationTrackingView, SolicitationTrackingFields } from "types/solicitations/solicitationTrackingData";
import {ITableColumn, TableList} from "components/table";

interface SolicitationTrackingTableCompanyProps {
    solicitationId: number
}

function SolicitationTrackingTableCompany({ solicitationId }: SolicitationTrackingTableCompanyProps) {
    const [dataTrackings, setDataTrackings] = useState<SolicitationTrackingView[]>();

    const columns: ITableColumn[] = [
        { label: 'Entidad', value: SolicitationTrackingFields.FinancialEntityBusinessName, textAlign: 'left' },
        //{ label: 'Datos de Contacto', value: SolicitationTrackingFields.ContactInformation, textAlign: 'left' },
        { 
            label: 'Enlace', 
            value: SolicitationTrackingFields.RelatedLink, 
            width: '1%',
            onRenderCell: (tracking: SolicitationTrackingView) => 
                <React.Fragment>
                    {
                        !!tracking[SolicitationTrackingFields.RelatedLink] ?
                            <Link
                                href={tracking[SolicitationTrackingFields.RelatedLink]}
                                target="_blank"               // Abre en una nueva pestaña
                                rel="noopener noreferrer"    // Buena práctica para seguridad
                                underline="hover"             // Controla el subrayado del texto
                            >
                                Link
                            </Link>
                            
                            :
                            "-"
                    }
                </React.Fragment>
        },
    ];
    
    const loadSolicitationTrackings = () => {
        setDataTrackings(undefined);
        HttpSolicitationTracking.getByIdSolicitation(solicitationId)
            .then(setDataTrackings)
    }
    
    useEffect(() => {
        loadSolicitationTrackings();
    }, []);
        
    return (
        <Stack spacing={2}>
            <Alert severity="info" color="info">
                Aquí recibirás nuevas recomendaciones a medida que las entidades se interesen por tu solicitud.
            </Alert>
            
            <TableList<SolicitationTrackingView> entityList={dataTrackings} 
                                                 columns={columns} 
                                                 isLoading={!dataTrackings} 
                                                 error={false}
            />

            <Alert severity="info" color="info">
                Revisa el chat, podría haber más recomendaciones allí.
            </Alert>
        </Stack>
    )
}

export default SolicitationTrackingTableCompany;