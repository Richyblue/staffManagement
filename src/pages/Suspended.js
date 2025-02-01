import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/Adminsidebar';
import axios from "axios";
import { Menu } from "@headlessui/react"; // Example dropdown library
import $ from "jquery";
// import "datatables.net-dt/css/jquery.dataTables.css"; // DataTable styling
import "datatables.net";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBank,
    faCancel,
    faEnvelope,
    faGenderless,
    faInfoCircle,
    faLanguage,
    faList,
    faLocation,
    faPeopleArrows,
    faPhoneAlt,
    faPlusCircle,
    faRefresh,
    faTimes,
    faUser,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';




const Suspended = () => {
    const [staff, setStaff] = useState([]);
    const [leaves, setLeave] = useState([]);
    const [banks, setBank] = useState([]);
    const [staffView, setStaffView] = useState([]);
    const [bankView, setBankView] = useState([]);
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const token = localStorage.getItem("token");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [formDatas, setFormDatas] = useState({});
    const [isModalOpense, setIsModalOpense] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [receiverId, setReceiverId] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [putBank, setPutBank] = useState(null);
    const [selectedLeave, setSelectedLeave] = useState(null); // State for selected package
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("staffPersonal");
        const parsedData = savedData ? JSON.parse(savedData) : null;

        return parsedData || {
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
            is_terminated: "",
            is_suspended: "",
            leave_reason: "",
            leave_duration: "",
            on_leave: "",
            bank_name: "",
            beneficiary: "",
            acc_number: "",
        };
    });

    useEffect(() => {
        localStorage.setItem("staffPersonal", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    useEffect(() => {
        // Initialize DataTables
        $(document).ready(function () {
            $("#staffTable").DataTable();
        });
    }, []);

    const toggleModal = (id) => {
        const fileToEdit = staff.find((staffs) => staffs.id === id); // Find package by ID
        const bankDteails = bankView.filter((ban) => ban.staffId === selectedStaff.id);
        const staffWithBankDetails = {
            ...fileToEdit,
            bank_details: bankDteails,
        };
        setSelectedStaff(staffWithBankDetails); // Set package data  
        // setBank(bankDteails)


        setIsModalOpen(!isModalOpen); // Toggle modal visibility
        setSubmissionStatus(null); // Clear status on modal open
    };





    const toggleModalse = () => {
        setIsModalOpense(!isModalOpense);
    };

    const fixBank = () => {
        const setBanknow = bankView.find((banks) => banks.staffId === bankId); // Find package by ID
        setPutBank(setBanknow); // Set package data
    }


    const toggleLeaveModal = (id) => {
        setReceiverId(id);
        setIsLeaveModalOpen(!isLeaveModalOpen);
        setSubmissionStatus(null); // Clear status on modal open
    };


    const toggleBankModal = (id) => {
        setBankId(id);
        setIsBankModalOpen(!isBankModalOpen);
        setSubmissionStatus(null); // Clear status on modal open
    };


    // submmit form 
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${BASE_URL}api/v1/staff`,
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


    // submmit leave form 
    const handleSubmitLeave = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${BASE_URL}api/v1/Leave/${receiverId}`,
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


    // submmit Bank form 
    const handleSubmitBank = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${BASE_URL}api/v1/bank/${bankId}`,
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



    useEffect(() => {
        let intervalId;

        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/staff/st`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Staff data
                const StaffData = response.data;
                if (Array.isArray(StaffData)) {
                    setStaff(StaffData);
                } else {
                    console.error("Error: Expected Staff data to be an array but received:", StaffData);
                }
            } catch (error) {
                console.error("Error fetching Staff data:", error.message || error);
            }
        };

        // Fetch data initially and then set up an interval
        fetchStaffData();
        intervalId = setInterval(fetchStaffData, 5000); // Fetch data every 5 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [BASE_URL, token]); // Dependencies to re-run when they change


    // GET STAFFS BY ID

    useEffect(() => {
        let intervalId;

        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/staff/${selectedStaff.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Staff data
                const StaffDataView = response.data;
                if (Array.isArray(StaffDataView)) {
                    setStaffView(StaffDataView);
                } else {
                    console.error("Error: Expected Staff data to be an array but received:", StaffDataView);
                }
            } catch (error) {
                console.error("Error fetching Staff data:", error.message || error);
            }
        };

        // Fetch data initially and then set up an interval
        fetchStaffData();
        intervalId = setInterval(fetchStaffData, 5000); // Fetch data every 5 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [BASE_URL, token]); // Dependencies to re-run when they change



    // GET STAFFS BANK DETAILS

    useEffect(() => {
        let intervalId;

        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/bank/${selectedStaff.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Staff data

                const StaffBankView = response.data;
                if (Array.isArray(StaffBankView)) {
                    setBankView(StaffBankView);
                } else {
                    console.error("Error: Expected Staff data to be an array but received:", StaffBankView);
                }
            } catch (error) {
                console.error("Error fetching Staff data:", error.message || error);
            }
        };

        // Fetch data initially and then set up an interval
        fetchStaffData();
        intervalId = setInterval(fetchStaffData, 5000); // Fetch data every 5 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [BASE_URL, token]); // Dependencies to re-run when they change

    return (
        <div>
            <div className="flex h-screen bg-gray-100">
                <div className="">
                    <AdminSidebar />
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Navmenu />
                    <button onClick={toggleModalse} className="bg-blue-600 rounded-xl p-2 ml-8 mt-9 items-end justify-end text-white w-40"><FontAwesomeIcon icon={faPlusCircle} /> Add new</button>
                    <div className="p-6 shadow-xl bg-white mt-7">
                        <table
                            id="staffTable"
                            className="min-w-full bg-white border border-gray-300 lg:p-5 text-sm text-gray-800"
                        >
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="border px-4 py-2 text-left">#</th>
                                    <th className="border px-4 py-2 text-left">Name</th>
                                    <th className="border px-4 py-2 text-left">Email</th>
                                    <th className="border px-4 py-2 text-left">Phone</th>
                                    <th className="border px-4 py-2 text-left">Gender</th>
                                    <th className="border px-4 py-2 text-left">Status</th>
                                    <th className="border px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((staffs, index) => (
                                    <tr
                                        key={staffs.id}
                                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } border-b`}
                                    >
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">
                                            {staffs.first_name} {staffs.last_name}
                                        </td>
                                        <td className="border px-4 py-2">{staffs.email}</td>
                                        <td className="border px-4 py-2">{staffs.phone}</td>
                                        <td className="border px-4 py-2">{staffs.gender}</td>
                                        <td className="border px-4 py-2">{staffs.is_suspended === 1 ? (
                                            <button className="bg-blue-800 p-1 font-semibold text-white w-24">Active</button>
                                        ):(
                                            <button className="bg-red-800 p-1 text-white font-semibold">Suspended</button>
                                        )}</td>
                                        <td className="border px-4 py-2">
                                            <div className="relative inline-block text-left">
                                                <Menu>
                                                    <Menu.Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-md">
                                                        Action
                                                    </Menu.Button>
                                                    <Menu.Items className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md">
                                                        <Menu.Item
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => toggleModal(staffs.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            View
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => toggleBankModal(staffs.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Add Bank Details
                                                        </Menu.Item>

                                                        <Menu.Item
                                                            onClick={() => toggleLeaveModal(staffs.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Add Leave
                                                        </Menu.Item>

                                                        <Menu.Item
                                                            onClick={() => toggleModal(staffs.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Add Education
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => toggleModal(staffs.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Add Certificate
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Menu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>                    </div>
                </div>
            </div>



            {/* Modal */}
            {isModalOpen && selectedStaff && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-center justify-center overflow-y-auto z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-4 ">


                        {/* Right section */}
                        <div className="w- p-4  border shadow-md">
                            <h2 className="font-bold sm:text-2xl bg-green-800 text-white"><FontAwesomeIcon icon={faUserCircle} /> Personal Information</h2>
                            <img src="../image/54.png" className="rounded-full items-center w-40 lg:ml-40 border-white-700 shadow-xl border-8" />

                            <div className=" mt-10">
                                <h2 className="font-bold sm:text-2xl  bg-gray-500 text-white rounded-sm"><FontAwesomeIcon icon={faUserCircle} /> {selectedStaff.first_name} {selectedStaff.last_name}</h2>
                                <h2 className="font-semibold">{selectedStaff.role}</h2>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-3 mt-7 justify-start">
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faEnvelope} /> Email Address</h2>
                                <h2 className="text-left">{selectedStaff.email}</h2>

                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPhoneAlt} /> Phone Number</h2>
                                <h2 className="text-left">{selectedStaff.phone}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faLocation} /> Address</h2>
                                <h2 className="text-left">{selectedStaff.address}, {selectedStaff.state}, {selectedStaff.country}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faGenderless} /> Gender</h2>
                                <h2 className="text-left">{selectedStaff.gender}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPeopleArrows} /> Marital Status</h2>
                                <h2 className="text-left">{selectedStaff.marital_status}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faLanguage} /> Language</h2>
                                <h2 className="text-left">{selectedStaff.language}</h2>
                            </div>





                        </div>

                        {/* Left section */}
                        <div className="w-full p-4  border shadow-md">
                            <h2 className="font-bold sm:text-2xl bg-blue-800 text-white"><FontAwesomeIcon icon={faRefresh} /> Leave Information</h2>
                            <hr />


                            <div className="">
                                <h2 className="font-bold sm:text-lg">Leave Data</h2>
                                <p className=""> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis nobis dolor reiciendis architecto vel blanditiis ipsa doloremque quam laboriosam officia! Voluptatibus iste nihil, deleniti in at officia doloribus ipsam quidem.</p>
                            </div>
                        </div>

                        {/* contract section */}
                        <div className="w-full p-4  border shadow-md">
                            <h2 className="font-bold sm:text-2xl bg-blue-800 text-white"> <FontAwesomeIcon icon={faBank} /> Bank Information</h2>
                            <hr />



                            <div className="">
                                




                                
                                        <div  className="mb-4 grid lg:grid-cols-2 gap-3 mt-7 justify-start">
                                    


                                            <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faBank} />Bank Name</h2>
                                <h2 className="text-left">{selectedStaff.bank_name}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faUser} /> Beneficiary</h2>
                                <h2 className="text-left">{selectedStaff.beneficiary}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faList} /> Account Number</h2>
                                <h2 className="text-left">{selectedStaff.acc_number}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faList} /> BVN</h2>
                                <h2 className="text-left">{selectedStaff.bvn}</h2>
                                        </div>
                                 





                                <p className=""></p>
                            </div>
                        </div>



                        <div className="w-full p-4  border shadow-md">
                            <h2 className="font-bold sm:text-2xl bg-yellow-600 text-white"><FontAwesomeIcon icon={faInfoCircle} />  Suspension Information</h2>
                            <hr />


                            <div className="">
                                <h2 className="font-bold sm:text-lg">Leave Data</h2>
                                <p className=""> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis nobis dolor reiciendis architecto vel blanditiis ipsa doloremque quam laboriosam officia! Voluptatibus iste nihil, deleniti in at officia doloribus ipsam quidem.</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleModal}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>



                </div>

            )}



            {/* Personal Information  Modal */}
            {isModalOpense && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-4xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleModalse}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Staff Data</h3>
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
                                    <label className="block mb-2 font-semibold">BVN</label>

                                    <input
                                        type="text"
                                        placeholder="bvn"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.bvn}
                                        onChange={(e) => handleInputChange("bvn", e.target.value)}
                                        required
                                    />
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

                                <div>
                                    <label className="block mb-2 font-semibold">Role/Position</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.role}
                                        onChange={(e) => handleInputChange("role", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="Admin" key="">Admin</option>
                                        <option value="Manager" key="">Manager</option>
                                        <option value="Barber" key="">Barbers</option>
                                    </select>
                                </div>

                            </div>
                            <hr/>
                            <h2 className="font-bold sm:text-lg">Bank Informations</h2>
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Bank Name</label>

                                    <input
                                        type="text"
                                        placeholder="bank Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.bank_name}
                                        onChange={(e) => handleInputChange("bank_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Beneficiary</label>

                                    <input
                                        type="text"
                                        placeholder="Beneficiary"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.beneficiary}
                                        onChange={(e) => handleInputChange("beneficiary", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Bank Account Number</label>

                                    <input
                                        type="text"
                                        placeholder="Account Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.acc_number}
                                        onChange={(e) => handleInputChange("acc_number", e.target.value)}
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

                        <button
                            onClick={toggleModalse}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}



            


            
        </div>
    );
}


export default Suspended;