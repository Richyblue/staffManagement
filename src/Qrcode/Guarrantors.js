import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';


const Guarrantors = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const {staffId}=useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
   
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("staffGuarrantors");
        const parsedData = savedData ? JSON.parse(savedData) : null;

        return parsedData || {
            surname: "", other_name: "", email: "",
            phone: "", country: "", state: "", city: "",
            address: "", gender: "", marital_status: "",
            language: "", dob:"", religion:"", year_of_relationship:"",
            nearest_bus_stop:"", closest_landmark:"", age:"", business_name:"",
             status: "",

        };
    });

    useEffect(() => {
        localStorage.setItem("staffGuarrantors", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

const [guarantorCount, setGuarantorCount] = useState(0);

useEffect(() => {
    const fetchGuarantors = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/v1/staff/gurantor/staff/${staffId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGuarantorCount(response.data.length); // Assuming response.data is an array of guarantors
        } catch (error) {
            console.error("Error fetching guarantors:", error);
        }
    };

    fetchGuarantors();
}, [staffId]);


    // submmit others form 
   const handleSubmitUpdateOther = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post(
            `${BASE_URL}api/v1/staff/gurantor/${staffId}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const newCount = guarantorCount + 1;
        setGuarantorCount(newCount);
        setFormData({ ...formData }); // Optional: clear fields if you want
        localStorage.removeItem("staffGuarrantors");

        if (newCount < 3) {
            setSubmissionStatus({
                success: true,
                message: `${3 - newCount} more guarantor${3 - newCount > 1 ? "s" : ""} remaining.`,
            });
        } else {
            setSubmissionStatus({
                success: true,
                message: `All 3 guarantors successfully submitted.`,
            });
        }

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
                <button
                                className="bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold p-1 mb-7 w-40"
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
                            </button>
               
                <p className="text-center bg-yellow-300 p-2">EMPLOYMENT GUARANTOR FORM PLEASE, DO NOT GUARANTEE SOMEONE NOT WELL KNOWN 
                    TO YOU FOR A MINIMUM OF 3 YEARS!
                </p>
                <h3 className="text-2xl font-bold mb-4 text-center">Add Staff Guarantor Data</h3>
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
                                    <label className="block mb-2 font-semibold">Surname</label>

                                    <input
                                        type="text"
                                        placeholder="Surname"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.surname}
                                        onChange={(e) => handleInputChange("surname", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Other name</label>

                                    <input
                                        type="text"
                                        placeholder="Other Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.other_name}
                                        onChange={(e) => handleInputChange("other_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Personal Email Address</label>

                                    <input
                                        type="text"
                                        placeholder="Personal Email"
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
                                    <label className="block mb-2 font-semibold">Religion</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.religion}
                                        onChange={(e) => handleInputChange("religion", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="Christianity" key="">Christianity</option>
                                        <option value="Muslim" key="">Muslim</option>
                                        <option value="Others" key="">Others</option>
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
                                    <label className="block mb-2 font-semibold">Years of Relationship</label>

                                    <input
                                        type="text"
                                        placeholder="Example 5 years "
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.year_of_relationship}
                                        onChange={(e) => handleInputChange("year_of_relationship", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Resindent Address</label>

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
                                    <label className="block mb-2 font-semibold">Nearest Bus Stop</label>

                                    <input
                                        type="text"
                                        placeholder="Nearest bus Stop"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.nearest_bus_stop}
                                        onChange={(e) => handleInputChange("nearest_bus_stop", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Closest Landmark</label>

                                    <input
                                        type="text"
                                        placeholder="Closest Landmark"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.closest_landmark}
                                        onChange={(e) => handleInputChange("closest_landmark", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Business / Organization name</label>

                                    <input
                                        type="text"
                                        placeholder="Business Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.business_name}
                                        onChange={(e) => handleInputChange("business_name", e.target.value)}
                                        required
                                    />
                                </div>

                                

                            </div>

                            
                   
                            
                           
                            <button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold p-3 w-40"
                            >
                                <FontAwesomeIcon icon={faPlusCircle} /> Add Another Guarantor
                            </button>
                        </form>
                       

                </div>
            </div>
        );
    }


export default Guarrantors;
