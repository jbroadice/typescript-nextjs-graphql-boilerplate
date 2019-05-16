import Select from "react-select";
import UserRoleTypeTag from "@components/tags/UserRoleTypeTag";
import { UserRoleType } from "@types-generated";
import { Props as SelectProps } from "react-select/lib/Select";

export interface UserRoleTypeSelectOption {
  value: UserRoleType;
}

const options: UserRoleTypeSelectOption[] = [
  {
    value: UserRoleType.Admin,
  },
  {
    value: UserRoleType.Customer,
  },
  {
    value: UserRoleType.Dealer,
  },
];

const UserRoleTypeSelect: React.FunctionComponent<
  SelectProps<UserRoleTypeSelectOption>
> = (props) => (
  <Select
    placeholder="Select a User Role..."
    isClearable
    {...props}
    options={options}
    formatOptionLabel={({ value }) => value && <UserRoleTypeTag>{value}</UserRoleTypeTag>}
  />
);

export default UserRoleTypeSelect;
