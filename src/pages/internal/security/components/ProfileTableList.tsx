import { ITableColumn, TableList } from '../../../../components/table';
import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../../types/baseEntities';
import { Button } from '@mui/material';
import { SearchButton } from '../../../../components/buttons/Buttons';

interface ProfileTableListProps {
  profiles?: EntityWithIdAndDescription[];
  onClickProfile: (profile: EntityWithIdAndDescription) => void;
}

function ProfileTableList({ profiles, onClickProfile }: ProfileTableListProps) {
  const columns: ITableColumn[] = [
    { label: 'Perfiles', value: EntityWithIdAndDescriptionFields.Description },
    {
      label: '',
      value: '',
      onRenderCell: (profile: EntityWithIdAndDescription) => (
        <SearchButton
          color={'inherit'}
          size={'small'}
          onClick={() => onClickProfile(profile)}
        >
          Ver
        </SearchButton>
      ),
    },
  ];

  return (
    <TableList<EntityWithIdAndDescription>
      entityList={profiles}
      onRowClick={onClickProfile}
      columns={columns}
      isLoading={!profiles}
      error={false}
      keepBorderRadius
    />
  );
}

export default ProfileTableList;
