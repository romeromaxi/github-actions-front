import {
    Box,
    Button,
    Checkbox,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField
} from "@mui/material";
import {useState} from "react";
import { Controller, Control } from "react-hook-form";

export interface CustomTransferListProps<T> {
    entityListLeft: T[],
    entityListRight: T[],
    idField: string,
    descriptionField: string,
    control: Control,
    name: string
}

const not = (a: any[], b: any[]) => {
    return a.filter((value: any) => b.indexOf(value) === -1);
};

const intersection = (a: any[], b: any[]) => {
    return a.filter((value: any) => b.indexOf(value) !== -1);
};

function CustomTransferList<T>({entityListLeft, entityListRight, idField, descriptionField, control, name}: CustomTransferListProps<T>) {
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(entityListLeft);
    const [right, setRight] = useState(entityListRight);
    const [leftSearch, setLeftSearch] = useState('');
    const [rightSearch, setRightSearch] = useState('');

    const leftChecked = intersection(checked, left ?? []);
    const rightChecked = intersection(checked, right ?? []);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleCheckedRight = () => {
        setRight(right?.concat(leftChecked));
        setLeft(not(left ?? [], leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left?.concat(rightChecked));
        setRight(not(right ?? [], rightChecked));
        setChecked(not(checked, rightChecked));
    };

    // @ts-ignore
    const filteredLeft = left?.filter((item) => item[descriptionField].toLowerCase().includes(leftSearch.toLowerCase()));
    // @ts-ignore
    const filteredRight = right?.filter((item) => item[descriptionField].toLowerCase().includes(rightSearch.toLowerCase()));

    const customList = (title: string, items: any[], searchValue: string, setSearchValue: (a: string) => void) => (
        <Paper style={{ width: 200, height: 230, overflow: 'auto' }}>
            <Box p={2}>
                <TextField
                    label={`Buscar`}
                    variant="outlined"
                    fullWidth
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </Box>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-${title}-list-item-${value[idField]}-label`;
                    return (
                        <ListItemButton
                            key={value[idField]}
                            role="listitem"
                            onClick={handleToggle(value[idField])}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value[idField]) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value[descriptionField]} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Box display="flex" justifyContent="center" alignItems="center">
                    {customList('left', filteredLeft ?? [], leftSearch, setLeftSearch)}
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Button variant="contained" onClick={() => { handleCheckedRight(); field.onChange(right.concat(leftChecked)) }} disabled={leftChecked.length === 0} style={{ margin: 8 }} size={'small'}>
                            &gt;
                        </Button>
                        <Button variant="contained" onClick={() => { handleCheckedLeft(); field.onChange(left.concat(rightChecked)) }} disabled={rightChecked.length === 0} style={{ margin: 8 }} size={'small'}>
                            &lt;
                        </Button>
                    </Box>
                    {customList('right', filteredRight ?? [], rightSearch, setRightSearch)}
                </Box>
            )}
        />
    );
}

export default CustomTransferList;