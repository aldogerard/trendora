import { useDispatch, useSelector } from "react-redux";
import { getMe, login, isTokenValid } from "./redux/features/authSlice";
import { useEffect } from "react";

const App = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    const username = "emilys";
    const password = "emilyspass";

    useEffect(() => {
        console.log("is user login : ", isTokenValid(token));
    }, []);

    const handleLogin = async () => {
        try {
            await dispatch(login({ username, password })).unwrap();
            await dispatch(getMe({ token })).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const handleInfo = async () => {
        try {
            await dispatch(getMe({ token })).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section>
            <button onClick={handleLogin}>Login</button>
            <br />
            <br />
            <button onClick={handleInfo}>Info</button>
        </section>
    );
};

export default App;
