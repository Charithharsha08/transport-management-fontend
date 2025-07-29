import {Route, Routes} from "react-router-dom";
import {Home} from "../../page/Home/Home.tsx";
import {Trip} from "../../page/Trip/Trip.tsx";
import {Vehicle} from "../../page/Vehicle/Vehicle.tsx";
import {Driver} from "../../page/Driver/Driver.tsx";
import {Booking} from "../../page/Booking/Booking.tsx";
import {Dashboard} from "../../page/DashBoard/DashBoard.tsx";
import {MainLayout} from "../../components/layout/MainLayout.tsx";

export function MainContent() {
    return (
        <div className="MainContent w-full">
            <Routes>
                <Route path="/*" element={<MainLayout><Home/></MainLayout>}></Route>
                <Route path="/trips" element={<MainLayout><Trip/></MainLayout>}></Route>
                <Route path="/vehicles" element={<MainLayout><Vehicle/></MainLayout>}></Route>
                <Route path="/driver" element={<MainLayout><Driver/></MainLayout>}></Route>
                <Route path="/booking" element={<MainLayout><Booking/></MainLayout>}></Route>
                <Route path="/dashboard" element={<MainLayout><Dashboard/></MainLayout>}></Route>
            </Routes>
        </div>

    )
}