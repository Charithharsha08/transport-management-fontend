import {Route, Routes, useNavigate} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import {Login} from "./view/page/Login/Login.tsx";
import {Register} from "./view/page/Register/Register.tsx";
import {isTokenExpired} from "./auth/auth.ts";
import {useEffect} from "react";

function App() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token || isTokenExpired(token)) {
            alert('You are not logged in. Please log in to continue.');
            navigate('/login');
        }
    }, []);
    return (
        <>
            <Routes>
                <Route path="/*" element={<DefaultLayout/>}></Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}></Route>
            </Routes>


        </>

    )
}

export default App
