import { Tag } from "react-bulma-components";
import { UserRoleType } from "@types-generated";

const getLabelMeta = (userRoleType: UserRoleType) => {
  switch (userRoleType) {
    case UserRoleType.Admin:
      return {
        label: "Administrator",
        className: "admin",
      };
    case UserRoleType.Customer:
      return {
        label: "Customer",
        className: "customer",
      };
    case UserRoleType.Dealer:
      return {
        label: "Dealer",
        className: "dealer",
      };
    default:
      return {};
  }
};

export interface UserRoleTypeTagProps {
  children: UserRoleType;
}

const UserRoleTypeTag: React.FunctionComponent<UserRoleTypeTagProps> = ({ children }) => {
  const { label, className } = getLabelMeta(children);
  return <Tag className={`is-user-role-${className}`}>{label}</Tag>;
};

export default UserRoleTypeTag;
