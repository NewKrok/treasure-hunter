import React from "react";
import { Route, Switch } from "react-router";

import Panel from "../../ui/panel/panel";
import SinglePlayer from "./type/single-player/single-player";

import styles from "./content.module.scss";

const Content = () => (
  <Panel className={styles.Wrapper}>
    <Switch>
      <Route exact path="/home/single-player" component={SinglePlayer} />
      <Route path="/home/" render={() => "under development..."} />
    </Switch>
  </Panel>
);

export default Content;
