import React from "react";
import { Route, Switch } from "react-router";

import Button, { ButtonStyle } from "../form/button/button";
import ProfileSettings from "./pages/profile-settings/profile-settings";

import styles from "./settings.module.scss";

const Settings = () => (
  <div className={styles.Wrapper}>
    <div className={styles.Menu}>
      <Button
        icon="fa-user-cog"
        messageId="profile"
        style={ButtonStyle.OutlineInverse}
        navigationTarget="/settings/profile"
        className={styles.Button}
        autoWidth={false}
        selected={window.location.pathname.includes("/settings/profile")}
        disabled={window.location.pathname.includes("/settings/profile")}
      />
      <Button
        icon="fa-headphones"
        messageId="speech"
        style={ButtonStyle.OutlineInverse}
        navigationTarget="/settings/speech"
        className={styles.Button}
        autoWidth={false}
        selected={window.location.pathname.includes("/settings/speech")}
        disabled={window.location.pathname.includes("/settings/speech")}
      />
      <Button
        icon="fa-video"
        messageId="devices"
        style={ButtonStyle.OutlineInverse}
        navigationTarget="/settings/devices"
        className={styles.Button}
        autoWidth={false}
        selected={window.location.pathname.includes("/settings/devices")}
        disabled={window.location.pathname.includes("/settings/devices")}
      />
    </div>
    <Switch>
      <Route exact path="/settings/profile" component={ProfileSettings} />
    </Switch>
  </div>
);

export default Settings;
