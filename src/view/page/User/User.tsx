import {useEffect, useState, type ChangeEvent} from "react";
import {backendApi} from "../../../api.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import type {UserData} from "../../../Model/userData.ts";

export function User() {
    const [userData, setUserData] = useState<UserData>({
        name: "",
        email: "",
        password: "",
        role: "",
        profileImage: null,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const user = getUserFromToken(token);
            backendApi.get(`/api/v1/users/find-by-email/${user.email}`).then(res => {
                setUserData(res.data);
                if (res.data.profileImage) {
                    setPreviewImage(`http://localhost:3000/uploads/profile/${res.data.profileImage}`);
                }
            });
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadRes = await backendApi.post("/api/v1/files/user", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                userData.profileImage = uploadRes.data.filename;
            }

            const res = await backendApi.put(`/api/v1/users/update/${userData._id}`, userData);
            if (res.status === 200) {
                alert("User updated successfully!");
            }
        } catch (err) {
            console.error(err);
            alert("Update failed.");
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete your account?")) {
            try {
                await backendApi.delete(`/api/v1/users/delete/${userData._id}`);
                alert("Account deleted.");
                localStorage.clear();
                window.location.href = "/login";
            } catch (err) {
                console.error(err);
                alert("Account deletion failed.");
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">User Profile</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div className="flex justify-center">
                    <div className="w-40 h-40 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile Preview" className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>
                </div>

                <input type="file" accept="image/*" onChange={handleImageChange}
                       className="block w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-300 p-2" />

                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input type="text" name="name" value={userData.name}
                           onChange={handleChange}
                           className="w-full px-4 py-2 border rounded-md" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input type="email" name="email" value={userData.email}
                           onChange={handleChange}
                           className="w-full px-4 py-2 border rounded-md" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input type="password" name="password" value={userData.password}
                           onChange={handleChange}
                           className="w-full px-4 py-2 border rounded-md" required />
                </div>

                <div className="flex justify-between mt-4">
                    <button type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md">
                        Update Profile
                    </button>

                    <button type="button" onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow-md">
                        Delete Account
                    </button>
                </div>
            </form>
        </div>
    );
}
