import {type ChangeEvent, useState} from "react";
import type {VehicleData} from "../../../Model/vehicleData.ts";

export function Vehicle() {

    const [formData, setFormData] = useState<VehicleData>({
        _id: "",
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setFormData((prev) => ({...prev, image: file.name}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        // Submit logic here
    };


    return (
        <>
            <h1 className="text-3xl text-center font-bold mb-8 text-blue-700">Add Vehicle</h1>
            <div className="align-center flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-8 md:p-12 gap-10">
                {/* Left - Image Preview */}
                <div className="md:w-1/2 flex justify-center items-center">
                    <div className="w-full h-full flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Vehicle Preview"
                                className="object-contain w-full h-64 rounded-lg"
                            />
                        ) : (
                            <div className="text-center text-gray-400">
                                <p className="text-lg">Image Preview</p>
                                <p className="text-sm">Upload a vehicle image</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right - Form */}
                <form
                    onSubmit={handleSubmit}
                    className="md:w-1/2 grid grid-cols-1 gap-4"
                >
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            className="input-style"
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
                            className="input-style"
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
                            className="input-style"
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
                            className="input-style"
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
                            className="input-style"
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
                            className="input-style"
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
                            className="input-style resize-none"
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
                            required
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md transition"
                        >
                            Add Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </>
    );

}
