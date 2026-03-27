import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  IconButton, Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import { useAction } from "hooks/useAction";
import useAxios from "hooks/useAxios";
import {Fragment, useEffect, useState} from "react";
import { EntityWithIdAndDescription, EntityWithIdAndDescriptionFields, EntityWithIdFields } from "types/baseEntities";
import {SecurityObjectDetail, SecurityObjectFields, SecurityObjectGroupedDetail, SecurityObjectGroupedDetailFields } from "types/security";
import {CloseButton, SendButton} from "../../../../components/buttons/Buttons";
import {HttpCacheSecurityObject} from "../../../../http";
import {ITableColumn, TableList} from "../../../../components/table";


interface ProfileAdminPermissionsProps {
  profile: EntityWithIdAndDescription;
  onBackPage: () => void;
}

function ProfileAdminPermissions({
                                   profile,
                                   onBackPage,
                                 }: ProfileAdminPermissionsProps) {
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const [groups, setGroups] = useState<SecurityObjectGroupedDetail[]>([]);
  const [idsSecurityObjects, setIdsSecurityObjects] = useState<number[]>([]);

    const onSelectSecurityObject = (object: SecurityObjectDetail) => {
        const idObject: number = object[EntityWithIdFields.Id];
        setIdsSecurityObjects(prev =>
            prev.includes(idObject)
                ? prev.filter(x => x !== idObject)
                : [...prev, idObject]
        );
    };

    const onToggleGroupAll = (
        objects: SecurityObjectDetail[],
        checked: boolean
    ) => {
        setIdsSecurityObjects(prev => {
            const next = new Set(prev);
            for (const obj of objects) {
                const id = obj[EntityWithIdFields.Id];
                if (checked) next.add(id);
                else next.delete(id);
            }
            return Array.from(next);
        });
    };

  const updateProfile = () => {
    fetchData(
        () =>
            HttpCacheSecurityObject.updateProfilePermissions(
                profile[EntityWithIdFields.Id],
                idsSecurityObjects,
            ),
        true,
    ).then(() => {
      snackbarSuccess(
          'Los permisos del perfil se han actualizado exitosamente',
      );
      onBackPage();
    });
  };

  useEffect(() => {
    setGroups([]);
    setIdsSecurityObjects([]);
    HttpCacheSecurityObject.getGroupedObjects(
        profile[EntityWithIdFields.Id],
    ).then((response) => {
      setGroups(response);
      setIdsSecurityObjects(
          response
              .flatMap((g) => g[SecurityObjectGroupedDetailFields.SecurityObjects])
              .filter((x) => x[SecurityObjectFields.HasPermissions])
              .map((x) => x[EntityWithIdFields.Id]),
      );
    });
  }, [profile]);

  return (
      <Card>
        <CardHeader
            title={profile[EntityWithIdAndDescriptionFields.Description]}
        />
        <CardContent>
          <Table>
            <TableBody>
              {groups.map((group) => (
                  <GroupRow
                      key={group[EntityWithIdFields.Id]}
                      group={group}
                      idsSecurityObjects={idsSecurityObjects}
                      onSelectSecurityObject={onSelectSecurityObject}
                      onToggleGroupAll={onToggleGroupAll}
                  />
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardActions>
          <CloseButton
              onClick={onBackPage}
              sx={{ marginRight: 1 }}
              size="small"
              variant="outlined"
          >
            Cancelar
          </CloseButton>
          <SendButton onClick={updateProfile} size="small">
            Guardar
          </SendButton>
        </CardActions>
      </Card>
  );
}


interface GroupRowProps {
    group: SecurityObjectGroupedDetail;
    idsSecurityObjects: number[];
    onSelectSecurityObject: (obj: SecurityObjectDetail) => void;
    onToggleGroupAll: (objects: SecurityObjectDetail[], checked: boolean) => void;
}

const GroupRow = ({
                      group,
                      idsSecurityObjects,
                      onSelectSecurityObject,
                      onToggleGroupAll
                  }: GroupRowProps) => {
    const [open, setOpen] = useState(false);

    const objects = group[SecurityObjectGroupedDetailFields.SecurityObjects];
    const allSelected = objects.every(obj =>
        idsSecurityObjects.includes(obj[EntityWithIdFields.Id]),
    );
    const someSelected =
        !allSelected &&
        objects.some(obj => idsSecurityObjects.includes(obj[EntityWithIdFields.Id]));

    const handleToggleAll = () => {
        onToggleGroupAll(objects, !allSelected);
    };

    const columns: ITableColumn[] = [
        { label: 'Objeto de Seguridad', value: SecurityObjectFields.Observations, textAlign: "left" },
        {
            label: 'Tiene Permiso',
            value: SecurityObjectFields.HasPermissions,
            onRenderCell: (entity: SecurityObjectDetail) => (
                <Checkbox
                    checked={idsSecurityObjects.includes(entity[EntityWithIdFields.Id])}
                    onClick={() => onSelectSecurityObject(entity)}
                />
            ),
        },
    ];

    return (
        <Fragment>
            <TableRow>
                <TableCell align="left" style={{ borderBottom: 'none' }} onClick={() => setOpen(!open)}>
                    <Stack>
                        <Typography variant="h6" fontWeight={500}>
                            {group[EntityWithIdAndDescriptionFields.Description]}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={300} color="text.lighter">
                            {group[SecurityObjectGroupedDetailFields.Observations]}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell align="right" style={{ borderBottom: 'none' }}>
                    <Checkbox
                        indeterminate={someSelected}
                        checked={allSelected}
                        onChange={handleToggleAll}
                    />
                </TableCell>

                <TableCell align="right" style={{ borderBottom: 'none' }}>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
            </TableRow>

            <TableRow sx={{ "& > td": { pb: '1.1rem !important' } }}>
                <TableCell style={{ paddingTop: 0, borderBottom: 'none' }}
                           colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <TableList<SecurityObjectDetail>
                            entityList={objects}
                            columns={columns}
                            isLoading={false}
                            error={false}
                        />
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
};

export default ProfileAdminPermissions;
