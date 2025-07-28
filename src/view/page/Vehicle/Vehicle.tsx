import {type ChangeEvent, useEffect, useState} from "react";
import type {VehicleData} from "../../../Model/vehicleData.ts";
import {backendApi} from "../../../api.ts";
import {VehicleCard} from "../../common/VehicleCard/VehicleCard.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {getAllVehicles} from "../../../slices/vehicleSlices.ts";
import {VehicleModal} from "../../common/VehicleModel/VehicleModel.tsx";

export function Vehicle() {
    const [formData, setFormData] = useState<VehicleData>({
        brand: "",
        name: "",
        model: "",
        year: "",
        color: "",
        seats: 0,
        description: "",
        image: "",
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const role = localStorage.getItem('role');

    const dispatch = useDispatch<AppDispatch>();
    const vehicleState = useSelector((state: RootState) => state.vehicle);

    useEffect(() => {
        dispatch(getAllVehicles());
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "seats" ? Number(value) : value,
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file); // Store for upload
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setFormData((prev) => ({...prev, image: file.name}));
            };
            reader.readAsDataURL(file);
        }
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

                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);

                const uploadRes = await backendApi.post("/api/v1/files/vehicle", imageFormData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                formData.image = uploadRes.data.filename;
            }

            let response;

            if (isUpdateMode) {
                response = await backendApi.put(`/api/v1/vehicles/update/${formData._id}`, formData);
            } else {
                response = await backendApi.post("/api/v1/vehicles/add", formData);
            }

            if (response.status === 200 || response.status === 201) {
                alert(isUpdateMode ? "Vehicle updated successfully." : "Vehicle added successfully.");
                dispatch(getAllVehicles());
                // Reset form
                setFormData({
                    brand: "",
                    name: "",
                    model: "",
                    year: "",
                    color: "",
                    seats: 0,
                    description: "",
                    image: "",
                });
                setPreviewImage(null);
                setImageFile(null);
                setIsUpdateMode(false);
                setIsEditing(false);
            } else {
                alert("Operation failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    }

    const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);

    const handleDeleteVehicle = async (id: string) => {
        try {
            await backendApi.delete(`/api/v1/vehicles/delete/${id}`);
            dispatch(getAllVehicles());
            setSelectedVehicle(null);
            alert("Vehicle deleted.");
        } catch (err) {
            alert("Failed to delete.");
        }
    };

    const handleUpdateVehicle = (vehicle: VehicleData) => {
        setFormData(vehicle);
        setPreviewImage(`http://localhost:3000/uploads/vehicle/${vehicle.image}`); // Show existing image
        setIsUpdateMode(true);
        setIsEditing(true);
        setSelectedVehicle(null);
        setImageFile(null);
    };


    return (
        <>
            {role === "admin" && (
                <>
                    {isUpdateMode ? (
                            <h1 className="text-3xl text-center font-bold mb-8 text-blue-700">Update Vehicle</h1>
                        ) :
                        <h1 className="text-3xl text-center font-bold mb-8 text-blue-700">Add Vehicle</h1>

                    }
                    <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl shadow-lg p-6 md:p-10">
                        <div className="w-full lg:w-1/2 flex justify-center items-center">
                            <div
                                className="w-full h-full max-h-80 flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Vehicle Preview"
                                        className="object-contain w-full h-full max-h-64 rounded-lg"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <p className="text-lg">Image Preview</p>
                                        <p className="text-sm">Upload a vehicle image</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="w-full lg:w-1/2 grid grid-cols-1 gap-4"
                        >
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.color}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Seats</label>
                                <input
                                    type="number"
                                    name="seats"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.seats}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer p-2"
                                    required={!isUpdateMode}
                                />
                            </div>

                            <div className="text-right mt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md transition"
                                >
                                    {isUpdateMode ? "Update Vehicle" : "Add Vehicle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {!isEditing && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Vehicle List</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4   gap-4">
                        {vehicleState.list.map((vehicle) => (
                            <VehicleCard key={vehicle._id}
                                         data={vehicle}
                                         onViewDetails={(v) => setSelectedVehicle(v)}/>
                        ))}
                    </div>
                </div>
            )}

            {selectedVehicle && (
                <VehicleModal
                    vehicle={selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                    onUpdate={handleUpdateVehicle}
                    onDelete={handleDeleteVehicle}
                />
            )}

        </>
    );
}
