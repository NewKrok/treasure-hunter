import React from "react";

import Content from "./content/content";
import HomeHeader from "./home-header/home-header";
import Sidebar from "./sidebar/sidebar";

import styles from "./home.module.scss";

const Home = () => (
  <div className={styles.Wrapper}>
    <HomeHeader />
    <div className={styles.Content}>
      <Sidebar />
      <Content />
    </div>
  </div>
);

export default Home;
