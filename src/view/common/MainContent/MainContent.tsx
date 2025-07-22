import {Route, Routes} from "react-router-dom";

export function MainContent() {
    return (
        <div className="MainContent flex items-center justify-center w-full h-full">
            <Routes>
                <Route path="/*" element={<div>Home</div>}></Route>
                <Route path="/login" element={<div>Login</div>}></Route>
                <Route path="/register" element={<div>Register</div>}></Route>
                <Route path="/profile" element={<div>Profile</div>}></Route>
                <Route path="/dashboard" element={<div>Dashboard</div>}></Route>
                <Route path="/booking" element={<div>Booking</div>}></Route>
                <Route path="/trip" element={<div>Trip</div>}></Route>
                <Route path="/driver" element={<div>Driver</div>}></Route>
                <Route path="/vehicle" element={<div>Vehicle</div>}></Route>
                <Route path="/user" element={<div>User</div>}></Route>
                <Route path="/admin" element={<div>Admin</div>}></Route>
            </Routes>
        </div>

    )
}