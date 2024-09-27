import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeUserActions,
  selectActiveUser,
} from "../../store/activeUser.slice";
import Navbar from "../Navbar";
import ProfileDetails from "./ProfileDetails";
import { PageModes } from "../../store/types";
import { AppDispatch } from "../../store/store";

const Profile = (): ReactElement => {
  const activeUser = useSelector(selectActiveUser);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(activeUserActions.setPageMode(PageModes.VIEW));
  }, []);
  {
    return (
      <>
        {activeUser && <Navbar />}
        {activeUser && <ProfileDetails />}
      </>
    );
  }
};

export default Profile;
