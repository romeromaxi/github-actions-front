import React, {useContext, useEffect, useState} from 'react';
import { OffererContext } from '../components/OffererContextProvider';
import {EntityListWithPagination, EntityWithIdFields, EntityListWithPaginationFields, EntityPaginationFields} from 'types/baseEntities';
import {Stack} from "@mui/material";
import OffererSolicitationTable from "../solicitation/OffererSolicitationTable";
import {
  SolicitationFilter,
  SolicitationFilterFields,
  SolicitationViewDTO
} from "types/solicitations/solicitationData";
import {HttpSolicitation} from "http/index";
import OffererSolicitationHeader from "../solicitation/OffererSolicitationFilter";
import {FormProvider, useForm} from "react-hook-form";

function HomeOffererSolicitations() {
  const offerer = useContext(OffererContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [paginatedSolicitationList, setPaginatedSolicitationList] =
    useState<EntityListWithPagination<SolicitationViewDTO>>();
  const [hasActiveFilter, setHasActiveFilter] = useState<boolean>(false);

  const methods = useForm<SolicitationFilter>({
    defaultValues: {
      [SolicitationFilterFields.PageSize]: 100,
      [SolicitationFilterFields.CurrentPage]: 1,
      [SolicitationFilterFields.HasAlert]: null,
    }
  });

  const searchSolicitations = (filter: SolicitationFilter) => {
    setLoading(true);
    setPaginatedSolicitationList(undefined);
    HttpSolicitation.getByOffererId(offerer[EntityWithIdFields.Id], filter)
      .then(setPaginatedSolicitationList)
      .finally(() => setLoading(false))
  };

  const onPaging = (currentPage: number) => methods.setValue(SolicitationFilterFields.CurrentPage, currentPage);

  const handleOnSearch = (filter: SolicitationFilter) => {
    const content = filter[SolicitationFilterFields.SolicitationFilterContent];
    const hasContent = content !== undefined && content !== null &&
      (Array.isArray(content) ? content.length > 0 : String(content).trim() !== '');
    setHasActiveFilter(hasContent);
    searchSolicitations(filter);
  };

  const handleOnClear = () => {
    methods.setValue(SolicitationFilterFields.SolicitationFilterContent, '');
    setHasActiveFilter(false);
    searchSolicitations({
      [SolicitationFilterFields.PageSize]: 100,
      [SolicitationFilterFields.CurrentPage]: 1,
      [SolicitationFilterFields.HasAlert]: null,
    });
  };


  useEffect(() => {
    const watchValues = methods.watch();
    searchSolicitations(watchValues);
  }, []);
  
  return (
    <Stack spacing={3} width={"100%"}>
      {/*<OffererSolicitationCharts />*/}
      
      <FormProvider {...methods}>
        <OffererSolicitationHeader 
          onSearch={handleOnSearch}
          totalRecords={paginatedSolicitationList?.[EntityListWithPaginationFields.Pagination]?.[EntityPaginationFields.CantRecords] || 0}
          offererId={offerer[EntityWithIdFields.Id]}
        />
      </FormProvider>
      
      <OffererSolicitationTable loading={loading}
                                solicitations={paginatedSolicitationList}
                                onPaging={onPaging}
                                offererId={offerer[EntityWithIdFields.Id]}
                                hasFilter={hasActiveFilter}
                                onClearFilter={handleOnClear}
      />
    </Stack>
  );
}

export default HomeOffererSolicitations;
