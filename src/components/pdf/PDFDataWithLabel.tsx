import { Text, View } from '@react-pdf/renderer';
import React from 'react';
import { greyColorDisabled } from '../../util/themes/ThemeItapTec';
import { Style } from '@react-pdf/types';

interface PDFDataWithLabelProps {
  label: string;
  data: string;
  addColon?: boolean;
  contentStyle?: Style;
  labelStyle?: Style;
  mediumWidth?: boolean;
}

function PDFDataWithLabel({
  label,
  data,
  addColon,
  contentStyle,
  labelStyle,
}: PDFDataWithLabelProps) {
  const isSpaceBetween = contentStyle?.justifyContent === 'space-between';

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        ...contentStyle,
      }}
    >
      <View style={{ width: isSpaceBetween ? '50%' : undefined }}>
        <Text
          style={{
            fontWeight: 500,
            color: greyColorDisabled,
            fontSize: '9px',
            ...labelStyle,
          }}
        >
          {`${label}${addColon ? ':' : ''}`}
        </Text>
      </View>
      <View style={{ width: isSpaceBetween ? '50%' : undefined }}>
        <Text style={{ fontWeight: 600, color: 'black', fontSize: '10px' }}>
          {data}
        </Text>
      </View>
    </View>
  );
}

export { PDFDataWithLabel };
