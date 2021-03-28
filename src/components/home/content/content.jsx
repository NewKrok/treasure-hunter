import React from "react";
import { Route, Switch } from "react-router";
import { useSelector } from "react-redux";

import Panel from "../../ui/panel/panel";
import SinglePlayer from "./type/single-player/single-player";
import { GetUser } from "../../../store/selectors/auth-selector";
import SignIn from "../../auth/sign-in/sign-in";
import SignUp from "../../auth/sign-up/sign-up";

import styles from "./content.module.scss";

const Content = () => {
  const user = useSelector(GetUser);

  return (
    <Panel className={styles.Wrapper}>
      <Switch>
        <Route path="/home/single-player" component={SinglePlayer} />
        <Route path="/home/" render={() => "under development..."} />
      </Switch>
      {!user && (
        <div className={styles.Auth}>
          <Switch>
            <Route path="/home/:menu/sign-in/" component={SignIn} />
            <Route path="/home/:menu/sign-up/" component={SignUp} />
            <Route path="/home/" component={SignIn} />
          </Switch>
        </div>
      )}
    </Panel>
  );
};

export default Content;
