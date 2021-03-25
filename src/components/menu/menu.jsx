import React from "react";
import Button from "../form/button/button";

import StartButtonNormal from "../../asset/img/btn-start-n.png";
import StartButtonFocus from "../../asset/img/btn-start-f.png";
import MenuHeader from "./menu-header/menu-header";

import styles from "./menu.module.scss";
import Panel from "../panel/panel";

const Menu = () => (
  <div className={styles.Wrapper}>
    <MenuHeader />
    <div className={styles.Content}>
      <Panel className={styles.News} label="News">
        Add here some news...
      </Panel>
      <Button
        className={styles.StartButton}
        navigationTarget="play"
        normalImg={StartButtonNormal}
        focusImg={StartButtonFocus}
      />
    </div>
  </div>
);

export default Menu;
