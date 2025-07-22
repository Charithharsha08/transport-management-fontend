import './App.css'
import {Route, Routes} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import {Login} from "./view/page/Login/Login.tsx";

function App() {


    return (
        <>
            <Routes>
                <Route path="/*" element={<DefaultLayout/>}></Route>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </>

    )
}

export default App
