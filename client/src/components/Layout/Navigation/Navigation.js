import React from "react";
import { useContext } from "react";
import { UserContext } from "../../../functionality/UserContext";
import NavLink from "./NavLink";

const Navigation = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="">
        {/* * this space is for navigation element *  */}
          <NavLink to="/auth">[ auth ] </NavLink>
          <NavLink to="/">[ home ]</NavLink>
          {user && <NavLink to="/org">[ org chart V1 ]</NavLink>}
          {user && <NavLink to="/orgv2">[ org chart V2 ]</NavLink>}

    </div>
  );
};

export default Navigation;
