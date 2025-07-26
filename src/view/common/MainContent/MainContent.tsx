import {Route, Routes} from "react-router-dom";
import {Home} from "../../page/Home/Home.tsx";
import {Trip} from "../../page/Trip/Trip.tsx";
import {Vehicle} from "../../page/Vehicle/Vehicle.tsx";
import {Driver} from "../../page/Driver/Driver.tsx";
import {Booking} from "../../page/Booking/Booking.tsx";
import {Dashboard} from "../../page/DashBoard/DashBoard.tsx";

export function MainContent() {
    return (
        <div className="MainContent flex items-center justify-center w-full h-full">
            <Routes>
                <Route path="/*" element={<Home/>}></Route>
                <Route path="/trips" element={<Trip/>}></Route>
                <Route path="/vehicles" element={<Vehicle/>}></Route>
                <Route path="/driver" element={<Driver/>}></Route>
                <Route path="/booking" element={<Booking/>}></Route>
                <Route path="/dashboard" element={<Dashboard/>}></Route>

            </Routes>
        </div>

    )
}