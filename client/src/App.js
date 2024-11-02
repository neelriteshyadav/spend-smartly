import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import { useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { setUser } from "./store/auth.js";

function App() {
  const token = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {   
    setIsLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const user = await res.json();
      dispatch(setUser(user));
    }
    setIsLoading(false);
  }, [token, dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <NavBar />
        <Outlet />
      </>
    </LocalizationProvider>
  );
}

export default App;
