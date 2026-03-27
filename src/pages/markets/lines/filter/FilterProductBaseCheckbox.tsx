import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import FilterProductBaseAccordion from './FilterProductBaseAccordion';
import MarketTypography from '../../components/MarketTypography';
import { ProductLineFilterContext } from '../ProductLineSearch';
import { FilterProductLineSearchFields } from 'types/lines/productLineData';

interface FilterProductBaseCheckboxProps {
  title: string;
  name: FilterProductLineSearchFields;
  label: string;
}

function FilterProductBaseCheckbox({
  title,
  name,
  label,
}: FilterProductBaseCheckboxProps) {
  const { filters, setFieldFilter } = useContext(ProductLineFilterContext);
  const valueFilter = !!filters[name]
  const [checkedValue, setCheckedValue] = useState<boolean>(valueFilter)

  useEffect(() => {
        if (filters[name]) {
            setCheckedValue(filters[name].some(i => i === true))
        }
  }, [filters[name]]);
  const handleChange = () => {
      const newEntity = [{
          id: !checkedValue, descripcion: label
      }]
      setFieldFilter(newEntity, name);
      setCheckedValue(!checkedValue)
  }

  return (
    <FilterProductBaseAccordion title={title} isApplied={checkedValue}>
      <ListItem sx={{ mb: -1 }} key={`${title.replaceAll(' ', '-')}-filtro`}>
        <ListItemButton disableRipple onClick={handleChange}>
          <ListItemIcon sx={{ mr: -3 }}>
            <Checkbox
              edge="start"
              checked={checkedValue}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText
            disableTypography={true}
            primary={
              <MarketTypography color="text.lighter"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}
              >
                {label}
              </MarketTypography>
            }
          />
        </ListItemButton>
      </ListItem>
        {
            /*
              <Stack alignItems={'center'} pt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => setFieldFilter(undefined, name)}
                >
                  Limpiar
                </Button>
              </Stack>
             */
        }
    </FilterProductBaseAccordion>
  );
}

export default FilterProductBaseCheckbox;
