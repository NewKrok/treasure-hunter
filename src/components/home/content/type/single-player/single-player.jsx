import React from "react";

import Button, { ButtonStyle } from "../../../../ui/button/button";

const SinglePlayer = () => (
  <Button
    navigationTarget="/play"
    style={ButtonStyle.Primary}
    messageId="play"
    navigationTarget="play"
  />
);

export default SinglePlayer;
