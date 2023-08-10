import React from "react";
import {Amplify} from "aws-amplify";
import {Auth} from "aws-amplify";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import './AuthView.css';

import awsconfig from "../auth/awsconfig";
Amplify.configure(awsconfig);

export default class AuthView extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      new_password: "",
      code: "",
      stage: "SIGNIN",
      cognito_username: "",
    };
  }

  
  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        this.setState({ stage: "SIGNEDIN", cognito_username: user.username });
        // console.log(user.signInUserSession.accessToken.jwtToken);
      })
      .catch(() => {
        console.log("Not signed in");
      });
  }





  signUp = async () => {
    let self = this;
    try {
      const user = await Auth.signUp({
        username: self.state.email,
        password: self.state.password,
        attributes: {
          email: self.state.email, // optional
          name: self.state.username,
        },
      });
      self.setState({ stage: "VERIFYING" });
    } catch (error) {
      console.log("error signing up:", error);
    }
  };
  signOut = async () => {
    try {
      await Auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };









  signIn = async () => {
    let self = this;
    try {
      const user = await Auth.signIn({
        username: self.state.email,
        password: self.state.password,
      });
      this.setState({ stage: "SIGNEDIN", cognito_username: user.username });
    } catch (error) {
      console.log("error signing in", error);
      if (error.code === "UserNotConfirmedException") {
        await Auth.resendSignUp(self.state.email);
        this.setState({ stage: "VERIFYING" });
      }
    }
  };









  

  confirm = async () => {
    let self = this;
    console.log(self.state.code);
    let username = self.state.email;
    let code = self.state.code;
    try {
      await Auth.confirmSignUp(username, code);
      //바로로그인?
      this.signIn();
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  };
  changePassword = async () => {
    let self = this;
    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(
          user,
          self.state.password,
          self.state.new_password
        );
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };
  changePasswordForgot = async () => {
    let self = this;
    Auth.forgotPasswordSubmit(
      self.state.email,
      self.state.code,
      self.state.new_password
    )
      .then((data) => {
        console.log("SUCCESS");
      })
      .catch((error) => {
        console.log("err", error);
      });
  };
  resendCode = async () => {
    let self = this;
    try {
      await Auth.resendSignUp(self.state.email);
      console.log("code resent succesfully");
    } catch (error) {
      console.log("error resending code: ", error);
    }
  };
  sendCode = async () => {
    let self = this;
    Auth.forgotPassword(self.state.email)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };




  render() {
    return (
      <Authenticator
        loginMechanisms={["email"]}
        variation="modal"
      >
        {({ signOut, user }) => {
          if (user) {
            // 사용자가 로그인한 경우, 바로 index.html로 이동
            window.location.href = "index.html";
            return null;  // 리디렉션 후에는 렌더링할 컴포넌트가 없으므로 null을 반환합니다.
          }
  
          return (
            <main className="auth-view-container">
              <h1 className="auth-view-header">Hello</h1>
              <div className="auth-buttons">
                <Button onClick={() => window.location.href = "index.html"} className="auth-button">서비스 이용</Button>
                <Button onClick={signOut} className="auth-button">Sign out</Button>
              </div>
            </main>
          );
        }}
      </Authenticator>
    );
  }
}





