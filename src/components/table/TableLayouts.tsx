import { useState } from 'react';
import { createStyles, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import {
  Box,
  Button,
  CardHeader, Collapse,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { ExpandLess, ExpandMore } from '@mui/icons-material/';
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import {
  TableLoading,
  TableLoadingSkeleton,
  TableWithError,
  TableWithoutData,
} from './TableLayoutsState';

import { dateFormatter } from 'util/formatters/dateFormatter';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import * as React from 'react';
import { TotalsRowMap } from './TableList';
import { numberFormatter } from 'util/formatters/numberFormatter';
import { themeColorDefinition } from 'util/themes/definitions';
import {Property} from "csstype";
import {stringFormatter} from "util/formatters/stringFormatter";
import {BaseIconWrapper} from "../icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import clsx from "clsx";
import TableListStyles from "./TableList.styles";

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        background:
            'linear-gradient(0deg, rgba(253,253,253,1) 0%, rgba(250,250,250,1) 50%, rgba(245,245,245,1) 100%); ',
        borderBottom: `1px solid #E0E0E0`,
        paddingLeft: '8px',
        borderRadius: '0 0 0 0',
      },
      botones: {
        marginRight: theme.spacing(1),
      },
      tableCellButton: {
        zoom: '80%',
      },
      iconBoolDanger: {
        fill: '#f44336 !important',
        fontSize: '19px !important',
      },
      iconBoolSuccess: {
        fill: '#4caf50 !important',
        fontSize: '19px !important',
      },
      stickyColumn: {
        position: 'sticky !important',
        left: 0,
        zIndex: 10,
        backgroundColor: 'white !important',
        borderRight: `2px solid ${themeColorDefinition.UIElements.borders.secondary} !important`,
      },
      stickyColumnHeader: {
        position: 'sticky !important',
        left: 0, 
        zIndex: '11 !important',
        backgroundColor: `${themeColorDefinition.UIElements.backgrounds.tertiary} !important`,
        borderRight: `2px solid ${themeColorDefinition.UIElements.borders.secondary} !important`,
      },
    }),
);

export interface ITableColumn {
  label: string;
  value?: string;
  helperTooltip?: string;
  width?: string | number | undefined;
  currency?: string;
  type?: TableColumnType;
  textAlign?: 'left' | 'center' | 'right';
  textAlignHeader?: Property.TextAlign;
  fontWeight?: Property.FontWeight,
  onCheckingHighlighted?: (entity: any, ...args: any[]) => boolean;
  onRenderCell?: (entity: any, ...args: any[]) => React.ReactElement;
  getCollapsable?: (entity: any, ...args: any[]) => React.ReactElement | null | undefined;
  hidden?: boolean;
  minPadding?: boolean;
  sticky?: boolean;
  headerGroup?: string;
}

// La 'key' representa el nombre del grupo y el 'value' es la cantidad de columnas en ese grupo
export type TableColumnByGroupLabel = Record<string, number>;

export enum TableColumnType {
  Date = 1,
  Button = 2,
  Boolean = 3,
  Chart = 4,
  Currency = 5,
  InvertedBoolean = 6,
  CUIT = 7,
  NumberWithoutDecimal = 8
}

interface ITableRowEntityProps {
  keyComponent: React.Key;
  entity: any;
  columns: ITableColumn[];
  firstRow?: boolean;
  onRowClick?: (entity: any) => void;
}

