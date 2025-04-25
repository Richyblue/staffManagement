import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const Nextstaff = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const {staffId}=useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
   const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("staffForm");
        const parsedData = savedData ? JSON.parse(savedData) : null;

        return parsedData || {
            first_name: "", last_name: "", email: "",
            phone: "", country: "", state: "", city: "",
            address: "", gender: "", marital_status: "",
            bvn: "", language: "", role: "", is_terminated: "",
            is_suspended: "", leave_reason: "", leave_duration: "",
            on_leave: "", bank_name: "", beneficiary: "",
            acc_number: "", nin_number: "", dob: "", parent_email: "",
            parent_address: "", parent_name: "", parent_number: "",
            extended_address: "", extended_email: "", extended_name: "",
            extended_number: "", friend_address: "", friend_email: "",
            friend_number: "", friend_name: "",
            medical_address: "", medical_email: "",
            medical_number: "", parent_name: "", status: "",

        };
    });

    useEffect(() => {
        localStorage.setItem("staffForm", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };



    // Submit "others" form without token
const handleSubmitUpdateOther = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.put(
            `${BASE_URL}api/v1/staff/others/${staffId}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Handle successful update
        setSubmissionStatus({
            success: true,
            message: response.data.message,
        });

        // Clear stored form data and navigate to next step
        localStorage.removeItem("formData");
        navigate(`/gurantors/${staffId}`);
    } catch (error) {
        // Handle errors gracefully
        console.error("Failed to submit 'others' form:", error);
        setSubmissionStatus({
            success: false,
            message: error.response?.data?.message || "Failed to submit the form.",
        });
    }
};

        return (
            <div>
                <div className="max-w-4xl mx-auto items-center mt-6 mb-6 shadow-lg p-7">
                <button
                                className="bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold p-1 mb-7 w-40"
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
                            </button>
                <h3 className="text-2xl font-bold mb-4 text-center">Add Staff Family Menbers</h3>
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmitUpdateOther}>
                            <div
                                className="grid lg:grid-cols-2 gap-4 mb-4 items-center"
                            >

                                <div>
                                    <label className="block mb-2 font-semibold">Parent/Guadian Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Parent full name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_name}
                                        onChange={(e) => handleInputChange("parent_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_address}
                                        onChange={(e) => handleInputChange("parent_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_number}
                                        onChange={(e) => handleInputChange("parent_number", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Parent Email</label>

                                    <input
                                        type="text"
                                        placeholder="Parent Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_email}
                                        onChange={(e) => handleInputChange("parent_email", e.target.value)}
                                        required
                                    />
                                </div>

                            </div>

                            <hr className='mt-10 mx-8 mb-4' />
                            <h2 className="font-bold sm:text-lg mb-4">Extended Family Informations</h2>
                            <hr className='mt-4 mx-8 mb-4' />
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_name}
                                        onChange={(e) => handleInputChange("extended_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_address}
                                        onChange={(e) => handleInputChange("extended_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_number}
                                        onChange={(e) => handleInputChange("extended_number", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold"> Email</label>

                                    <input
                                        type="text"
                                        placeholder=" Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_email}
                                        onChange={(e) => handleInputChange("extended_email", e.target.value)}
                                        required
                                    />
                                </div>

                            </div>
                            <hr className='mt-10 mx-8 mb-4' />
                            <h2 className="font-bold sm:text-lg mb-4">Frends and Neighbours Informations</h2>
                            <hr className='mt-4 mx-8 mb-4' />
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_name}
                                        onChange={(e) => handleInputChange("friend_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_address}
                                        onChange={(e) => handleInputChange("friend_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_number}
                                        onChange={(e) => handleInputChange("friend_number", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold"> Email</label>

                                    <input
                                        type="text"
                                        placeholder=" Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_email}
                                        onChange={(e) => handleInputChange("friend_email", e.target.value)}
                                        required
                                    />
                                </div>

                            </div>
                           
                            <button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold p-3 w-40"
                            >
                                <FontAwesomeIcon icon={faPlusCircle} /> Add
                            </button>
                        </form>
                       

                </div>
            </div>
        );
    }


export default Nextstaff;
