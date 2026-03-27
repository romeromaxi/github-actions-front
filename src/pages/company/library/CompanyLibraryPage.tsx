
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import { PersonTypes } from '../../../types/person/personEnums';
import CompanyLibrary from './CompanyLibrary';


interface CompanyLibraryPageProps {
  company: CompanyViewDTO  
}

const CompanyLibraryPage = ({company} : CompanyLibraryPageProps) => {


  return (
        <CompanyLibrary
          company={company}
          isPhysicalPerson={
            company[CompanyViewDTOFields.PersonTypeCode] == PersonTypes.Physical
          }
        />
  )
};

export default CompanyLibraryPage;
