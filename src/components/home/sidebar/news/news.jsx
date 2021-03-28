import React from "react";
import { useSelector } from "react-redux";

import { GetNews } from "../../../../store/selectors/news";
import Panel from "../../../ui/panel/panel";
import NewsEntry from "./news-entry/news-entry";

const News = () => {
  const news = useSelector(GetNews);
  return (
    <Panel label="news">
      {news.map((entry) => (
        <NewsEntry key={entry.date} {...entry} />
      ))}
    </Panel>
  );
};

export default News;
