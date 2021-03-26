import React from "react";

import Menu from "./menu/menu";
import News from "./news/news";

import styles from "./sidebar.module.scss";

const Sidebar = () => (
  <div className={styles.Wrapper}>
    <Menu />
    <News />
  </div>
);

export default Sidebar;
