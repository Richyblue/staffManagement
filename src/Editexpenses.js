import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/Adminsidebar';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';
import { useParams } from 'react-router-dom';

const Editexpenses = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
    
    const [staffData, setStaffData] = useState([]);
    // Initialize form state
    const [formData, setFormData] = useState({
            items: "",
            e_quantity: "",
            unit_price: "",
            expensis_for: "",
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
                const response = await axios.get(`${BASE_URL}api/v1/Expensis/${id}`, {
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
                `${BASE_URL}api/v1/Expensis/${id}`,
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
                   
                <h3 className="text-2xl font-bold mb-4 text-center">Update Expenses</h3>
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmitUpdatePersonal}>
                            <div
                                className="grid lg:grid-cols-2 gap-4 mb-4 items-center"
                            >



                                <div>
                                    <label className="block mb-2 font-semibold">Items</label>

                                    <input
                                        type="text"
                                        name='items'
                                        placeholder="Describe the product name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={staffData.items}
                                        onChange={handleInputChange}
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 font-semibold">Quantity</label>
                                    <input
                                        type="text"
                                        name='e_quantity'
                                        placeholder="Last Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={staffData.e_quantity}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Unit Price</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="text"
                                        name='unit_price'
                                        placeholder="Unit price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={staffData.unit_price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Expenses for</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="text"
                                        name='expensis_for'
                                        placeholder="Purchase Price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={staffData.expensis_for}
                                        onChange={handleInputChange}
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
        </div>
    );
};

export default Editexpenses;
