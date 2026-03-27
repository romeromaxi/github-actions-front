import React, { ReactElement } from 'react';
import { Text, View } from '@react-pdf/renderer';

interface PDFViewSectionProps {
  title: string;
  width?: number | string;
  backgroundColor?: string;
  children?: ReactElement | ReactElement[];
}

function PDFViewSection({
  title,
  width,
  backgroundColor,
  children,
}: PDFViewSectionProps) {
  return (
    <View style={{ width: width }}>
      <Text
        style={{
          paddingTop: '8px',
          paddingBottom: '8px',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: backgroundColor,
          borderRadius: '4px',
          color: 'white',
        }}
      >
        {title.toUpperCase()}
      </Text>

      <View
        style={{
          marginTop: '10px',
          gap: 8,
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        {children}
      </View>
    </View>
  );
}

export { PDFViewSection };
