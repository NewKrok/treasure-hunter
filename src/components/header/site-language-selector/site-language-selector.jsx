import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { changeSiteLanguage } from "../../../store/actions/site-language";
import Button, { ButtonStyle } from "../../form/button/button";
import { GetSiteLanguageId } from "../../../store/selectors/app-selector";

import styles from "./site-language-selector.module.scss";

const LanguageData = [
  { id: "en", alt: "English Flag", src: "", label: "English" },
  { id: "de", alt: "Deutch Flag", src: "", label: "Deutsch" },
  { id: "hu", alt: "Magyar Flag", src: "", label: "Magyar" },
];

const SiteLanguageSelector = () => {
  const timer = useRef(null);
  const [isDropDownActive, setIsDropDownActive] = useState(false);
  const dispatch = useDispatch();
  const changeLanguage = (id) => dispatch(changeSiteLanguage(id));
  const selectedLanguage = useSelector(GetSiteLanguageId);
  const selectedLanguageData = LanguageData.find(
    (entry) => entry.id === selectedLanguage
  );
  const languageList = LanguageData.filter(
    (entry) => entry.id !== selectedLanguage
  );

  const mouseOver = (e) => {
    if (timer.current) clearTimeout(timer.current);
    setIsDropDownActive(true);
  };

  const mouseOut = (e) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsDropDownActive(false), 500);
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      className={styles.Wrapper}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
    >
      <Button
        label={
          <div className={styles.Language}>
            <img
              src={selectedLanguageData.src}
              className={styles.Flag}
              alt={selectedLanguageData.alt}
            />
            {selectedLanguageData.label}
          </div>
        }
        icon=""
        type="submit"
        style={ButtonStyle.Tertiary}
        autoWidth={false}
        className={styles.Button}
      />
      <div
        className={`${styles.DropDown} ${
          !isDropDownActive && styles.DisabledDropDown
        }`}
      >
        {languageList.map((data) => (
          <div
            key={data.id}
            className={styles.Language}
            onClick={() => changeLanguage(data.id)}
          >
            <img src={data.src} className={styles.Flag} alt={data.alt} />
            {data.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteLanguageSelector;
