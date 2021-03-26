import React from "react";

import Panel from "../../../ui/panel/panel";
import Button, { ButtonStyle } from "../../../ui/button/button";

const Menu = () => (
  <Panel label="menu">
    <Button
      navigationTarget="/home/single-player"
      style={ButtonStyle.Primary}
      messageId="single-player"
    />
    <Button
      navigationTarget="/home/multiplayer"
      style={ButtonStyle.Primary}
      messageId="multiplayer"
    />
    <Button
      navigationTarget="/home/settings"
      style={ButtonStyle.Primary}
      messageId="settings"
    />
    <Button
      navigationTarget="/home/collections"
      style={ButtonStyle.Primary}
      messageId="collections"
    />
    <Button
      navigationTarget="/home/extras"
      style={ButtonStyle.Primary}
      messageId="extras"
    />
  </Panel>
);

export default Menu;
