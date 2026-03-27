import { DataWithLabel } from '../misc/DataWithLabel';
import {
  TotalFinancialDataProps,
  TotalFinancialLabelProps,
} from './TotalFinancialYearText.styles';

interface TotalFinancialYearTextProps {
  label: string;
  data: string;
}

export function TotalFinancialYearText(props: TotalFinancialYearTextProps) {
  return (
    <DataWithLabel
      label={props.label}
      data={props.data}
      labelProps={TotalFinancialLabelProps}
      dataProps={TotalFinancialDataProps}
      rowDirection
    />
  );
}
