import FontAwesomeIcon from "@components/icons/FontAwesomeIcon";
import { Button, ButtonProps } from "react-bulma-components";

const ButtonAddUser: React.FunctionComponent<ButtonProps> = (props) => (
  <Button color="primary" {...props}>
    <FontAwesomeIcon icon="faUserPlus" />
    <span>Add User</span>
  </Button>
);

export default ButtonAddUser;
