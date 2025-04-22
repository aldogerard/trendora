import { useDispatch, useSelector } from "react-redux";
import { getMe, login, isTokenValid } from "./redux/features/authSlice";
import { useEffect } from "react";
import Routers from "./router/Routers";

const App = () => {
    return <Routers />;
};

export default App;
