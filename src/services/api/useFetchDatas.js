import * as axios from "axios";
import mockDatas from "../mockApi/datas.json";
import { useEffect, useState } from "react";
import "./axios-conf";

// Object for correspondence between api endpoints and mock datas
const MOCK_KEYS = {
  USER_MAIN_DATA: "",
  USER_ACTIVITY: "activity",
  USER_PERFORMANCE: "performance",
  USER_AVERAGE_SESSIONS: "average-sessions",
};

/**
 * This is a personal hook for fetch data from api or mock.
 * If REACT_APP_ENV = prod , It fetches data from an API and returns the data and the error.
 * If REACT_APP_ENV = test , It fetches data from mock and returns the data and the error.
 * @param [userId] - the user id to fetch
 * @param [expectedData] - The endpoint of the api.
 * @returns An object with two properties: datas and error.
 */
const useFetchDatas = (userId = "", expectedData = "") => {
  // Retrieve the environment (prod or test)
  const { REACT_APP_ENV } = process.env;

  // State for keep datas or errors
  const [datas, setDatas] = useState({});
  const [error, setError] = useState({});

  /**
   * Calls api or mock are launch here when the hook is used
   */
  useEffect((e) => {
    // If the application is in prod environment, we use axios for api calls
    if (REACT_APP_ENV === "prod") {
      if (!userId) return;

      axios
        .get(`${userId}/${expectedData}`)
        .then((response) => response.data)
        .then((value) => {
          setDatas(value.data);
        })
        .catch((err) => setError(err));

      // If the application is in test environment, we use mock calls
    } else if (REACT_APP_ENV === "test") {
      const key = Object.keys(MOCK_KEYS).find(
        (e) => MOCK_KEYS[e] === expectedData
      );
      const results = mockDatas[key].find((e) => e.userId === parseInt(userId));
      results !== undefined
        ? setDatas(results)
        : setError(new Error("Cette ressource n'existe pas"));
    }
  }, []);

  return { datas, error };
};

export default useFetchDatas;
