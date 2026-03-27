import { createStyles, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import {
  Box,
  Card,
  CardContent,
  Collapse,
  Table,
  TableBody, TableContainer,
  TableHead,
  Typography,
} from '@mui/material';

import {EntityListWithPagination, EntityPaginationFields} from 'types/baseEntities';
import {
  ITableColumn,
  TableBodyEntityList,
  TableCardHeader,
  TableRowHeader,
} from './TableLayouts';
import { tableSx } from './TableList';
import * as React from "react";
import {Pagination} from "./Paginador";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 5,
    },
    cardContent: {
      padding: 0,
    },
    filterContent: {
      '& .MuiCardContent-root': {
        boxShadow: 'inset 0px -3px 5px 0px #cbcbcb',
      },
    },
  }),
);

const cardSx = {
  boxShadow: 0,
  padding: '0 !important',
};

export interface ITableWithPagingProps<T> {
  title: string | React.ReactNode;
  action?: React.ReactNode;
  entityPaginada: EntityListWithPagination<T> | null | undefined;
  columns: ITableColumn[];
  isLoading: boolean;
  error: any;
  onPaging: (actualPage: number) => void;
  onNewRegister?: () => void;
  onReload?: () => void;
  onRowClick?: (entity: any) => void;
}

export function TableWithPaging<T>(props: ITableWithPagingProps<T>) {
  return (
    <Card sx={cardSx}>
      <TableCardHeader
        title={props.title}
        action={props.action}
        onNewRegister={props.onNewRegister}
        onReload={props.onReload}
      />

      <CardContent sx={cardSx}>
        <TableContainer sx={{overflowX: 'auto !important', width: '100% !important'}}>
          <Table stickyHeader sx={tableSx}>
            <TableHead>
              <TableRowHeader columns={props.columns} />
            </TableHead>
            <TableBody>
              <TableBodyEntityList<T>
                entityList={props.entityPaginada?.lista}
                columns={props.columns}
                isLoading={props.isLoading}
                error={props.error}
                onRowClick={props.onRowClick}
              />
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ minWidth: '100%', justifyContent: 'flex-end', marginY: '16px !important', display: 'flex'}}>
          {
              !!props.entityPaginada && props.entityPaginada?.paginacion &&
              <Pagination entityPagination={props.entityPaginada?.paginacion}
                          onPaging={props.onPaging}
                          isLoading={props.isLoading}
              />
          }
        </Box>
      </CardContent>
    </Card>
    // </Typography>
  );
}

export interface ITableWithPagingAndFilterProps<T>
  extends ITableWithPagingProps<T> {
  children: React.ReactElement;
  showChildren?: boolean;
  onShowChildren?: () => void;
  childrenName?: string; //el nombre que va a mostrar en el boton
}

export function TableWithPagingAndFilter<T>(
  props: ITableWithPagingAndFilterProps<T>,
) {
  const classes = useStyles();

  return (
    <Typography component="div" className={classes.root}>
      <Card>
        <TableCardHeader
          title={props.title}
          onNewRegister={props.onNewRegister}
          onReload={props.onReload}
          onToggleShowChildren={props.onShowChildren}
          childrenName={props.childrenName}
        />

        <CardContent className={classes.cardContent}>
          <Collapse
            in={props.showChildren}
            timeout={500}
            className={classes.filterContent}
          >
            {props.children}
          </Collapse>

          <Table stickyHeader>
            <TableHead>
              <TableRowHeader columns={props.columns} />
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
          
          <Box sx={{ minWidth: '100%', justifyContent: 'center', textAlign: 'center', marginY: '16px !important', display: 'flex'}}>
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
    </Typography>
  );
}