export function TableRowEntity(props: ITableRowEntityProps) {
  const classes = useStyles();
  const tableListClasses = TableListStyles();
  const [expandedCollapsable, setExpandedCollapsable] = useState<boolean>(false);
  const collapsableColumn = props.columns.find(x =>
      !!x.getCollapsable && !!x.getCollapsable(props.entity)
  );
  const hasCollapsableColumn = !!collapsableColumn;

  function getColumnKey(columnIndex: number, value: string | undefined) {
    return `${props.keyComponent}_${columnIndex}_${value}`;
  }

  const toggleExpandedCollapsable = () => setExpandedCollapsable(!expandedCollapsable);

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement;
    const isInteractiveElement = target.closest('button, a, input, select, textarea, [role="button"], .MuiIconButton-root, .MuiButton-root');

    const isExpandButton = target.closest('[data-expand-button]');

    if (props.onRowClick && !isInteractiveElement && !isExpandButton) {
      props.onRowClick(props.entity);
    }
  };

  return (
      <React.Fragment>
        <TableRow
            className={clsx({[tableListClasses.clickableRow]: props.onRowClick})}
            onClick={handleRowClick}
        >

          {props.columns.map((oneColumn, index) => {
            if (oneColumn.hidden) return undefined;

            const columnValue: string = oneColumn.value || '';
            const textAlign: string = oneColumn.textAlign || 'center';
            const fontWeight = oneColumn.fontWeight || 500;
            const isFirstColumn = index === 0;

            const keyCell = getColumnKey(index, columnValue);
            const isHighlighted = oneColumn.onCheckingHighlighted && oneColumn.onCheckingHighlighted(props.entity)
            const classNameCell = oneColumn.minPadding ? 'min-padding' : '';

            const stickyClass = oneColumn.sticky ? classes.stickyColumn : '';
            const finalClassName = clsx(classNameCell, stickyClass);

            const stylesCell = {
              textAlign: `${textAlign} !important`,
              fontWeight: `${fontWeight} !important`,
              backgroundColor: isHighlighted ? `${themeColorDefinition.UIElements.backgrounds.tertiary} !important` : '',
              borderBottomWidth: hasCollapsableColumn && expandedCollapsable ? '0px !important' : ''
            };

            switch (oneColumn.type) {
              case TableColumnType.Boolean:
                return (
                    <TableCell key={keyCell} sx={stylesCell} className={finalClassName}>
                      {(props.entity[columnValue] as boolean) ? (
                          <CheckCircleOutlineIcon className={classes.iconBoolSuccess} />
                      ) : (
                          <RemoveCircleIcon className={classes.iconBoolDanger} />
                      )}
                    </TableCell>
                );

              case TableColumnType.InvertedBoolean:
                return (
                    <TableCell key={keyCell} sx={stylesCell} className={finalClassName}>
                      {!(props.entity[columnValue] as boolean) ? (
                          <CheckCircleOutlineIcon className={classes.iconBoolSuccess} />
                      ) : (
                          <RemoveCircleIcon className={classes.iconBoolDanger} />
                      )}
                    </TableCell>
                );

              case TableColumnType.Date:
                return (
                    <TableCell key={keyCell} sx={stylesCell} className={finalClassName} width={oneColumn.width}>
                      {dateFormatter.toShortDate(props.entity[columnValue])}
                    </TableCell>
                );

              case TableColumnType.Button:
                return (
                    <TableCell key={keyCell} className={`${classes.tableCellButton} ${finalClassName}`} width={oneColumn.width} sx={stylesCell}>
                      {oneColumn.onRenderCell && oneColumn.onRenderCell(props.entity)}
                    </TableCell>
                );
              case TableColumnType.Chart:
                return props?.firstRow ? (
                    <TableCell
                        key={keyCell}
                        align={'center'}
                        style={{ borderBottom: 'none' }}
                        rowSpan={7}
                        className={finalClassName}
                    >
                      {oneColumn.onRenderCell && oneColumn.onRenderCell(props.entity)}
                    </TableCell>
                ) : (
                    <React.Fragment />
                );

              case TableColumnType.Currency:
                return (
                    <TableCell key={keyCell} sx={stylesCell} className={finalClassName}>
                      {numberFormatter.toStringWithAmount(
                          props.entity[columnValue],
                          oneColumn.currency || '$',
                      )}
                    </TableCell>
                );

              case TableColumnType.CUIT:
                return (
                    <TableCell key={keyCell} sx={stylesCell} className={finalClassName}>
                      {stringFormatter.formatCuit(props.entity[columnValue])}
                    </TableCell>
                );

                case TableColumnType.NumberWithoutDecimal:
                    return (
                        <TableCell key={keyCell} sx={stylesCell} className={finalClassName}>
                            {numberFormatter.toNumberWithoutDecimal(props.entity[columnValue] || 0)}
                        </TableCell>
                    );

              default:
                return (
                    <TableCell key={keyCell} sx={stylesCell} className={finalClassName} width={oneColumn.width} >
                      {
                        (hasCollapsableColumn && isFirstColumn) ?
                            <Stack direction={'row'}
                                   alignItems={'center'}
                                   justifyContent={'center'}
                            >
                              <Box
                                  onClick={toggleExpandedCollapsable}
                                  sx={{ cursor: 'pointer'}}
                                  data-expand-button="true"
                              >
                                <BaseIconWrapper Icon={expandedCollapsable ? CaretUp : CaretDown}
                                                 size={'sm'}
                                                 bg={'#F7FAFC'}
                                                 height={'22px'}
                                                 width={'22px'}
                                />
                              </Box>

                              <Box width={'100%'}>
                                {oneColumn.onRenderCell
                                    ? oneColumn.onRenderCell(props.entity)
                                    : props.entity[columnValue]}
                              </Box>
                            </Stack>
                            :
                            oneColumn.onRenderCell
                                ? oneColumn.onRenderCell(props.entity)
                                : props.entity[columnValue]
                      }

                    </TableCell>
                );
            }
          })}
        </TableRow>

        {hasCollapsableColumn && (
            <TableRow sx={{ display: expandedCollapsable ? 'auto' : 'none' }}>
              <TableCell
                  colSpan={props.columns.length}
                  style={{
                    padding: 0,
                    height: expandedCollapsable ? 'auto' : 0,
                    transition: 'height 300ms',
                  }}
              >
                <Collapse
                    in={expandedCollapsable}
                    timeout="auto"
                    unmountOnExit={false}
                    style={{ width: '90%', justifySelf: 'center' }}
                >
                  {
                      collapsableColumn && collapsableColumn?.getCollapsable &&
                      collapsableColumn?.getCollapsable(props.entity)
                  }
                </Collapse>
              </TableCell>
            </TableRow>
        )}
      </React.Fragment>
  );
}

