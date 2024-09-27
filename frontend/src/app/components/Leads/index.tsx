import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { selectActiveUser } from "../../store/activeUser.slice";
import { Skeleton } from "@mui/material";
import { LeadsDetails as LeadsDetailsType, PageModes } from "../../store/types";
import Navbar from "../Navbar";
import {
  selectActiveLeads,
  selectIsLoading,
  selectPageMode,
} from "../../store/activeLeads.slice";
import LeadsDetails from "./LeadsDetails";

const Leads = (): ReactElement => {
  const activeUser = useSelector(selectActiveUser);
  const activeLeads = useSelector(selectActiveLeads);
  const activeLeadsPageMode = useSelector(selectPageMode);
  const activeLeadsIsLoading = useSelector(selectIsLoading);

  {
    return (
      <>
        {activeUser && <Navbar />}
        {activeUser &&
          activeLeads &&
          activeLeadsPageMode === PageModes.VIEW && <LeadsDetails />}
        {activeUser && !activeLeads && activeLeadsIsLoading && <Skeleton />}
      </>
    );
  }
};

export default Leads;
