import {Box} from "@mui/material";
import CompanyOptionBox from "./CompanyOptionBox";

interface CompanyJoinBoxProps {
  onClick: () => void;
}

function CompanyJoinBox({onClick}: CompanyJoinBoxProps) {
  return (
    <CompanyOptionBox
      icon={
        <Box
          component="img"
          src="/images/homeCompanies/existing-company.svg"
          sx={{
            width: 48,
            height: 48,
          }}
        />
      }
      title="Creá o vinculate a otra cuenta PyME ya existente en LUC"
      buttonText="Vincularme a una PyME"
      onClick={onClick}
    />
  );
}

export default CompanyJoinBox;

