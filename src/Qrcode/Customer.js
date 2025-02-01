import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';


const CustomerForm = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const {staffId}=useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
   
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("CustomerForm");
        const parsedData = savedData ? JSON.parse(savedData) : null;

        return parsedData || {
            first_name: "", last_name: "", email: "",
            phone: "", country: "", state: "", city: "",
            address: "", gender: "", marital_status: "",
            office: "",language: "", card_number: "",
            card_type: "", card_expired: "", collected: "",
            issued_by: "",
        };
    });

    useEffect(() => {
        localStorage.setItem("CustomerForm", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };



     // submmit form 
     const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${BASE_URL}api/v1/Customer`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );



            setSubmissionStatus({ success: true, message: response.data.message });
            localStorage.removeItem("formData");

        } catch (error) {
            setSubmissionStatus({
                success: false,
                message: error.response?.data?.message || "Failed to submit the form.",
            });
        }
    };
        return (
            <div>
                <div className="max-w-4xl mx-auto items-center mt-6 mb-6 shadow-lg p-7">
                
                            <h3 className="text-2xl font-bold mb-4 text-center">Customers Loyalty Card Form</h3>
                            <hr className="mb-4 "/>
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmit}>
                            <div
                                className="grid lg:grid-cols-2 gap-4 mb-4 items-center"
                            >



                                <div>
                                    <label className="block mb-2 font-semibold">Fisrt Name</label>

                                    <input
                                        type="text"
                                        placeholder="Describe the details of your offering"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.first_name}
                                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                                        required
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 font-semibold">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.last_name}
                                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                                        required
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 font-semibold">Email Address</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Country</label>

                                    <input
                                        type="text"
                                        placeholder="Country"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange("country", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">State</label>

                                    <input
                                        type="text"
                                        placeholder="State"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.state}
                                        onChange={(e) => handleInputChange("state", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">City</label>

                                    <input
                                        type="text"
                                        placeholder="city"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange("city", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Gender</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange("gender", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="Male" key="">Male</option>
                                        <option value="Female" key="">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Marital Status</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.marital_status}
                                        onChange={(e) => handleInputChange("marital_status", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="Married" key="">Married</option>
                                        <option value="Single" key="">Single</option>
                                        <option value="Complicated" key="">Complicated</option>
                                        <option value="Divorce" key="">Divorce</option>
                                    </select>
                                </div>

                                

                                <div>
                                    <label className="block mb-2 font-semibold">Office Location</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.office}
                                        onChange={(e) => handleInputChange("office", e.target.value)}
                                        required>

                                        <option value="" key="">Select office location</option>
                                        <option value="Lekki" key="">Lekki</option>
                                        <option value="Surulere" key="">Surulere</option>
                                        <option value="VGC" key="">VGC</option>
                                       
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block mb-2 font-semibold">Language</label>

                                    <input
                                        type="text"
                                        placeholder="language"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.language}
                                        onChange={(e) => handleInputChange("language", e.target.value)}
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


export default CustomerForm;