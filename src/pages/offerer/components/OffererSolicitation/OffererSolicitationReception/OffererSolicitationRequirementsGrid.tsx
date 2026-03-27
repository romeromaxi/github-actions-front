import {Grid, Stack, Typography} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {ITableColumn, TableList} from "../../../../../components/table";
import {PublicEntityEnums} from "../../../../../util/typification/publicEntityEnums";


const lstBureau = [
    {label: PublicEntityEnums.BCRA, ok: true},
    {label: 'Cheques Rechazados', ok: true},
    {label: 'Aportes Patronales', ok: true},
    {label: 'Score Nosis', ok: false}
]

const lstMatch = [
    {label: 'Sector de la Economía', ok: true},
    {label: 'Territorialidad', ok: true},
    {label: `Actividad ${PublicEntityEnums.ARCA}`, ok: true},
    {label: 'Tamaño de la Pyme', ok: true},
    {label: 'Tipo de Persona', ok: true},
    {label: 'Liderada por Mujeres', ok: false}
]

const lstMinor = [
    {label: 'Facturación', ok: true},
    {label: 'Patrimonio Neto', ok: true},
    {label: 'Antiguedad', ok: true}
]

const OffererSolicitationRequirementsGrid = () => {
    
    const columns : ITableColumn[] = [
        {label: '', value: '', onRenderCell: (i: any) =>
        <Typography>{i.label}</Typography>
        },
        {label: '', value: '', onRenderCell: (i: any) =>
                i.ok ? <CheckCircleRoundedIcon color={'success'}/> : <WarningAmberIcon color={'warning'} />
        }
    ]
    
    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <Stack spacing={1}>
                    <Typography fontSize={16} fontWeight={600} textAlign={'center'}>Bases Públicas</Typography>
                    <TableList columns={columns}
                               error={false}
                               entityList={lstBureau}
                               isLoading={false}
                    />
                </Stack>
            </Grid>
            <Grid item md={4}>
                <Stack spacing={1}>
                    <Typography fontSize={16} fontWeight={600} textAlign={'center'}>Match Pyme - Linea</Typography>
                    <TableList columns={columns}
                               error={false}
                               entityList={lstMatch}
                               isLoading={false}
                    />
                </Stack>
            </Grid>
            <Grid item md={4}>
                <Stack spacing={1}>
                    <Typography fontSize={16} fontWeight={600} textAlign={'center'}>Requerimientos Mínimos</Typography>
                    <TableList columns={columns}
                               error={false}
                               entityList={lstMinor}
                               isLoading={false}
                    />
                </Stack>
            </Grid>
        </Grid>
    )
}


export default OffererSolicitationRequirementsGrid