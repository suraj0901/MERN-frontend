import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Loader from "../../components/Loader";

const ENV = "development";
const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isError, isSuccess, isLoading, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current || process.env.NODE_ENV !== ENV) {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          // const response =
          await refresh();
          // const {accessToken} = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.log(err);
        }
      };
      if (!token && persist) verifyRefreshToken();
    }
    return () => (effectRan.current = true);
  }, []);
  let content;

  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    content = <Loader />;
  } else if (isError) {
    console.log("error");
    content = (
      <p className="errmsg">
        {error?.data?.message}
        {" - "}
        <Link to={"/login"}>Please login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
