import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/Adminsidebar';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';
import { useParams } from 'react-router-dom';

const Editextended = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
    
    const [Extended, setExtended] = useState([]);
   

    useEffect(() => {
        const token = localStorage.getItem("token");
        // let intervalId;

        const fetchExtended = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/staff/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Fetched Data:", response.data);
                setExtended(response.data[0]);
            } catch (error) {
                console.error("Error fetching staff details:", error);
            }
        };

        fetchExtended();
        // intervalId = setInterval(fetchExtended, 5000);

        // return () => clearInterval(intervalId);
    }, [id, BASE_URL]);
    // Handle input change
    const handleInputChanges = (event) => {
        const { name, value } = event.target;
        setExtended((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmitUpdateExtended = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/staff/${id}`,
                Extended,
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
                   
                    <h3 className="text-2xl font-bold mb-4 text-center">Update Staff Data {Extended.first_name} {Extended.last_name}</h3>
                    {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                     <form className="" onSubmit={handleSubmitUpdateExtended}>
                        <hr className='mt-10 mx-8 mb-4'/>
                            <h2 className="font-bold sm:text-lg mb-4">Extended Family Menbers Informations</h2>
                            <hr className='mt-4 mx-8 mb-4'/>
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        name="extended_name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={Extended.extended_name}
                                        onChange={handleInputChanges}
                                        
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        name="extended_address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={Extended.extended_address}
                                        onChange={handleInputChanges}
                                       
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        name="extended_number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={Extended.extended_number}
                                        onChange={handleInputChanges}
                                        
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold"> Email</label>

                                    <input
                                        type="text"
                                        placeholder=" Email"
                                        name="extended_email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={Extended.extended_email}
                                        onChange={handleInputChanges}
                                       
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

export default Editextended;
