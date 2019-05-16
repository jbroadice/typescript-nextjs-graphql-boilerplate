import React from "react";
import { withApollo } from "react-apollo";
import withUser from "@hocs/withUser";
import signout from "@lib/signout";
import { Link } from "@routes";
import FontAwesomeIcon from "@components/icons/FontAwesomeIcon";
import { ApolloClient } from "apollo-boost";
import { GetLoggedInUserMe } from "@types-generated";
import { Navbar, Container } from "react-bulma-components";

interface NavbarMainProps {
  client: ApolloClient<{}>;
  user: GetLoggedInUserMe;
}

class NavbarMain extends React.Component<NavbarMainProps> {
  state = {
    open: false,
  };

  render() {
    const { user, client } = this.props;
    const { open } = this.state;

    return (
      <Navbar active={open}>
        <Container>
          <Navbar.Brand>
            <Link href="/">
              <Navbar.Item>Admin</Navbar.Item>
            </Link>
            <Navbar.Burger
              onClick={() => {
                this.setState({
                  open: !open,
                });
              }}
            />
          </Navbar.Brand>
          <Navbar.Menu>
            {/*<Navbar.Container>
              <Navbar.Item href='#'>Item #1</Navbar.Item>
            </Navbar.Container>*/}
            <Navbar.Container position="end">
              <Navbar.Item>
                <FontAwesomeIcon icon="faUser" />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </Navbar.Item>
              <Navbar.Item
                onClick={() => {
                  signout(client)();
                }}
              >
                Log Out
              </Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Container>
      </Navbar>
    );
  }
}

export default withApollo(withUser(NavbarMain));