interface TableTotalsRowEntityProps<T> {
  totalsRowMapList: TotalsRowMap<T>[];
  entityList: T[] | null | undefined;
  columns: ITableColumn[];
}

function TableTotalsRowEntity<T>(props: TableTotalsRowEntityProps<T>) {
  const classes = useStyles();

  return (
      <TableRow>
        <TableCell
            variant={'footer'}
            style={{ borderBottom: 'none' }}
            className={props.columns[0]?.sticky ? classes.stickyColumn : ''}
        >
          <Typography sx={{ fontWeight: 800 }}>TOTAL</Typography>
        </TableCell>
        {props.columns.slice(1).map((c, idx) => {
          const map = props.totalsRowMapList?.find(
              (map) => map.columnIndex === idx + 1,
          );
          const chartColumn =
              props.columns[idx + 1].type === TableColumnType.Chart;
          const stickyClass = props.columns[idx + 1]?.sticky ? classes.stickyColumn : '';

          const totalValue =
            (!chartColumn && !!map) ? 
              props.entityList?.reduce((sum, curr: any) => sum + curr?.[map.entityField], 0)
              :
              0;
          const textAlign: string = c.textAlign || 'center';
          
          let cell = (
              <TableCell
                  variant={'footer'}
                  style={chartColumn ? { border: 'none' } : { borderBottom: 'none' }}
                  className={stickyClass}
              />
          );
          if (chartColumn) {
            cell = <></>;
          }
          if (map) {
            let cellContent: string | React.ReactElement = "";
            
            switch (c.type) {
              case TableColumnType.Currency:
                cellContent = numberFormatter.toStringWithAmount(totalValue, c.currency || '$');
                break;
              default:
                if (props.columns[idx + 1]?.onRenderCell) 
                  cellContent = React.cloneElement(
                    props.columns[idx + 1].onRenderCell!({
                      [map.entityField]: totalValue,
                    }),
                    { sx: { color: 'primary.main', fontWeight: 800, ...map.sxOverride } },
                  )
                else 
                  cellContent = `${totalValue}`
            }
            
            cell = (
                <TableCell variant={'footer'} 
                           style={{ borderBottom: 'none', textAlign: textAlign }} 
                           className={stickyClass}
                >
                  {cellContent}
                </TableCell>
            );
          }
          return cell;
        })}
      </TableRow>
  );
}

