import React from "react";
import { useSelector } from "react-redux";

import { GetUser } from "../../../store/selectors/auth-selector";
import Avatar from "../../ui/avatar/avatar";
import ErrorMessage from "../../ui/error-message/error-message";

import styles from "./home-header.module.scss";

const HomeHeader = () => {
  const user = useSelector(GetUser);

  return (
    <div className={styles.Wrapper}>
      {user ? (
        <>
          <Avatar className={styles.Avatar} />
          <div className={styles.Name}>{user.userName}</div>
        </>
      ) : (
        <ErrorMessage messageId="not-logged-in" className={styles.Error} />
      )}
    </div>
  );
};

export default HomeHeader;
