import React, {ReactNode, useState} from 'react';

import { createStyles, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
    Card,
    CardContent,
    SxProps,
    Table,
    TableBody,
    tableCellClasses, TableContainer,
    TableHead,
    Typography,
} from '@mui/material';

import {
    ITableColumn,
    TableColumnByGroupLabel,
    TableBodyEntityList,
    TableCardHeader,
    TableRowHeader,
} from './TableLayouts';
import TableListStyles from './TableList.styles';
import { themeTypographyDefinition } from 'util/themes/definitions/ThemeTypographyDefinition';
import {themeColorDefinition} from "../../util/themes/definitions";

const useStyles: any = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            marginTop: 0,
        },
    }),
);

const cardSx = {
    boxShadow: 0,
    padding: '0px !important',
    '& .MuiCardHeader-root': {
        padding: '24px !important'
    }
};

export const tableSx = {
    [`& .${tableCellClasses.root}`]: {
        backgroundColor: `white`,
    },
    [`& .${tableCellClasses.root}:not(.${tableCellClasses.head}):not(.${tableCellClasses.footer})`]:
        {
            ...themeTypographyDefinition.caption,
            padding: '16px !important',
            borderWidth: '0px 1px 1px 0px',
            borderStyle: 'solid',
            borderColor: themeColorDefinition.UIElements.borders.secondary,
            color: themeColorDefinition.UIElements.texts.default,
            textAlign: 'start',
            alignItems: 'start',
            justifyContent: 'start',
            '& > div': {
                justifyContent: 'start',
            },
            '&.min-padding': {
                padding: '8px !important',
            },
            '&.sticky-column': {
                position: 'sticky !important',
                left: 0,
                zIndex: 10,
                backgroundColor: 'white !important',
                borderRight: `2px solid ${themeColorDefinition.UIElements.borders.secondary} !important`,
            }
        },

    [`& .${tableCellClasses.head}`]: {
        ...themeTypographyDefinition.caption,
        backgroundColor: themeColorDefinition.UIElements.backgrounds.tertiary,
        padding: '16px !important',
        borderWidth: '0px 1px 1px 0px',
        borderStyle: 'solid',
        borderColor: themeColorDefinition.UIElements.borders.secondary,
        '&.min-padding': {
            padding: '8px !important',
        },
        '&.sticky-header': {
            position: 'sticky !important',
            left: 0,
            zIndex: '11 !important',
            backgroundColor: `${themeColorDefinition.UIElements.backgrounds.tertiary} !important`,
            borderRight: `2px solid ${themeColorDefinition.UIElements.borders.secondary} !important`,
        }
    },
    [`& .${tableCellClasses.footer}`]: {
        borderTop: `1px solid grey.200`,
    }
};


export const condensedTableSx = {
    [`& .${tableCellClasses.root}`]: {
        backgroundColor: `white`,
    },
    [`& .${tableCellClasses.root}:not(.${tableCellClasses.head}):not(.${tableCellClasses.footer})`]:
        {
            ...themeTypographyDefinition.caption,
            padding: '2px !important',
            borderWidth: '0px 1px 1px 0px',
            borderStyle: 'solid',
            borderColor: themeColorDefinition.UIElements.borders.secondary,
            color: themeColorDefinition.UIElements.texts.default,
            textAlign: 'start',
            alignItems: 'start',
            justifyContent: 'start',
            '& > div': {
                justifyContent: 'start',
            },
        },

    [`& .${tableCellClasses.head}`]: {
        ...themeTypographyDefinition.caption,
        backgroundColor: themeColorDefinition.UIElements.backgrounds.tertiary,
        padding: '16px !important',
        borderWidth: '0px 1px 1px 0px',
        borderStyle: 'solid',
        borderColor: themeColorDefinition.UIElements.borders.secondary,

    },
    [`& .${tableCellClasses.footer}`]: {
        borderTop: `1px solid grey.200`,
    }
};

export const metronicTableSx = {
    [`& .${tableCellClasses.root}`]: {
        backgroundColor: `white`,
    },
    [`& .${tableCellClasses.root}:not(.${tableCellClasses.head}):not(.${tableCellClasses.footer})`]:
        {
            borderBottom: '1px solid',
            borderColor: 'grey.200',

            fontSize: '13px !important',
            color: 'grey.600',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            '& > div': {
                justifyContent: 'center',
            },
        },
    [`& .${tableCellClasses.head}`]: {
        borderBottom: `1px solid`,
        borderColor: 'grey.200',
        padding: '16px 12px 12px 16px',
        backgroundColor: 'rgba(245, 248, 250, 0.75)',
        '& > p': {
            fontSize: '16px !important',
            fontWeight: '700 !important',
            color: 'grey.600',
            textAlign: 'center',
            textTransform: 'none !important',
        },
        '& > div p': {
            fontSize: '16px !important',
            fontWeight: '700 !important',
            color: 'grey.600',
            textAlign: 'center',
            textTransform: 'none !important',
        },
    },
    [`& .${tableCellClasses.footer}`]: {
        borderTop: `1px solid grey.200`,
    },
    borderBottom: `1px solid grey.200`,
};

