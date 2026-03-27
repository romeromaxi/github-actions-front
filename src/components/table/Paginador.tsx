import { createStyles, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { Table, TableFooter, TableRow, TablePagination } from '@mui/material';

import { EntityPagination } from 'types/baseEntities';

const rowsPerPageDefault: number = 10;

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentPaginationBlocks: {
            '& > tfoot > tr > td': {
                border: 'none',
            },
        },
    }),
);

interface PaginationBaseProps {
    entityPagination: EntityPagination | undefined;
    onPaging: (actualPage: number) => void;
    blocks?: boolean;
}

function PaginationComponent(props: PaginationBaseProps) {
    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    count={props.entityPagination?.cantRecords || 0}
                    page={(props.entityPagination?.actualPage || 1) - 1}
                    rowsPerPageOptions={[
                        props.entityPagination?.pageSize || rowsPerPageDefault,
                    ]}
                    rowsPerPage={props.entityPagination?.pageSize || rowsPerPageDefault}
                    onPageChange={(event: any | null, page: number) =>
                        props.onPaging(page + 1)
                    }
                    // Textos en castellano
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                    getItemAriaLabel={(type) => {
                        if (type === 'first') {
                            return 'Ir a la primera página';
                        }
                        if (type === 'last') {
                            return 'Ir a la última página';
                        }
                        if (type === 'next') {
                            return 'Ir a la página siguiente';
                        }
                        return 'Ir a la página anterior';
                    }}
                />
            </TableRow>
        </TableFooter>
    );
}

interface PaginationProps extends PaginationBaseProps {
    isLoading?: boolean;
}

export function Pagination(props: PaginationProps) {
    const classes = useStyles();

    const hasRecords: boolean = (props.entityPagination?.cantRecords || 0) > 0;
    const isVisiblePagination: boolean =
        props.isLoading != null && !props.isLoading && hasRecords;

    return isVisiblePagination ? (
        props.blocks ? (
            <Table className={classes.contentPaginationBlocks}>
                <PaginationComponent {...props} />
            </Table>
        ) : (
            <PaginationComponent {...props} />
        )
    ) : null;
}