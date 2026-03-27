import { Document, Page, View } from '@react-pdf/renderer';
import styles from './PDFDocumentStyles.styles';
import { ReactElement } from 'react';

interface PDFDocumentLayoutProps {
  title: string;
  children: ReactElement | ReactElement[];
}

function PDFDocumentLayout({ title, children }: PDFDocumentLayoutProps) {
  return (
    <Document style={{ fontFamily: 'Inter' }} title={title}>
      <PDFDocumentPage>{children}</PDFDocumentPage>
    </Document>
  );
}

interface PDFDocumentPageProps {
  children: ReactElement | ReactElement[];
}

function PDFDocumentPage({ children }: PDFDocumentPageProps) {
  return (
    <Page size={'A4'} style={[styles.base]}>
      <View style={[styles.content]}>{children}</View>
    </Page>
  );
}

export { PDFDocumentLayout, PDFDocumentPage };
