import React from "react";
import withUser from "@hocs/withUser";
import { Container, Section, Columns, Heading, Box, Hero } from "react-bulma-components";
import PageHead from "@components/meta/PageHead";
import DashboardTilesLayout from "@components/layouts/DashboardTilesLayout";

const Index = ({ user }) => (
  <React.Fragment>
    <PageHead>
      <title>Dashboard</title>
    </PageHead>

    <Hero color="info" gradient size="small">
      <Hero.Body>
        <Container>
          <Heading>Hello, {user.firstName}!</Heading>
          <Heading subtitle size={4}>
            Have a lovely day! 🌞
          </Heading>
        </Container>
      </Hero.Body>
    </Hero>

    <Section>
      <Columns>
        <Columns.Column>
          <Box className="has-text-centered">
            <Heading size={4}>10</Heading>
            <Heading subtitle size={6}>
              Active calls
            </Heading>
          </Box>
        </Columns.Column>
        <Columns.Column>
          <Box className="has-text-centered">
            <Heading size={4}>--</Heading>
            <Heading subtitle size={6}>
              Lorem ipsum
            </Heading>
          </Box>
        </Columns.Column>
        <Columns.Column>
          <Box className="has-text-centered">
            <Heading size={4}>--</Heading>
            <Heading subtitle size={6}>
              Lorem ipsum
            </Heading>
          </Box>
        </Columns.Column>
        <Columns.Column>
          <Box className="has-text-centered">
            <Heading size={4}>--</Heading>
            <Heading subtitle size={6}>
              Lorem ipsum
            </Heading>
          </Box>
        </Columns.Column>
      </Columns>
    </Section>

    <DashboardTilesLayout />
  </React.Fragment>
);

export default withUser(Index);
