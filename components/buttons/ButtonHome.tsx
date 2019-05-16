import Link from "next/link";
import { Button, Icon } from "react-bulma-components";

const ButtonHome: React.FunctionComponent = (props) => (
  <Link prefetch href="/">
    <Button color="primary" {...props}>
      <Icon icon="angle-down">&lt;</Icon>
      <span>Go Home</span>
    </Button>
  </Link>
);

export default ButtonHome;
