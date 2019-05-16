import React from "react";
import NavbarMain from "@components/menus/NavbarMain";
import { Section, Container, Columns } from "react-bulma-components";
import MenuPrimary from "@components/menus/MenuPrimary";
import Breadcrumbs from "@components/menus/Breadcrumbs";

const MyRootLayout: React.FunctionComponent = ({ children }) => {
  return (
    <React.Fragment>
      <NavbarMain />

      <Section>
        <Container>
          <Columns gapless>
            <Columns.Column size={2}>
              <MenuPrimary />
            </Columns.Column>
            <Columns.Column size={10}>
              <main>
                <Breadcrumbs />

                {children}
              </main>
            </Columns.Column>
          </Columns>
        </Container>
      </Section>
    </React.Fragment>
  );
};

export default MyRootLayout;
