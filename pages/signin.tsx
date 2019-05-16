import React from "react";

import PageHead from "@components/meta/PageHead";
import { Section, Hero, Container, Columns } from "react-bulma-components";
import SignInBox from "@components/boxes/SignInBox";

export default class SignIn extends React.Component {
  render() {
    return (
      <Section className="is-paddingless">
        <PageHead>
          <title>Sign In</title>
        </PageHead>
        <Hero color="primary" size="fullheight" gradient>
          <Hero.Body>
            <Container>
              <Columns centered>
                <SignInBox />
              </Columns>
            </Container>
          </Hero.Body>
        </Hero>
      </Section>
    );
  }
}
