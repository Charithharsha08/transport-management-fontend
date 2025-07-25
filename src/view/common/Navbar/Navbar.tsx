import {Link} from "react-router-dom";
import logo from "../../../assets/logo.png";


export function Navbar() {
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    <div className="flex items-center">
                    <img src={logo} alt="logo" className="h-8 w-8 object-cover"/>
                    <span className="ml-2">  Transport Manager </span>
                    </div>
                </Link>
                <div className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/booking" className="hover:underline">Bookings</Link>
                    <Link to="/driver" className="hover:underline">Drivers</Link>
                    <Link to="/trips" className="hover:underline">Trips</Link>
                    <Link to="/vehicles" className="hover:underline">Vehicles</Link>
                    <Link to="/login" className="hover:underline">Login</Link>
                </div>
            </div>
        </nav>
    )
}