export type TotalsRowMap<T> = {
    columnIndex: number;
    entityField: keyof T;
    sxOverride?: SxProps<Theme>;
};

export interface TableListProps<T> {
    title?: string;
    entityList: T[] | null | undefined;
    columns: ITableColumn[];
    isLoading: boolean;
    error: any;
    action?: ReactNode;
    onNewRegister?: () => void;
    onReload?: () => void;
    showLastReload?: boolean;
    totalsRowMapList?: TotalsRowMap<T>[];
    newRegisterTitle?: string;
    keepBorderRadius?: boolean;
    variant?: string;
    hideColumnName?: boolean;
    onRowClick?: (entity: T) => void;
    headerGroups?: TableColumnByGroupLabel;
    tableContainerRef?: React.Ref<HTMLDivElement>;
    sortGroups?: boolean;
}

function TableListWithHeader<T>(props: TableListProps<T>) {
    return (
        <Card sx={cardSx}>
            <TableCardHeader
                title={props.title || ''}
                action={props.action}
                onNewRegister={props.onNewRegister}
                newRegisterTitle={props.newRegisterTitle}
                onReload={props.onReload}
            />

            <CardContent sx={cardSx}>
                <TableContainer
                    sx={{
                        overflowX: 'auto',
                        width: '100%',
                        maxHeight: props.tableContainerRef && 'calc(100vh - 200px)',
                        position: props.tableContainerRef && 'relative'
                    }}
                >
                    <Table stickyHeader aria-label="sticky table" 
                           variant={props.variant} sx={props.variant ? undefined : tableSx}>
                        <TableHead>
                            <TableRowHeader
                                columns={props.columns}
                                headerGroups={props.headerGroups}
                                sortGroups={props.sortGroups}
                            />
                        </TableHead>
                        <TableBody>
                            <TableBodyEntityList<T>
                                entityList={props.entityList}
                                columns={props.columns}
                                isLoading={props.isLoading}
                                error={props.error}
                                totalsRowMapList={props.totalsRowMapList}
                                onRowClick={props.onRowClick}
                                headerGroups={props.headerGroups}
                            />
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}


function CondensedTableListWithHeader<T>(props: TableListProps<T>) {
    return (
        <Card sx={cardSx}>
            <TableCardHeader
                title={props.title || ''}
                action={props.action}
                onNewRegister={props.onNewRegister}
                newRegisterTitle={props.newRegisterTitle}
                onReload={props.onReload}
            />

            <CardContent sx={cardSx}>
                <Table stickyHeader aria-label="sticky table" sx={condensedTableSx}>
                    <TableHead>
                        <TableRowHeader
                            columns={props.columns}
                            headerGroups={props.headerGroups}
                            sortGroups={props.sortGroups}
                        />
                    </TableHead>
                    <TableBody>
                        <TableBodyEntityList<T>
                            entityList={props.entityList}
                            columns={props.columns}
                            isLoading={props.isLoading}
                            error={props.error}
                            totalsRowMapList={props.totalsRowMapList}
                            onRowClick={props.onRowClick}
                            headerGroups={props.headerGroups}
                        />
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

interface TableListWithoutHeaderProps<T> {
    entityList: T[] | null | undefined;
    columns: ITableColumn[];
    isLoading: boolean;
    error: any;
    keepBorderRadius?: boolean;
    variant?: string;
    hideColumnName?: boolean;
    onRowClick?: (entity: T) => void;
    headerGroups?: TableColumnByGroupLabel;
    totalsRowMapList?: TotalsRowMap<T>[];
    tableContainerRef?: React.Ref<HTMLDivElement>;
    sortGroups?: boolean;
}

function TableListWithoutHeader<T>(props: TableListWithoutHeaderProps<T>) {
    return (
        <Card sx={props.keepBorderRadius ? cardSx : { ...cardSx, borderRadius: '0px !important' }}>
            <TableContainer
                ref={props.tableContainerRef}
                sx={{
                    overflowX: 'auto',
                    width: '100%',
                    maxHeight: props.tableContainerRef && 'calc(100vh - 200px)',
                    position: props.tableContainerRef && 'relative'
                }}
            >
                <Table stickyHeader aria-label="sticky table" variant={props.variant} sx={props.variant ? undefined : tableSx}>
                    {
                        !props.hideColumnName &&
                        <TableHead>
                            <TableRowHeader
                                columns={props.columns}
                                headerGroups={props.headerGroups}
                                sortGroups={props.sortGroups}
                            />
                        </TableHead>
                    }
                    <TableBody>
                        <TableBodyEntityList<T>
                            entityList={props.entityList}
                            columns={props.columns}
                            isLoading={props.isLoading}
                            error={props.error}
                            onRowClick={props.onRowClick}
                            headerGroups={props.headerGroups}
                            totalsRowMapList={props.totalsRowMapList}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}

function CondensedTableListWithoutHeader<T>(props: TableListWithoutHeaderProps<T>) {
    return (
        <Card sx={{ ...cardSx, borderRadius: '0px !important' }}>
            <Table stickyHeader aria-label="sticky table" sx={condensedTableSx}>
                <TableHead>
                    <TableRowHeader
                        columns={props.columns}
                        headerGroups={props.headerGroups}
                        sortGroups={props.sortGroups}
                    />
                </TableHead>
                <TableBody>
                    <TableBodyEntityList<T>
                        entityList={props.entityList}
                        columns={props.columns}
                        isLoading={props.isLoading}
                        error={props.error}
                        onRowClick={props.onRowClick}
                        headerGroups={props.headerGroups}
                    />
                </TableBody>
            </Table>
        </Card>
    );
}

export function TableList<T>(props: TableListProps<T>) {
    const classes = useStyles();
    const hasHeader: boolean =
        !!props.title || !!props.onNewRegister || !!props.onReload || !!props.action;
    const finalShowLastReload: boolean =
        !!props.showLastReload && !!props.onReload;
    const [dateUpdate, setDateUpdate] = useState<Date>(new Date());

    const onReloadWithTimer = () => {
        setDateUpdate(new Date());

        if (props.onReload) props.onReload();
    };

    return (
        <Typography component="div" className={classes.root}>
            {hasHeader ? (
                <TableListWithHeader
                    {...props}
                    onReload={finalShowLastReload ? onReloadWithTimer : props.onReload}
                />
            ) : (
                <TableListWithoutHeader {...props} tableContainerRef={props.tableContainerRef} />
            )}
        </Typography>
    );
}


export function CondensedTableList<T>(props: TableListProps<T>) {
    const classes = useStyles();
    const hasHeader: boolean =
        !!props.title || !!props.onNewRegister || !!props.onReload || !!props.action;
    const finalShowLastReload: boolean =
        !!props.showLastReload && !!props.onReload;
    const [dateUpdate, setDateUpdate] = useState<Date>(new Date());

    const onReloadWithTimer = () => {
        setDateUpdate(new Date());

        if (props.onReload) props.onReload();
    };

    return (
        <Typography component="div" className={classes.root}>
            {hasHeader ? (
                <CondensedTableListWithHeader
                    {...props}
                    onReload={finalShowLastReload ? onReloadWithTimer : props.onReload}
                />
            ) : (
                <CondensedTableListWithoutHeader {...props} />
            )}
        </Typography>
    );
}

export interface TableListCompanyFileSummaryProps<T> {
    entityList: T[] | null | undefined;
    columns: ITableColumn[];
    isLoading: boolean;
    error: any;
    totalsRowMapList?: TotalsRowMap<T>[];
    onRowClick?: (entity: T) => void;
    headerGroups?: TableColumnByGroupLabel;
    sortGroups?: boolean;
}

export function TableListCompanyFileSummary<T>(
    props: TableListCompanyFileSummaryProps<T>,
) {
    const classes = TableListStyles();

    return (
        <div className={classes.root}>
            <Table stickyHeader className={classes.table}>
                <TableHead>
                    <TableRowHeader
                        columns={props.columns}
                        headerGroups={props.headerGroups}
                        sortGroups={props.sortGroups}
                    />
                </TableHead>

                <TableBody>
                    <TableBodyEntityList<T>
                        entityList={props.entityList}
                        columns={props.columns}
                        isLoading={props.isLoading}
                        error={props.error}
                        loadingWithSkeleton
                        onRowClick={props.onRowClick}
                        headerGroups={props.headerGroups}
                    />
                </TableBody>
            </Table>
        </div>
    );
}