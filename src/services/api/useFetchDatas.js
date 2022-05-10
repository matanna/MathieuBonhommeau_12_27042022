import * as axios from "axios";
import mockDatas from "../mockApi/datas.json";
import { useEffect, useState } from "react";
import "./axios-conf";

const MOCK_KEYS = {
  USER_MAIN_DATA: "",
  USER_ACTIVITY: "activity",
  USER_PERFORMANCE: "performance",
  USER_AVERAGE_SESSIONS: "average-sessions",
};

const useFetchDatas = (userId = "", expectedData = "") => {
  const { REACT_APP_ENV } = process.env;

  const [url, setUrl] = useState("");
  const [datas, setDatas] = useState({});
  const [error, setError] = useState({});

  useEffect(
    (e) => {
      if (REACT_APP_ENV === "prod") {
        setUrl(`/${userId}/${expectedData}`);

        if (!userId) return;

        axios
          .get(url)
          .then((response) => response.data)
          .then((value) => {
            setDatas(value.data);
          })
          .catch((err) => setError(err));
      } else if (REACT_APP_ENV === "test") {
        const key = Object.keys(MOCK_KEYS).find(
          (e) => MOCK_KEYS[e] === expectedData
        );

        setDatas(mockDatas[key].find((e) => e.userId === userId));
      }
    },
    [url]
  );
  return { datas, error };
};

export default useFetchDatas;
