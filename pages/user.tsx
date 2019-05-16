import React from "react";
import { withRouter, RouterProps } from "next/router";
import { pickBy, flowRight } from "lodash-es";
import { DataProps } from "react-apollo";
import { GetUserHOC, GetUserQuery, GetUserVariables } from "@types-generated";
import { Box, Panel, Columns, Button } from "react-bulma-components";
import FontAwesomeIcon from "@components/icons/FontAwesomeIcon";
import PageHead from "@components/meta/PageHead";

export interface UserPanelProps extends DataProps<GetUserQuery, GetUserVariables> {}

const UserPanel = ({ data: { user, loading, error } }: UserPanelProps) => {
  if (loading || error) return null;

  const userProps = pickBy(user, (_v, k) => ["id", "firstName", "lastName"].includes(k));

  console.log(user, userProps);

  return (
    <React.Fragment>
      <PageHead>
        <title>{`User | ${user.firstName} ${user.lastName}`}</title>
      </PageHead>

      <Box>
        <Columns>
          <Columns.Column size={8}>
            <Panel>
              <Panel.Header>
                <span>{`User: ${user.firstName} ${user.lastName}`}</span>
                <span className="is-pulled-right">
                  <Button size="small">
                    <FontAwesomeIcon icon="faPencilAlt" />
                    <span> Edit</span>
                  </Button>
                </span>
              </Panel.Header>
              <Panel.Block>
                <Columns>
                  {Object.keys(userProps).map((propKey) => (
                    <React.Fragment key={propKey}>
                      <Columns.Column size={2}>
                        <strong>{propKey}</strong>
                      </Columns.Column>
                      <Columns.Column size={10}>
                        <span>{userProps[propKey]}</span>
                      </Columns.Column>
                    </React.Fragment>
                  ))}
                </Columns>
              </Panel.Block>
            </Panel>
          </Columns.Column>
          <Columns.Column>
            <Panel>
              <Panel.Header>Panel</Panel.Header>
              <Panel.Tabs>
                <Panel.Tabs.Tab active>Tab 1</Panel.Tabs.Tab>
                <Panel.Tabs.Tab>Tab 2</Panel.Tabs.Tab>
                <Panel.Tabs.Tab>Tab 3</Panel.Tabs.Tab>
              </Panel.Tabs>
              <Panel.Block>Lorem ipsum</Panel.Block>
            </Panel>
          </Columns.Column>
        </Columns>

        <pre>{JSON.stringify(user, null, "  ")}</pre>
      </Box>
    </React.Fragment>
  );
};

interface UserProps {
  router: RouterProps<{ userId?: string }>;
}

const withUserData = GetUserHOC<UserProps>({
  options: ({
    router: {
      query: { userId },
    },
  }) => ({
    variables: {
      id: userId,
    },
  }),
});

export default flowRight(
  withRouter,
  withUserData,
)(UserPanel);
