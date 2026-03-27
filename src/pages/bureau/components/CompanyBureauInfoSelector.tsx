import React, {useContext} from "react";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {Autocomplete, Stack, TextField} from "@mui/material";
import {EntityWithIdAndDescription, EntityWithIdAndDescriptionFields} from "types/baseEntities";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {NosisDetailQueryFields} from "types/nosis/nosisData";
import {dateFormatter} from "util/formatters/dateFormatter";
import {Skeleton} from "@mui/lab";

interface CompanyBureauInfoSelectorProps {
    hideSelection?: boolean
}
function CompanyBureauInfoSelector({hideSelection} : CompanyBureauInfoSelectorProps) {
    const { options, selectedQueryId, setSelectedQueryId, nosisQuery } = useContext(BureauInformationContext);
    
    return (
        <Stack direction={'row'} width={1} spacing={2} 
               alignItems={'center'}
               justifyContent={'space-between'}
        >
            {
                !hideSelection ?
                (options && !!options.length && !!selectedQueryId) ?
                    <Autocomplete
                        value={options.find(
                            (option) => option.id === selectedQueryId,
                        )}
                        onChange={(_: any, newValue: EntityWithIdAndDescription | null) => {
                            setSelectedQueryId(newValue?.[EntityWithIdAndDescriptionFields.Id] || selectedQueryId || 0);
                        }}
                        options={options}
                        getOptionLabel={(option) =>
                            option[EntityWithIdAndDescriptionFields.Description]
                        }
                        sx={{ width: 300, mr: 2 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Persona" />
                        )}
                    />
                    :
                    <Skeleton width={'70%'} />
                    :
                    <></>
            }
            
            <DataWithLabel
                rowDirection
                label={'Última actualización'}
                data={
                    !!nosisQuery
                        ? dateFormatter.toShortDate(nosisQuery[NosisDetailQueryFields.Date])
                        : '-'
                }
            />
        </Stack>
    )
}

export default CompanyBureauInfoSelector;