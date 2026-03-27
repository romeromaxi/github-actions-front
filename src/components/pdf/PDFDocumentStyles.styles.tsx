import { StyleSheet } from '@react-pdf/renderer';
import { greyColorDisabled } from '../../util/themes/ThemeItapTec';

const styles = StyleSheet.create({
  base: {
    fontSize: 12,
    lineHeight: 1.2,
    color: '#3f4348',
  },
  content: {
    margin: '0.6cm 0.8cm 0.8cm 0.8cm',
    gap: 4,
  },
  divider: {
    borderBottomColor: '#E0E0E0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '0.5px',
  },
  subtitle: {
    fontWeight: 500,
    color: greyColorDisabled,
    fontSize: '9px',
  },
  rowHeaderTable: {
    fontWeight: 800,
    backgroundColor: '#F5F8FABF',
    color: '#7E8299',
    padding: '6px 0px',
  },
  rowTable: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#EFF2F5',
  },
});

export default styles;
