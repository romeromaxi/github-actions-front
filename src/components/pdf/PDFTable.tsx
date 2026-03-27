import { Text, View } from '@react-pdf/renderer';
import React from 'react';
import styles from './PDFDocumentStyles.styles';
import { Style } from '@react-pdf/types';

interface IPDFRowColumn {
  label: string;
  style?: Style;
}

interface PDFRowProps {
  columns: IPDFRowColumn[];
  isHeader?: boolean;
  contentStyle?: Style;
}

function PDFRow(props: PDFRowProps) {
  const styleColumnBase = { fontSize: '9px' };

  return (
    <View
      style={[
        props.isHeader ? styles.rowHeaderTable : {},
        styles.rowTable,
        {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 8,
        },
      ]}
    >
      {props.columns.map((column, index) => (
        <View
          key={`pdfRow_${index}`}
          style={[column.style || styleColumnBase, { width: '100%' }]}
        >
          <Text>{column.label}</Text>
        </View>
      ))}
    </View>
  );
}

export { PDFRow };