interface ITableRowHeaderProps {
  columns: ITableColumn[];
  headerGroups?: TableColumnByGroupLabel;
  sortGroups?: boolean;
}

export function TableRowHeader(props: ITableRowHeaderProps) {
  const classes = useStyles();

  const renderTitleComponent = (title: string) =>
      <Typography variant={'caption'}
                  fontWeight={500}
                  color={themeColorDefinition.UIElements.texts.default}
                  textTransform={'none'}
      >
        {title}
      </Typography>;

    const renderGroupHeaders = () => {
        if (!props.headerGroups) return null;

        const visibleCols = props.columns.filter(c => !c.hidden);

        if (props.sortGroups) {
            const headers = Object.keys(props.headerGroups).sort();
            if (headers.length === 0) return null;

            return (
                <TableRow>
                    <TableCell
                        variant="head"
                        className={props.columns[0]?.sticky ? classes.stickyColumnHeader : ''}
                        sx={{
                            textAlign: 'left',
                            borderBottom: 'none',
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.tertiary
                        }}
                    />
                    {headers.map(oneHeader => {
                        const count = props.headerGroups![oneHeader];
                        return (
                            <TableCell
                                key={`year-group-${oneHeader}`}
                                variant="head"
                                colSpan={count}
                                sx={{
                                    textAlign: 'center',
                                    borderBottom: 'none',
                                    backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                                    fontWeight: 'bold'
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight={400}
                                            color={themeColorDefinition.UIElements.texts.default}>
                                    {oneHeader}
                                </Typography>
                            </TableCell>
                        );
                    })}
                </TableRow>
            );
        }

        const firstGroupedIdx = visibleCols.findIndex(c => !!c.headerGroup);
        const leadingNoGroup = firstGroupedIdx === -1 ? visibleCols.length : firstGroupedIdx;

        const groupOrder = visibleCols
            .map(c => c.headerGroup)
            .filter((g): g is string => !!g)
            .filter((g, i, arr) => arr.indexOf(g) === i);

        const countFor = (g: string) =>
            visibleCols.filter(c => c.headerGroup === g).length ||
            props.headerGroups![g] ||
            0;

        return (
            <TableRow>
                {leadingNoGroup > 0 && (
                    <TableCell
                        variant="head"
                        colSpan={leadingNoGroup}
                        className={visibleCols[0]?.sticky ? classes.stickyColumnHeader : ''}
                        sx={{
                            textAlign: 'left',
                            borderBottom: 'none',
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.tertiary,
                        }}
                    />
                )}
                {groupOrder.map(g => (
                    <TableCell key={`group-${g}`}
                               variant="head"
                               colSpan={countFor(g)}
                               sx={{
                                   textAlign: 'center',
                                   borderBottom: 'none',
                                   backgroundColor: themeColorDefinition.UIElements.backgrounds.tertiary
                               }}>
                        <Typography variant="subtitle2" fontWeight={400}
                                    color={themeColorDefinition.UIElements.texts.default}>
                            {g}
                        </Typography>
                    </TableCell>
                ))}
            </TableRow>
        );
    };

    return (
      <>
        {renderGroupHeaders()}
        <TableRow>
          {props.columns.map((oneColumn, index) => {
            if (oneColumn.hidden) return undefined;

            const stickyClass = oneColumn.sticky ? classes.stickyColumnHeader : '';
            const finalClassName = clsx(
                oneColumn.minPadding ? 'min-padding' : '',
                stickyClass
            );

            return (
                <TableCell
                    key={`${oneColumn.value}_${index}`}
                    variant={'head'}
                    className={finalClassName}
                    sx={{
                      textAlign: oneColumn.textAlignHeader ?? 'left'
                    }}
                    width={oneColumn.width}
                >
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
                </TableCell>
            );
          })}
        </TableRow>
      </>
  );
}

interface ITableCardHeaderProps {
  title: string | React.ReactNode;
  action?: React.ReactNode;
  onReload?: () => void;
  onToggleShowChildren?: () => void;
  onNewRegister?: () => void;
  newRegisterTitle?: string;
  childrenName?: string;
}

export function TableCardHeader(props: ITableCardHeaderProps) {
  const classes = useStyles();

  const [filterExpanded, setFilterExpanded] = useState<Boolean>(true);

  const onToggleClicked = () => {
    if (props.onToggleShowChildren) {
      props.onToggleShowChildren();
    }
    return setFilterExpanded(!filterExpanded);
  };

  return (
      <CardHeader
          title={props.title}
          sx={{ p: 2, alignItems: 'center', '& .MuiCardHeader-action': { margin: '0px' } }}
          action={
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              {props?.action}
              {props.onToggleShowChildren && (
                  <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={filterExpanded ? <ExpandLess /> : <ExpandMore />}
                      className={classes.botones}
                      onClick={onToggleClicked}
                  >
                    {props.childrenName}
                  </Button>
              )}
              {props.onNewRegister && (
                  <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<AddIcon />}
                      className={classes.botones}
                      onClick={props.onNewRegister}
                  >
                    {props.newRegisterTitle ?? 'Nuevo'}
                  </Button>
              )}
              {props.onReload && (
                  <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<SyncIcon />}
                      className={classes.botones}
                      onClick={props.onReload}
                  >
                    Recargar
                  </Button>
              )}
            </Stack>
          }
      />
  );
}

