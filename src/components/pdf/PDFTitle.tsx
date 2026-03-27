import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import styles from './PDFDocumentStyles.styles';

interface PDFTitleProps {
  title: string;
}

function PDFTitle({ title }: PDFTitleProps) {
  return (
    <Text style={[styles.divider, { fontWeight: 600, lineHeight: 1.5 }]}>
      {title}
    </Text>
  );
}

function PDFSubTitle({ title }: PDFTitleProps) {
  return (
    <Text style={[styles.divider, { color: '#1565C0', fontSize: '10px' }]}>
      {title}
    </Text>
  );
}

interface PDFTitleProps {
  title: string;
  subtitle?: string;
}

function PDFTitleCard({ title, subtitle }: PDFTitleProps) {
  return (
    <View style={[styles.divider, { gap: 0 }]}>
      <Text style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.5 }}>
        {title}
      </Text>
      {subtitle && <Text style={[styles.subtitle]}>{subtitle}</Text>}
    </View>
  );
}

export { PDFTitle, PDFSubTitle, PDFTitleCard };
