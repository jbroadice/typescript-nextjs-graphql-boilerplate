import React from "react";
import { withApollo } from "react-apollo";
import { Router } from "@routes";
import { debounce } from "lodash-es";
import UserRoleTypeSelect, {
  UserRoleTypeSelectOption,
} from "@components/selects/UserRoleTypeSelect";
import ButtonClearFilters from "@components/buttons/ButtonClearFilters";
import { ApolloClient } from "apollo-boost";
import { UserRoleType } from "@types-generated";
import { Panel, Form } from "react-bulma-components";
import FontAwesomeIcon from "@components/icons/FontAwesomeIcon";

export interface UsersFilterPanelProps {
  client: ApolloClient<Object>;
  name: string;
  roleType: UserRoleType;
}

interface UsersFilterPanelState {
  name: string;
}

class UsersFilterPanel extends React.Component<
  UsersFilterPanelProps,
  UsersFilterPanelState
> {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
    };
  }

  setClientData = (data) => {
    this.props.client.writeData({
      data: {
        usersFilterPanel: {
          ...data,
          __typename: "UsersFilterPanelInputs",
        },
      },
    });

    Router.pushRoute("users", { page: 1 });
  };

  onUserNameChange = (evt) => {
    this.setState({ name: evt.target.value });
    this.onUserNameChangeDebounced();
  };

  onUserNameChangeDebounced = debounce(() => {
    this.setClientData({
      name: this.state.name,
    });
  }, 180);

  onUserRoleTypeChange = (option: UserRoleTypeSelectOption) => {
    this.setClientData({
      roleType: option ? option.value : null,
    });
  };

  render() {
    const { name } = this.state;
    const { roleType } = this.props;

    return (
      <Panel>
        <Panel.Header>Filters</Panel.Header>
        <Panel.Block>
          <Form.Control>
            <Form.Input
              type="text"
              placeholder="Name"
              onChange={this.onUserNameChange}
              value={name}
            />
          </Form.Control>
        </Panel.Block>
        <Panel.Block>
          <Form.Control>
            <UserRoleTypeSelect
              instanceId="users-filter-user-role-type"
              onChange={this.onUserRoleTypeChange}
              value={roleType && { value: roleType }}
            />
          </Form.Control>
        </Panel.Block>
        <Panel.Block renderAs="a" active>
          <Panel.Icon>
            <FontAwesomeIcon icon="faAngleDown" />
          </Panel.Icon>
          <span>More</span>
        </Panel.Block>
        <Panel.Block>
          <ButtonClearFilters fullwidth />
        </Panel.Block>
      </Panel>
    );
  }
}

export default withApollo(UsersFilterPanel);
