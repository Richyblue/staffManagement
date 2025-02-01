import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/Adminsidebar';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';
import { useParams } from 'react-router-dom';

const Editpersonal = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
    
    const [staffData, setStaffData] = useState([]);
    // Initialize form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        address: "",
        gender: "",
        marital_status: "",
        bvn: "",
        language: "",
        role: "",
        dob: "",
        nin_number: ""
    });

    // Fetch staff data and set formData
    // useEffect(() => {
    //     axios
    //         .get(`${BASE_URL}api/v1/staff/${id}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //         .then((response) => {
    //             setFormData(response.data || {}); // Set default to empty object
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching staff details:", error);
    //         });
    // }, [id, token]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        // let intervalId;

        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/staff/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Fetched Data:", response.data);
                setStaffData(response.data[0]);
            } catch (error) {
                console.error("Error fetching staff details:", error);
            }
        };

        fetchStaffData();
        // intervalId = setInterval(fetchStaffData, 5000);

        // return () => clearInterval(intervalId);
    }, [id, BASE_URL]);
    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setStaffData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmitUpdatePersonal = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/staff/${id}`,
                staffData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSubmissionStatus({ success: true, message: response.data.message });
        } catch (error) {
            setSubmissionStatus({
                success: false,
                message: error.response?.data?.message || "Failed to update staff data.",
            });
        }
    };


    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Navmenu />
                <div className="bg-white shadow-lg p-6 mt-6 mb-6 w-full max-w-4xl mx-auto">
                   
                    <h3 className="text-2xl font-bold mb-4 text-center">Update Staff Data {staffData.first_name}</h3>
                    {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                    <form onSubmit={handleSubmitUpdatePersonal} className="grid lg:grid-cols-2 gap-4 mb-4">
                        {/* First Name */}
                        <div>
                            <label className="block mb-2 font-semibold">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.first_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block mb-2 font-semibold">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.last_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 font-semibold">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block mb-2 font-semibold">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block mb-2 font-semibold">Country</label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.country}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="block mb-2 font-semibold">State</label>
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.state}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block mb-2 font-semibold">Gender</label>
                            <select
                                name="gender"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.gender}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        {/* Marital Status */}
                        <div>
                            <label className="block mb-2 font-semibold">Marital Status</label>
                            <select
                                name="marital_status"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.marital_status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Married">Married</option>
                                <option value="Single">Single</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block mb-2 font-semibold">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.dob}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* BVN */}
                        <div>
                            <label className="block mb-2 font-semibold">BVN</label>
                            <input
                                type="text"
                                name="bvn"
                                placeholder="BVN"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.bvn}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block mb-2 font-semibold">Role</label>
                            <select
                                name="role"
                                className="block w-full border border-gray-300 p-2"
                                value={staffData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Barber">Barber</option>
                            </select>
                        </div>
                        {/* Submit Button */}
                    <button type="submit" className="bg-blue-600 text-white p-3 w-40">
                        <FontAwesomeIcon icon={faPlusCircle} /> Update
                    </button>
                    </form>

                    
                </div>
            </div>
        </div>
    );
};

export default Editpersonal;
