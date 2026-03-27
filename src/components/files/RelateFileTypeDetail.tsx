import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
} from '../../types/baseEntities';
import { Stack, Checkbox, Typography } from '@mui/material';
import { fileFormatter } from '../../util/formatters/fileFormatter';

interface RelateFileTypeDetailProps {
  entity: EntityWithIdAndDescription;
  onSelect: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  selected: boolean;
}

const RelateFileTypeDetail = ({
  entity,
  onSelect,
  selected,
}: RelateFileTypeDetailProps) => {
  return (
    <Stack direction="row" alignItems={'center'}>
      <Checkbox
        value={entity[EntityWithIdAndDescriptionFields.Id]}
        onChange={(e) => {
          onSelect(e, entity[EntityWithIdAndDescriptionFields.Id]);
        }}
        checked={selected}
        size={'small'}
      />
      <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
        {fileFormatter.getIconFolderThemeOpen()}
        <Typography fontSize={14} fontWeight={500}>
          {entity[EntityWithIdAndDescriptionFields.Description]}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default RelateFileTypeDetail;
