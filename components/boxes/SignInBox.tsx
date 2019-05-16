import React, { FormEvent } from "react";
import redirect from "@lib/redirect";
import storeTokens from "@lib/storeTokens";
import { Box, Form, Button, Message } from "react-bulma-components";
import {
  LoginUserComponent,
  LoginUserMutation,
  LoginUserVariables,
} from "@types-generated";
import { ApolloError, ApolloClient } from "apollo-boost";
import { MutationFn } from "react-apollo";

class SignInBox extends React.Component {
  state = {
    email: "",
    password: "",
  };

  onEmailChange = (evt) => {
    this.setState({ email: evt.currentTarget.value });
  };

  onPasswordChange = (evt) => {
    this.setState({ password: evt.currentTarget.value });
  };

  onSubmit = async (
    evt: FormEvent,
    login: MutationFn<LoginUserMutation, LoginUserVariables>,
    client: ApolloClient<Object>,
  ) => {
    evt.preventDefault();

    const { email, password } = this.state;

    const res = await login({ variables: { email, password } });

    if (res && res.data && res.data.login) {
      storeTokens(res.data.login);

      // Force a reload of all the current queries now that the user is logged in
      client.cache.reset().then(() => {
        redirect("/");
      });
    }
  };

  renderErrorMessage = (error: ApolloError) => (
    <Message color="danger">
      <Message.Header>Could not sign in.</Message.Header>
      <Message.Body>{error.message || "Unknown error"}</Message.Body>
    </Message>
  );

  render() {
    const { email, password } = this.state;

    return (
      <Box {...this.props}>
        <LoginUserComponent>
          {(login, { error, loading, client }) => (
            <form
              onSubmit={(e) => {
                this.onSubmit(e, login, client);
              }}
            >
              {error && this.renderErrorMessage(error)}
              <Form.Field>
                <Form.Control>
                  <Form.Input
                    size="large"
                    placeholder="Email"
                    autoFocus
                    onChange={this.onEmailChange}
                    onBlur={this.onEmailChange}
                    value={email}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field>
                <Form.Control>
                  <Form.Input
                    type="password"
                    size="large"
                    placeholder="Password"
                    onChange={this.onPasswordChange}
                    onBlur={this.onPasswordChange}
                    value={password}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field>
                <Button size="large" color="info" fullwidth submit loading={loading}>
                  Login
                </Button>
              </Form.Field>
            </form>
          )}
        </LoginUserComponent>
      </Box>
    );
  }
}

export default SignInBox;
