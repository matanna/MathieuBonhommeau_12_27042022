import PropTypes from "prop-types";
import Style from "./UserKeyDatas.module.scss";
import { useFetchDatas } from "../../services";
import { useContext, useEffect, useState } from "react";
import { UserIdContext } from "../../context/UserIdContext";

/**
 * It displays the user's key data (calories, proteins, carbohydrates, lipids) in a card
 * @param dataName The name of the data needed to display
 * @param icon The path of the icon / image corresponding to dataName
 * @returns {JSX.Element} A component that displays the user's key data in terms of props received
 */
const UserKeyDatas = ({ dataName, icon }) => {
  // Create a correspondence object with english and french names of keys
  const DATAKEYS_FR = {
    calorie: "Calories",
    protein: "Protéines",
    carbohydrate: "Glucides",
    lipid: "Lipides",
  };

  /**
   * UserId which is retrieved by the context
   * @type {string}
   */
  const userId = useContext(UserIdContext);

  // Get datas from api
  const { datas, error } = useFetchDatas(userId, "");

  // State for keep datas keys for a user
  const [keyDatas, setKeyDatas] = useState({});

  // Save in state data keys when the component is render and when datas change
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

UserKeyDatas.propTypes = {
  dataName: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default UserKeyDatas;
