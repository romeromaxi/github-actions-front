import {ITableWithPagingProps} from "./TableWithPaging";
import {
    Box,
    Card,
    CardContent,
    Pagination,
    Stack,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableHead,
    Tooltip,
    Typography
} from "@mui/material";
import {TableBodyEntityList, TableCardHeader} from "./TableLayouts";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import * as React from "react";
import {themeColorDefinition} from "../../util/themes/definitions";
import {EntityPaginationFields} from "../../types/baseEntities";


function TableWithPagingNew<T>(props: ITableWithPagingProps<T>) {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#FAFAFA'
        }
    }));

    const renderTitleComponent = (title: string) =>
        <Typography variant={'caption'}
                    fontWeight={500}
                    color={themeColorDefinition.UIElements.texts.default}
                    textTransform={'none'}
        >
            {title}
        </Typography>;
    
    return (
        <Card>
            <TableCardHeader title={props.title} 
                             action={props.action} 
                             onNewRegister={props.onNewRegister} 
                             onReload={props.onReload}
            />
            <CardContent>
                <Table stickyHeader sx={{width: '100%'}}>
                    <TableHead>
                        {props.columns.map((oneColumn, index) => (
                            <StyledTableCell key={`${oneColumn.value}_${index}`}>
                                {oneColumn.helperTooltip ? (
                                    <Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        spacing={1}
                                        justifyContent={'center'}
                                    >
                                        {renderTitleComponent(oneColumn.label)}
                                        <Tooltip title={oneColumn.helperTooltip}>
                                            <HelpOutlineRoundedIcon fontSize={'small'} color="info" />
                                        </Tooltip>
                                    </Stack>
                                ) : (
                                    renderTitleComponent(oneColumn.label)
                                )}
                            </StyledTableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        <TableBodyEntityList<T>
                            entityList={props.entityPaginada?.lista}
                            columns={props.columns}
                            isLoading={props.isLoading}
                            error={props.error}
                        />
                    </TableBody>
                </Table>
                <Box sx={{ minWidth: '100%', justifyContent: 'center', textAlign: 'center', mt: 2, display: 'flex'}}>
                    {
                        !!props.entityPaginada &&
                        <Pagination count={props.entityPaginada.paginacion[EntityPaginationFields.CantPages]}
                                    page={props.entityPaginada.paginacion[EntityPaginationFields.ActualPage]}
                                    onChange={(e, page) => props.onPaging(page)}
                                    size="small"
                        />
                    }
                </Box>
            </CardContent>
        </Card>
    )
}



export default TableWithPagingNew