import { useParams } from 'react-router-dom';

import SolicitationBaseList from './SolicitationBaseList';

import { HttpSolicitation } from 'http/index';

function SolicitationByCompanyList() {
  let params = useParams();
  const companyId: number = parseInt(params.idCompany ?? '');

  return (
    <SolicitationBaseList
      funcSearch={() => HttpSolicitation.getSolicitationsByCompany(companyId)}
    />
  );
}

export default SolicitationByCompanyList;
