import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {backendApi} from "../../../api.ts";


export function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
        profileImage: "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (imageFile) {
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (!allowedTypes.includes(imageFile.type)) {
                    alert("Invalid image format. Please upload a JPEG, PNG, or JPG file.");
                    return;
                }
                const formData = new FormData();
                formData.append("file", imageFile);

                const uploadRes = await backendApi.post("/api/v1/files/user", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                form.profileImage = uploadRes.data.filename;
            }
        } catch (err) {
            alert("Image upload failed.");
        }


        try {
            const response = await backendApi.post("/api/v1/users/register", form);
            if (response.status === 201) {
                alert("Registration successful.");
                navigate("/login");
            } else {
                alert("Registration failed.");
            }
        } catch (err) {
            alert("Registration failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex items-center gap-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium mb-1">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                        </div>

                        {imagePreview && (
                            <div className="w-1/2 flex justify-center">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-full border border-gray-300"
                                />
                            </div>
                        )}
                    </div>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        autoComplete='username'
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete={'email'}
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    >
                        <option value="customer">Customer</option>
                        <option value="driver">Driver</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-sm mt-4">
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}

