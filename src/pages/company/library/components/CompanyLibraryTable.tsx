import {useContext} from "react";
import {Button, Grid, Stack, Tooltip, Typography} from "@mui/material";
import {ButtonIconDropdown, MenuItemDropdown} from "components/buttons/Buttons";
import { WrapperIcons } from "components/icons/Icons";
import {TableList } from "components/table";
import {CompanyLibraryFoldersContext, FileWithFolderData} from "../folders/CompanyLibraryFolders";
import {ITableColumn} from "components/table";
import { TypographyBase } from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {fileFormatter} from "util/formatters/fileFormatter";
import { FolderSimple } from "@phosphor-icons/react";
import {dateFormatter} from "util/formatters/dateFormatter";

interface CompanyLibraryTableProps {
    variant: 'standard' | 'folder';
    onRelateToFolder?: (file: FileWithFolderData) => void;
    getDropdownItems: (obj: FileWithFolderData) => MenuItemDropdown[];
}

const CompanyLibraryTable = ({
                                 variant = 'standard',
                                 onRelateToFolder,
                                 getDropdownItems
                             }: CompanyLibraryTableProps) => {
    const { filesWithFolders, setCurrentFolder } = useContext(CompanyLibraryFoldersContext);
    
    const renderFileTitle = (obj: FileWithFolderData) => {
        const isFolder = obj.type === 'folder';

        if (variant === 'folder' && isFolder) {
            return (
                <Grid container onClick={() => setCurrentFolder?.(obj.id)} style={{ cursor: 'pointer' }}>
                    <Grid item xs={12} textAlign={'left'}>
                        <Stack alignItems={'center'} spacing={2} direction={'row'}>
                            {fileFormatter.getIconFolderTableTheme({ fontSize: 'large' })}
                            <Typography>{obj.name}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Stack alignItems={'center'} spacing={2} direction={'row'} maxWidth={250}>
                {obj.numberDocs
                    ? obj.numberDocs > 1
                        ? fileFormatter.getIconFolder({ fontSize: 'large' })
                        : fileFormatter.getIconByFileName(obj.name, {
                            fontSize: 'large',
                        })
                    : fileFormatter.getIconByFileName(obj.name, {
                        fontSize: 'large',
                    })}
                <Stack overflow={'hidden'}>
                    <TypographyBase variant={'body2'} fontWeight={500} maxLines={2} tooltip>
                        {obj.title}
                    </TypographyBase>
                    <div>
                        <TypographyBase color="text.lighter" variant={'caption'} fontWeight={500} maxLines={2} tooltip>
                            {stringFormatter.cutIfHaveMoreThan(obj.name, 40)}
                        </TypographyBase>
                    </div>
                </Stack>
            </Stack>
        );
    };

    const renderSectionSubsection = (obj: FileWithFolderData) => (
        obj.type === 'folder' ?
            <Typography></Typography>
            :
            <Stack textAlign={'start'}>
                <Typography>{obj.descSeccion}</Typography>
                <TypographyBase variant={'caption'} color={'text.lighter'}>
                    {obj.descArchivoTipo}
                </TypographyBase>
            </Stack>
    );

    const renderUploadDate = (obj: FileWithFolderData) => {
        if (obj.type === 'folder') return (<Typography></Typography>);
        
        return (
            <Typography>
                {dateFormatter.toShortDate(obj.uploadDate)}
            </Typography>
        )
    };

    const renderRelatedFolders = (obj: FileWithFolderData) => {
        if (obj.type === 'folder') return (<Typography></Typography>);

        return (
            <Stack>
                <Tooltip title={'Click para ver y relacionar carpetas'}>
                    <Button onClick={() => onRelateToFolder?.(obj)}
                            size={'small'}
                            color={'primary'}
                            startIcon={<WrapperIcons Icon={FolderSimple} size={'sm'} />}
                            sx={{ margin: '0' }}
                    >
                        {obj.cantidadCarpetasRelacionadas ?? 0}
                    </Button>
                </Tooltip>
            </Stack>
        )
    };
        
    const columns: ITableColumn[] = [
        {
            label: 'Nombre',
            textAlign: 'left',
            onRenderCell: renderFileTitle,
        },
        {
            label: 'Sección / Subsección',
            onRenderCell: renderSectionSubsection
        },
        {
            label: 'Relación',
            value: 'descDatoRelacionado',
            onRenderCell: (obj: FileWithFolderData) => (
                <Typography>{obj.type === 'folder' ? '' : obj.descDatoRelacionado ?? '-'}</Typography>
            )
        },
        {
            label: 'Fecha Subida',
            onRenderCell: renderUploadDate
        },
        {
            label: 'Carpetas Personalizadas',
            onRenderCell: renderRelatedFolders
        },
        {
            label: '',
            onRenderCell: (obj: FileWithFolderData) => (
                <ButtonIconDropdown
                    label={''}
                    items={getDropdownItems(obj)}
                    size={'small'}
                    id={"company-library-dropdown-btn"}
                />
            ),
        },
    ];
    
    return (
        <TableList
            entityList={filesWithFolders}
            columns={columns}
            isLoading={!filesWithFolders}
            error={false}
        />
    );
};

export default CompanyLibraryTable;