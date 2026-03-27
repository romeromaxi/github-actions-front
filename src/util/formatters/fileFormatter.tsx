import { SvgIcon, SvgIconProps } from '@mui/material';
import {
  FileBase,
  FileBaseFields,
  FileBaseInsertFields,
} from 'types/files/filesData';
import { ReactComponent as DOCImportedSVG } from 'assets/svgs/doc-svg.svg';
import { ReactComponent as ZipImportedSVG } from 'assets/svgs/zip-svg.svg';
import { ReactComponent as FolderThemeSVG } from 'assets/svgs/folder-fill.svg';
import { ReactComponent as FolderThemeOpenSVG } from 'assets/svgs/folder-open-fill.svg';
import { ReactComponent as JPGImportedSVG } from 'assets/svgs/jpg-svg.svg';
import { ReactComponent as PDFImportedSVG } from 'assets/svgs/pdf-svg.svg';
import { ReactComponent as PNGImportedSVG } from 'assets/svgs/png-svg.svg';
import { ReactComponent as PPTImportedSVG } from 'assets/svgs/ppt-svg.svg';
import { ReactComponent as TXTImportedSVG } from 'assets/svgs/txt-svg.svg';
import { ReactComponent as XLSImportedSVG } from 'assets/svgs/xls-svg.svg';
import { ReactComponent as FolderTableSVG } from 'assets/svgs/folder-table-svg.svg';

const getExtensionFile = (descFile: string): string => {
  if (!descFile || descFile == '' || !descFile?.includes('.')) return '';

  return descFile
    .slice(((descFile.lastIndexOf('.') - 1) >>> 0) + 2)
    .toLowerCase();
};

export const getFormDataFileInsert = (
  fileBase: FileBase,
  file: File,
): FormData => {
  let formData: FormData = new FormData();
  let codModulo: number = 1;
  let codOrigen: number = 1;

  formData.append(
    FileBaseInsertFields.DocumentId,
    fileBase[FileBaseFields.DocumentId].toString(),
  );
  formData.append(
    FileBaseInsertFields.FileSize,
    fileBase[FileBaseFields.FileSize].toString(),
  );
  formData.append(
    FileBaseInsertFields.HasPhysicalFile,
    fileBase[FileBaseFields.HasPhysicalFile]?.toString() || 'false',
  );
  formData.append(FileBaseInsertFields.ModuleCode, codModulo.toString());
  formData.append(FileBaseInsertFields.OriginCode, codOrigen.toString());
  formData.append(
    FileBaseInsertFields.File,
    file,
    fileBase[FileBaseFields.FileDesc],
  );

  return formData;
};

export const fileFormatter = {
  getIconByFileName: (fileName: string, props: SvgIconProps = {}) => {
    switch (getExtensionFile(fileName)) {
      case 'pdf':
        return (
          <SvgIcon
            component={PDFImportedSVG}
            viewBox="0 0 384 512"
            {...props}
          />
        );
      case 'txt':
        return (
          <SvgIcon
            component={TXTImportedSVG}
            viewBox="0 0 384 512"
            {...props}
          />
        );
      case 'xls':
      case 'xlsx':
        return (
          <SvgIcon
            component={XLSImportedSVG}
            viewBox="0 0 384 512"
            {...props}
          />
        );
      case 'doc':
      case 'docx':
        return (
          <SvgIcon
            component={DOCImportedSVG}
            viewBox="0 0 384 512"
            {...props}
          />
        );
      case 'ppt':
      case 'pptx':
        return (
            <SvgIcon
                component={PPTImportedSVG}
                viewBox="0 0 384 512"
                {...props}
            />
        );
      case 'jpeg':
      case 'jpg':
        return (
          <SvgIcon
            component={JPGImportedSVG}
            viewBox="0 0 384 512"
            {...props}
          />
        );
      case 'bmp':
      case 'png':
        return (
          <SvgIcon
            component={PNGImportedSVG}
            viewBox="0 0 384 512"
            {...props}
          />
        );
      default:
        return (
          <svg
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            fill="#000000"
            width="40"
            height="40"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g transform="translate(0 -1028.4)">
                <path
                  d="m5 1030.4c-1.1046 0-2 0.9-2 2v8 4 6c0 1.1 0.8954 2 2 2h14c1.105 0 2-0.9 2-2v-6-4-4l-6-6h-10z"
                  fill="#95a5a6"
                ></path>
                <path
                  d="m5 1029.4c-1.1046 0-2 0.9-2 2v8 4 6c0 1.1 0.8954 2 2 2h14c1.105 0 2-0.9 2-2v-6-4-4l-6-6h-10z"
                  fill="#bdc3c7"
                ></path>
                <path
                  d="m21 1035.4-6-6v4c0 1.1 0.895 2 2 2h4z"
                  fill="#95a5a6"
                ></path>
                <path
                  d="m6 8v1h12v-1h-12zm0 3v1h12v-1h-12zm0 3v1h12v-1h-12zm0 3v1h12v-1h-12z"
                  transform="translate(0 1028.4)"
                  fill="#95a5a6"
                ></path>
              </g>
            </g>
          </svg>
        );
    }
  },

  getIconFolder: (props: SvgIconProps = {}) => {
    return (
      <SvgIcon component={ZipImportedSVG} viewBox="0 0 70 70" {...props} />
    );
  },

  getIconFolderTheme: (props: SvgIconProps = {}) => {
    return (
        <SvgIcon component={FolderThemeSVG} inheritViewBox {...props} />
    );
  },

  getIconFolderThemeOpen: (props: SvgIconProps = {}) => {
    return (
        <SvgIcon component={FolderThemeOpenSVG} inheritViewBox {...props} />
    );
  },

  getIconFolderTableTheme: (props: SvgIconProps = {}) => {
    return (
      <SvgIcon component={FolderTableSVG} viewBox="0 0 512 512" sx={{ width: '35px !important', paddingLeft: '7px' }} {...props} />
    );
  },
};
