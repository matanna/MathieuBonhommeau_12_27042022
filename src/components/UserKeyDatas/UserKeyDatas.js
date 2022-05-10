import PropTypes from "prop-types";
import Style from "./UserKeyDatas.module.scss";
import { useFetchDatas } from "../../services";
import { useContext, useEffect, useState } from "react";
import { UserIdContext } from "../../context/UserIdContext";

const UserKeyDatas = ({ dataName, icon }) => {
  const DATAKEYS_FR = {
    calorie: "Calories",
    protein: "Protéines",
    carbohydrate: "Glucides",
    lipid: "Lipides",
  };

  const userId = useContext(UserIdContext);

  /**
   * Get datas from api
   */
  const { datas, error } = useFetchDatas(userId, "");

  const [keyDatas, setKeyDatas] = useState({});

  useEffect(() => {
    if (Object.keys(datas).length !== 0) {
      setKeyDatas(datas.keyData);
    }
  }, [datas]);

  return (
    <div className={Style.dataKeys}>
      <img src={icon} alt={DATAKEYS_FR[dataName]} />
      <div className={Style.dataKeys__details}>
        <div className={Style.dataKeys__qty}>
          {dataName === "calorie"
            ? new Intl.NumberFormat("en-IN").format(
                keyDatas && keyDatas[dataName + "Count"]
              ) + "kCal"
            : new Intl.NumberFormat("en-IN").format(
                keyDatas && keyDatas[dataName + "Count"]
              ) + "g"}
        </div>
        <div className={Style.dataKeys__name}>{DATAKEYS_FR[dataName]}</div>
      </div>
    </div>
  );
};

UserKeyDatas.propTypes = {};

export default UserKeyDatas;
