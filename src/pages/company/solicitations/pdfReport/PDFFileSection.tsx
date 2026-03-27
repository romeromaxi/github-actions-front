import { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { PDFViewSection } from 'components/pdf';

interface PDFFileSectionProps {
  children?: ReactElement | ReactElement[];
}

function PDFFileSection({ children }: PDFFileSectionProps) {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <PDFViewSection title={'Legajo'} width={'100%'} backgroundColor={'black'}>
        {children}
      </PDFViewSection>
    </View>
  );
}

export default PDFFileSection;