interface ITableBodyEntityListProps<T> {
  entityList: T[] | null | undefined;
  columns: ITableColumn[];
  isLoading: boolean;
  error: boolean;
  totalsRowMapList?: TotalsRowMap<T>[];
  loadingWithSkeleton?: boolean;
  onRowClick?: (entity: T) => void;
  headerGroups?: TableColumnByGroupLabel;
}

export function TableBodyEntityList<T>(props: ITableBodyEntityListProps<T>) {
  return (
      <>
        {props.error ? (
            <TableWithError colSpan={props.columns.length} />
        ) : props.isLoading ? (
            props.loadingWithSkeleton ? (
                <TableLoadingSkeleton colSpan={props.columns.length} />
            ) : (
                <TableLoading colSpan={props.columns.length} />
            )
        ) : props.entityList ? (
            props.entityList.length > 0 ? (
                <>
                  {props.entityList.map((oneEntity, index) => {
                    let keyTableRowEntity: string = `${(oneEntity as any)['id']}_${index}`;
                    return (
                        <TableRowEntity
                            key={keyTableRowEntity}
                            keyComponent={keyTableRowEntity}
                            entity={oneEntity as any}
                            columns={props.columns}
                            firstRow={index === 0}
                            onRowClick={props.onRowClick}
                        />
                    );
                  })}
                    
                  {props?.totalsRowMapList && (
                      <TableTotalsRowEntity
                          columns={props.columns}
                          entityList={props.entityList}
                          totalsRowMapList={props.totalsRowMapList}
                      />
                  )}
                  {props.columns.map((e) => e.type).includes(TableColumnType.Chart) &&
                      [...Array(Math.max(5 - props.entityList.length, 0))].map(() => (
                          <TableRow>
                            <TableCell
                                colSpan={props.columns.length}
                                style={{ border: 'none' }}
                            >
                              {' '}
                            </TableCell>
                          </TableRow>
                      ))}
                </>
            ) : (
                <TableWithoutData colSpan={props.columns.length} />
            )
        ) : (
            <TableWithError colSpan={props.columns.length} />
        )}
      </>
  );
}