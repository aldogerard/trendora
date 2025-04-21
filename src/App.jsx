import { useDispatch } from "react-redux";
import { getMe, login, selectIsLogin } from "./redux/features/authSlice";
import { useEffect } from "react";

const App = () => {
    const dispatch = useDispatch();
    const username = "emilys";
    const password = "emilyspass";

    useEffect(() => {
        console.log(selectIsLogin());
    }, []);

    const handleLogin = async () => {
        try {
            await dispatch(login({ username, password })).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const handleInfo = async () => {
        try {
            await dispatch(getMe()).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleInfo}>Info</button>
        </section>
    );
};

export default App;
