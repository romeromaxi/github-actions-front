import {Card, CardActions, Chip, Stack, Typography} from '@mui/material';
import {ITableColumn, Pagination, TableList} from '../../../components/table';
import React, {useState} from 'react';
import {CompanyQuaFilterSearch,} from '../../../types/company/companyData';
import {EntityPagination, EntityPaginationFields,} from '../../../types/baseEntities';
import {dateFormatter} from '../../../util/formatters/dateFormatter';
import {stringFormatter} from '../../../util/formatters/stringFormatter';
import {SearchButton} from '../../../components/buttons/Buttons';
import {UserCompany, UserCompanyFields} from "../../../types/user";
import {WrapperIcons} from "../../../components/icons/Icons";
import {Check, X} from "phosphor-react";
import InternalCompaniesDialog from "./InternalCompaniesDialog";
import {TypographyBase} from "../../../components/misc/TypographyBase";

interface InternalCompaniesTableListProps {
  loading: boolean;
  companies?: UserCompany[];
  pagination?: EntityPagination;
  searchCompanies: (arg: CompanyQuaFilterSearch) => void;
  prevFilter: CompanyQuaFilterSearch;
}

const InternalCompaniesTableList = ({
  loading,
  companies,
  pagination,
  searchCompanies,
  prevFilter,
}: InternalCompaniesTableListProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [viewCompanies, setViewCompanies] = useState<string[]>();
  const [businessName, setBusinessName] = useState<string>();
  const onPaging = (page: number) => {
    const filter: CompanyQuaFilterSearch = {
      ...prevFilter,
      [EntityPaginationFields.ActualPage]: page,
    };

    searchCompanies(filter);
  };

  const columns: ITableColumn[] = [
    { label: 'Razón Social', value: UserCompanyFields.BusinessName,
      onRenderCell: (company: UserCompany) => (
          <Stack>
            <Typography>{company[UserCompanyFields.BusinessName]}</Typography>
            <Typography fontSize={11} fontWeight={500} color={'#818992'}>{stringFormatter.formatCuit(company[UserCompanyFields.CUIT])}</Typography>
          </Stack>
      )
    },
    {
      label: 'Mail',
      value: UserCompanyFields.Mail
    },
    {
      label: 'Teléfono',
      value: UserCompanyFields.PhoneNumber,
      onRenderCell: (company: UserCompany) => (
          <Stack spacing={1} direction='row' alignItems='center'>
            {company[UserCompanyFields.PhoneCode]}
            {company[UserCompanyFields.AreaCode]}
            {company[UserCompanyFields.PhoneNumber]}
          </Stack>
      )
    },
    {
      label: 'Validaciones',
      value: UserCompanyFields.Active,
      onRenderCell: (company: UserCompany) => (
          <Stack spacing={1}>
            <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
              <Typography>Teléfono</Typography>
              {company[UserCompanyFields.PhoneConfirmed] ? <WrapperIcons Icon={Check} color={'success'} />
                : <WrapperIcons Icon={X} color={'error'} />
              }
            </Stack>
            <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
              <Typography>Mail</Typography>
              {company[UserCompanyFields.MailConfirmed] ? <WrapperIcons Icon={Check} color={'success'} />
                  : <WrapperIcons Icon={X} color={'error'} />
              }
            </Stack>
            <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
              <Typography>Identidad</Typography>
              {company[UserCompanyFields.IdentityValidated] ? <WrapperIcons Icon={Check} color={'success'} />
                  : <WrapperIcons Icon={X} color={'error'} />
              }
            </Stack>
          </Stack>
      )
    },
    {
      label: 'Empresas',
      value: UserCompanyFields.RelatedCompanies,
      onRenderCell: (company: UserCompany) => (
            company[UserCompanyFields.RelatedCompanies] !== null ?
              <Stack spacing={1}>
                {(company[UserCompanyFields.RelatedCompanies] !== '')  &&
            company[UserCompanyFields.RelatedCompanies].split(',').length !== 0 &&
                company[UserCompanyFields.RelatedCompanies].split(',').slice(0, 2).map((company, idx) => (
                <Chip variant={'outlined'} label={
                  <TypographyBase tooltip maxLines={1}>
                    {company}
                  </TypographyBase>
                } key={`companyRelated_${idx}_ByUser`} size={'small'} />
              ))}
            {
              company[UserCompanyFields.RelatedCompanies].split(',').length > 2 &&
                <SearchButton
                    size={'small'}
                    variant={'outlined'}
                    color={'secondary'}
                    sx={{padding: '2px 6px !important'}}
                    onClick={() => {
                      setViewCompanies(company[UserCompanyFields.RelatedCompanies].split(','));
                      setBusinessName(company[UserCompanyFields.BusinessName])
                      setOpen(true);
                    }}
                >
                  Ver todas
                </SearchButton>
            }
          </Stack>
            :
            <Typography>-</Typography>
          
      )
    },
    {
      label: 'Último acceso',
      value: UserCompanyFields.LastAccessDate,
      onRenderCell: (company: UserCompany) => (
        <Typography>
          {dateFormatter.toLongDate(
            company[UserCompanyFields.LastAccessDate],
          )}
        </Typography>
      ),
    },
    {
      label: 'Activo',
      value: UserCompanyFields.Active,
      onRenderCell: (company: UserCompany) => (
          company[UserCompanyFields.Active] ? <WrapperIcons Icon={Check} color={'success'} />
                : <WrapperIcons Icon={X} color={'error'} />
      )
    }
  ];

  const onClose = () => {
    setViewCompanies(undefined);
    setBusinessName(undefined);
    setOpen(false);
  };

  return (
    <Card>
      <TableList<UserCompany>
        entityList={companies}
        columns={columns}
        isLoading={loading}
        error={false}
      />
      <CardActions>
        <Pagination
          entityPagination={pagination}
          isLoading={loading}
          onPaging={onPaging}
        />
      </CardActions>
      {viewCompanies && businessName && (
        <InternalCompaniesDialog
          open={open}
          onClose={onClose}
          companies={viewCompanies}
          businessName={businessName}
        />
      )}
    </Card>
  );
};

export default InternalCompaniesTableList;
