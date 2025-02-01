import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, } from '@fortawesome/free-solid-svg-icons';


const LeaveForm = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const {staffId}=useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [staff, setStaff] = useState([]);
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("leave-form");
        const parsedData = savedData ? JSON.parse(savedData) : null;

        return parsedData || {
           leave_reason: "", leave_duration: "",
            on_leave: "", staff_name: "", 
            
        };
    });

    useEffect(() => {
        localStorage.setItem("leave-form", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        axios
            .get(`${BASE_URL}api/v1/staff`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setStaff(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, [token]);

     // submmit leave form 
    const handleSubmitLeave = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${BASE_URL}api/v1/Leave`,
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
                
                            <h3 className="text-2xl font-bold mb-4 text-center">Staff Leave Form</h3>
                            <hr className="mb-4 "/>
                          
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmitLeave}>
                            <div
                                className="grid lg:grid-cols-2 gap-4 mb-4 items-center"
                            >
                                <div>
                                    <label className="block mb-2 font-semibold">Staff Name </label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.staff_name}
                                        onChange={(e) => handleInputChange("staff_name", e.target.value)}
                                        required>

                                        <option value="" key="">Select Staff name</option>
                                        {staff.map((staf) => (
                                            <option value={`${staf.first_name} ${staf.last_name}`} key={staf.id}>{`${staf.first_name} ${staf.last_name}`}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Leave Status </label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.on_leave}
                                        onChange={(e) => handleInputChange("on_leave", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="1" key="">On-Leave</option>
                                        <option value="0" key="">Not On-Leave</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Leave Duration</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.leave_duration}
                                        onChange={(e) => handleInputChange("leave_duration", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="One Week" key="">One Week</option>
                                        <option value="Two Weeks" key="">Two Weeks</option>
                                        <option value="Three Weeks" key="">Three Weeks</option>
                                        <option value="One Month" key="">One Month</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Leave Resoan </label>
                                    <textarea
                                        cols="30"
                                        rows="10"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.leave_reason}
                                        onChange={(e) => handleInputChange("leave_reason", e.target.value)}
                                    ></textarea>

                                       
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


export default LeaveForm;