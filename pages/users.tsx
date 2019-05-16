import React from "react";
import { withRouter, RouterProps } from "next/router";
import { Router, Link } from "@routes";
import { pickBy, flowRight } from "lodash-es";
import { DataProps } from "react-apollo";

import {
  UsersPageClientDataHOC,
  GetUsersHOC,
  UsersPageClientDataUsersFilterPanel,
  GetUsersQuery,
  GetUsersVariables,
  GetUsersUsers,
  GetUsersData,
} from "@types-generated";

import {
  Loader,
  Message,
  Table,
  Columns,
  Level,
  Pagination,
  Box,
} from "react-bulma-components";

import ButtonAddUser from "@components/buttons/ButtonAddUser";
import PaginationInfoMessage from "@components/messages/PaginationInfoMessage";
import PageHead from "@components/meta/PageHead";
import UserRoleTypeTag from "@components/tags/UserRoleTypeTag";
import UsersFilterPanel from "@components/panels/UsersFilterPanel";
import { ApolloError } from "apollo-boost";
// import PaginationPageLimitSelect from "@components/selects/PaginationPageLimitSelect";

export interface UsersClientDataProps {
  usersFilterPanel: UsersPageClientDataUsersFilterPanel;
}

const withClientData = UsersPageClientDataHOC<UsersClientDataProps>({
  props: ({ data: { usersFilterPanel } }) => ({
    usersFilterPanel,
    usersQueryVariables: pickBy(
      usersFilterPanel,
      (v, k) => !!v && ["name", "roleType"].includes(k),
    ),
  }),
});

export interface UsersDataProps {
  router: RouterProps<{ page?: string }>;
  usersQueryVariables: string[];
}

const withUsersData = GetUsersHOC<UsersDataProps>({
  options: ({ usersQueryVariables, router }) => ({
    variables: {
      ...usersQueryVariables,
      page: router.query.page ? parseInt(router.query.page, 10) : 1,
    },
  }),
});

export interface UsersTableProps {
  users: GetUsersData[];
}

// TODO: You can fill tables with skeleton UI when loading, rather than janky spinner!
export const UsersTable: React.FunctionComponent<UsersTableProps> = React.memo(
  ({ users }) => (
    <Table bordered>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role Type</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map((user, i) => (
            <tr key={i}>
              <td>
                <Link route="user" params={{ userId: user.id }}>
                  <a>{`${user.firstName} ${user.lastName}`}</a>
                </Link>
              </td>
              <td>
                <UserRoleTypeTag>{user.roleType}</UserRoleTypeTag>
              </td>
              <td>{user.timestamps.createdAt}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  ),
);

export interface DataErrorMessageProps {
  error: ApolloError;
}

export const DataErrorMessage: React.FunctionComponent<DataErrorMessageProps> = ({
  error,
}) => {
  console.log("error", error);
  return (
    <Message color="danger">
      <Message.Header>There was an error loading the users.</Message.Header>
      <Message.Body>{error.message || "Unknown error"}</Message.Body>
    </Message>
  );
};

export const DataLoadingSpinner: React.FunctionComponent = () => (
  <Loader
    style={{
      width: 300,
      height: 300,
    }}
  />
);

export interface UsersPaginationMessageProps {
  users: GetUsersUsers;
}

export const UsersPaginationMessage: React.FunctionComponent<
  UsersPaginationMessageProps
> = React.memo(({ users }) =>
  users && users.pageInfo ? (
    <PaginationInfoMessage style={{ width: "100%" }} pageInfo={users.pageInfo} />
  ) : null,
);

export interface UsersProps extends DataProps<GetUsersQuery, GetUsersVariables> {
  usersFilterPanel: UsersPageClientDataUsersFilterPanel;
}

const Users: React.FunctionComponent<UsersProps> = ({
  data: { error, loading, users },
  usersFilterPanel,
}) => (
  <React.Fragment>
    <PageHead>
      <title>Users</title>
    </PageHead>

    <Box>
      <Level renderAs={Columns}>
        <Level.Item renderAs={Columns.Column}>
          <UsersPaginationMessage users={users} />
        </Level.Item>
        <Level.Item renderAs={Columns.Column} className="is-3 is-narrow">
          <ButtonAddUser fullwidth size="medium" />
        </Level.Item>
      </Level>

      <Columns>
        <Columns.Column>
          {error && <DataErrorMessage error={error} />}
          {loading && !users && <DataLoadingSpinner />}

          {!error && users && <UsersTable users={users.data} />}

          <UsersPaginationMessage users={users} />

          {/** <PaginationPageLimitSelect type="users" />
          <PaginationPageLimitSelect type="test" /> **/}

          {users && users.pageInfo && (
            <Pagination
              current={users.pageInfo.page}
              total={users.pageInfo.countPages}
              delta={3}
              onChange={(page) => {
                Router.pushRoute("users", { page });
              }}
            />
          )}
        </Columns.Column>
        <Columns.Column size={3}>
          <UsersFilterPanel {...usersFilterPanel} />
        </Columns.Column>
      </Columns>
    </Box>
  </React.Fragment>
);

export default flowRight(
  withRouter,
  withClientData,
  withUsersData,
)(Users);
