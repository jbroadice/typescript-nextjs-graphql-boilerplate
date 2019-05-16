import FontAwesomeIcon from "@components/icons/FontAwesomeIcon";
import { Button, ButtonProps } from "react-bulma-components";

const ButtonClearFilters: React.FunctionComponent<ButtonProps> = (props) => (
  <Button {...props}>
    <FontAwesomeIcon icon="faTimes" />
    <span>Clear Filters</span>
  </Button>
);

export default ButtonClearFilters;
