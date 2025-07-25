import {Link} from "react-router-dom";
import logo from "../../../assets/logo.png";
import {useEffect, useState} from "react";
import {getUserFromToken} from "../../../auth/auth.ts";




export function Navbar() {

    const [user, setUser] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            console.log("access token found", accessToken);
            const userData = getUserFromToken(accessToken);
            console.log("Profile image Name:", userData.profileImage);
            console.log("user data", userData);
            setUser(userData);
            setImageUrl(`http://localhost:3000/uploads/profile/${userData.profileImage}`);
        }
    }, []);

    useEffect(() => {
        if (imageUrl) {
            console.log("image url", imageUrl);
        }
    }, [imageUrl]);

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left Side: Logo and App Name */}
                <Link to="/" className="flex items-center text-xl font-bold space-x-2">
                    <img src={logo} alt="logo" className="h-8 w-8 object-cover"/>
                    <span>Transport Manager</span>
                </Link>

                {/* Center: Navigation Links */}
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/booking" className="hover:underline">Bookings</Link>
                    <Link to="/driver" className="hover:underline">Drivers</Link>
                    <Link to="/trips" className="hover:underline">Trips</Link>
                    <Link to="/vehicles" className="hover:underline">Vehicles</Link>
                    <Link to="/login" className="hover:underline">Login</Link>
                </div>

                {/* Right Side: Profile Image and Name */}
                {user && (
                    <div className="flex items-center space-x-2">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border border-white object-cover"
                            />
                        )}
                        <span>{user.name}</span>
                    </div>
                )}
            </div>
        </nav>

    )
}