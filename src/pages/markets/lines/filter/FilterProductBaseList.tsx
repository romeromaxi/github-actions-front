import React, { useContext, useEffect, useState } from 'react';
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import FilterProductBaseAccordion from './FilterProductBaseAccordion';
import MarketTypography from '../../components/MarketTypography';
import {ProductLineFilterContext} from '../ProductLineSearch';
import {
    EntityWithBooleanIdAndDescription,
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields,
    EntityWithIdAndDescriptionQuantity,
    EntityWithIdFields,
} from 'types/baseEntities';
import { Skeleton } from '@mui/lab';

interface FilterProductBaseListProps {
  title: string;
  name: string;
  loadOptions?: () => Promise<EntityWithIdAndDescriptionQuantity[]>;
  defaultOptions?: EntityWithIdAndDescriptionQuantity[];
  hiddenByField?: boolean;
}

function FilterProductBaseList({
  title,
  name,
  loadOptions, defaultOptions,
  hiddenByField,
}: FilterProductBaseListProps) {
  const { filters, setFieldFilter, selectedValues } = useContext(
    ProductLineFilterContext,
  );
  // @ts-ignore
  const codsSelected: number[] = (filters[name] as number[]) ?? [];
  const isApplied: boolean = !!codsSelected && !!codsSelected.length;
  const selectedLength: number = codsSelected?.length;
  /*const hidden: boolean =
    !!lineFields &&
    lineFields.every(
      (x) =>
        x[LineProductFieldFields.LineProductFieldDescription].toLowerCase() !==
        name.toLowerCase(),
    );
*/
  
  const [options, setOptions] = useState<EntityWithIdAndDescriptionQuantity[]>();

  useEffect(() => {
    setOptions(undefined);
    loadOptions && loadOptions().then(setOptions);
  }, [loadOptions]);

  const toggleListItem = (value: EntityWithBooleanIdAndDescription, list: EntityWithBooleanIdAndDescription[]) => {
    const ids = list.map((i) => i.id)
    const currentIndex = ids.indexOf(value[EntityWithIdFields.Id]);
    if (currentIndex === -1) list.push(value)
    else list.splice(currentIndex, 1);
  };

  const updateList = (list: EntityWithIdAndDescription[]) => {
    const newSelected: EntityWithBooleanIdAndDescription[] = selectedValues[name] || [];
    list.forEach((i) => {
      toggleListItem(i, newSelected);
    });
    // @ts-ignore
    setFieldFilter(newSelected, name);
  };
  
  const renderOptions = (option: EntityWithIdAndDescriptionQuantity) => {
    // @ts-ignore
    return (
        <ListItem sx={{ mb: -1, p: 0, pb: 0.5 }}
                  key={option[EntityWithIdFields.Id]}
        >
          <ListItemButton
              disableRipple
              onClick={handleToggle(option)}
          >
            <ListItemIcon sx={{ mr: -3, p: 0 }}>
              <Checkbox
                  edge="start"
                  checked={codsSelected.includes(
                      option[EntityWithIdFields.Id],
                  )}
                  tabIndex={-1}
                  disableRipple
              />
            </ListItemIcon>
            <ListItemText
                disableTypography={true}
                primary={
                  <Stack
                      direction={'row'}
                      spacing={1} width={1}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                  >
                    <MarketTypography color="text.lighter"
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textTransform: 'capitalize',
                          p: 0
                        }}
                    >
                      {option[
                          EntityWithIdAndDescriptionFields.Description
                          ].toLowerCase()}
                    </MarketTypography>

                    {/*{option.hasOwnProperty(
                        EntityWithIdAndDescriptionQuantityFields.Quantity,
                    ) ? (
                        <MarketTypography
                            sx={{
                              fontSize: '0.795rem',
                              fontWeight: 400,
                              color: 'text.disabled',
                            }}
                        >
                            {`(${
                                option[EntityWithIdAndDescriptionQuantityFields.Quantity]
                            })`}
                        </MarketTypography>
                    ) : (
                        <></>
                    )}*/}
                  </Stack>
                }
            />
          </ListItemButton>
        </ListItem>
    );
  }

  const handleToggle = (option: EntityWithIdAndDescriptionQuantity) => () => updateList([option]);

  return !hiddenByField ? (
      !options || !!options.length || defaultOptions ?
            <FilterProductBaseAccordion
              title={title}
              isApplied={isApplied}
              length={selectedLength}
            >
              <List dense component={'div'} disablePadding sx={{ mb: 2 }}>
                {!!options ? (
                  options?.map(renderOptions)
                ) : 
                !!defaultOptions ? (
                    defaultOptions?.map(renderOptions)
                    )
                  :    
                (
                  <Stack spacing={1} mt={1}>
                    {Array.from(Array(3).keys()).map((item) => (
                      <Skeleton key={`filterProductBaseList_${name}_${item}`} />
                    ))}
                  </Stack>
                )}
              </List>
            </FilterProductBaseAccordion>
          :
          <></>
  ) : (
    <></>
  );
}

export default FilterProductBaseList;
