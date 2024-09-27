import { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectActiveUser } from "../../store/activeUser.slice";
import Navbar from "../Navbar";
import { Pages } from "../constants";
import homepage_img from "../constants/homepage_img.png";

const HomePage = (): ReactElement => {
  const activeUser = useSelector(selectActiveUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeUser) navigate(Pages.LOGIN, { replace: true });
  }, []);

  {
    return (
      <>
        {activeUser && <Navbar />}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
          }}
        >
          <img
            src={homepage_img}
            alt="My Image"
            style={{ maxWidth: "35%", maxHeight: "35%", alignSelf: "center" }}
          />
        </div>
      </>
    );
  }
};

export default HomePage;
