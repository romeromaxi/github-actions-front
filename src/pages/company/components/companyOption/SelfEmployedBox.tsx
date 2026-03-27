import CompanyOptionBox from "./CompanyOptionBox";
import {stringFormatter} from "../../../../util/formatters/stringFormatter";
import {CompanyLogoById} from "../CompanyLogo";

interface SelfEmployedBoxProps {
  onClick: () => void;
  userName: string;
  userCuit: string;
}

function SelfEmployedBox({onClick, userName, userCuit}: SelfEmployedBoxProps) {
  return (
    <CompanyOptionBox
      icon={
        <CompanyLogoById isPhysicalPerson={true}
                         size={'lg'}
                         companyId={1}
        />
      }
      title={userName}
      subtitle={stringFormatter.formatCuit(userCuit)}
      buttonText="Activar mi cuenta"
      onClick={onClick}
    />
  );
}

export default SelfEmployedBox;

