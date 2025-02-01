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
    faCalendarAlt,
    faEnvelope,
    faGenderless,
    faLanguage,
    faList,
    faLocation,
    faPeopleArrows,
    faPhoneAlt,
    faPlusCircle,
    faTimes,
    faUser,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';
import moment from "moment";
import { Link } from 'react-router-dom';




const Customer = () => {
    const [Customer, setCustomer] = useState([]);
    const [leaves, setLeave] = useState([]);
    const [banks, setBank] = useState([]);
    const [CustomerView, setCustomerView] = useState([]);
    const [bankView, setBankView] = useState([]);
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const token = localStorage.getItem("token");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [formDatas, setFormDatas] = useState({});
    const [isModalOpense, setIsModalOpense] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [receiverId, setReceiverId] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [keyword, setKeyword] = useState([]);
    const [putBank, setPutBank] = useState(null);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10; // Adjust if needed
    const [selectedLeave, setSelectedLeave] = useState(null); // State for selected package
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("CustomerPersonal");
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
        localStorage.setItem("CustomerPersonal", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    // useEffect(() => {
    //     // Initialize DataTables
    //     $(document).ready(function () {
    //         $("#CustomerTable").DataTable();
    //     });
    // }, []);

    const toggleModal = (id) => {
        const fileToEdit = Customer.find((Customers) => Customers.id === id); // Find package by ID
        const bankDteails = bankView.filter((ban) => ban.CustomerId === selectedCustomer.id);
        const CustomerWithBankDetails = {
            ...fileToEdit,
            bank_details: bankDteails,
        };
        setSelectedCustomer(CustomerWithBankDetails); // Set package data  
        // setBank(bankDteails)


        setIsModalOpen(!isModalOpen); // Toggle modal visibility
        setSubmissionStatus(null); // Clear status on modal open
    };





    const toggleModalse = () => {
        setIsModalOpense(!isModalOpense);
    };

    const fixBank = () => {
        const setBanknow = bankView.find((banks) => banks.CustomerId === bankId); // Find package by ID
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

    // delete

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
    
        try {
            const response = await axios.delete(`${BASE_URL}api/v1/Customer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Remove deleted item from state
            setKeyword((prevKeyword) => prevKeyword.filter((item) => item.id !== id));
            console.log(response.data.message);
        } catch (error) {
            console.error("Error deleting item:", error.message || error);
        }
    };

    // GET ALL LEAVES
    useEffect(() => {
        axios
            .get(`${BASE_URL}api/v1/Leave/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setLeave(response.data);
            })
            .catch((error) => {
                console.error("Error fetching languagess:", error);
            });
    }, [token]);


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
            const response = await axios.put(
                `${BASE_URL}api/v1/Customer/${bankId}`,
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

        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/Customer`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Customer data
                const CustomerData = response.data;
                if (Array.isArray(CustomerData)) {
                    setCustomer(CustomerData);
                } else {
                    console.error("Error: Expected Customer data to be an array but received:", CustomerData);
                }
            } catch (error) {
                console.error("Error fetching Customer data:", error.message || error);
            }
        };

        // Fetch data initially and then set up an interval
        fetchCustomerData();
        intervalId = setInterval(fetchCustomerData, 5000); // Fetch data every 5 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [BASE_URL, token]); // Dependencies to re-run when they change


    // GET CustomerS BY ID

    useEffect(() => {
        let intervalId;

        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/Customer/${selectedCustomer.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Customer data
                const CustomerDataView = response.data;
                if (Array.isArray(CustomerDataView)) {
                    setCustomerView(CustomerDataView);
                } else {
                    console.error("Error: Expected Customer data to be an array but received:", CustomerDataView);
                }
            } catch (error) {
                console.error("Error fetching Customer data:", error.message || error);
            }
        };

        // Fetch data initially and then set up an interval
        fetchCustomerData();
        intervalId = setInterval(fetchCustomerData, 5000); // Fetch data every 5 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [BASE_URL, token]); // Dependencies to re-run when they change



    // GET CustomerS BANK DETAILS

    useEffect(() => {
        let intervalId;

        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/bank/${selectedCustomer.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Customer data

                const CustomerBankView = response.data;
                if (Array.isArray(CustomerBankView)) {
                    setBankView(CustomerBankView);
                } else {
                    console.error("Error: Expected Customer data to be an array but received:", CustomerBankView);
                }
            } catch (error) {
                console.error("Error fetching Customer data:", error.message || error);
            }
        };

        // Fetch data initially and then set up an interval
        fetchCustomerData();
        intervalId = setInterval(fetchCustomerData, 5000); // Fetch data every 5 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [BASE_URL, token]); // Dependencies to re-run when they change
    const formatDate = (timestamp)=>{
        return moment(timestamp).format("MMMM DD, YYYY hh:mm A");
    };

    // Handle search
    useEffect(() => {
        if (searchQuery) {
            const filtered = Customer.filter((staff) =>
                `${staff.first_name} ${staff.last_name} ${staff.email} ${staff.phone} ${staff.gender}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            setFilteredStaffs(filtered);
            setCurrentPage(1); // Reset to first page after search
        } else {
            setFilteredStaffs(Customer);
        }
    }, [searchQuery, Customer]);

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredStaffs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredStaffs.length / recordsPerPage);
    return (
        <div>
            <div className="flex h-screen bg-gray-100">
                <div className="">
                    <AdminSidebar />
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Navmenu />
                    <h2 className="font-bold sm:text-2xl p-4 mt-0 bg-white text-gray-600 shadow-sm">Customer Management System</h2>
                    <button onClick={toggleModalse} className="bg-blue-600 rounded-xl p-2 ml-8 mt-2 items-end justify-end text-white w-40"><FontAwesomeIcon icon={faPlusCircle} /> Add new</button>
                    <div className="p-6 shadow-xl bg-white mt-2">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border p-2 w-full mb-4 shadow-xl"
                        />
                        <table
                            id="CustomerTable"
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
                            {currentRecords.length > 0 ? (
                                currentRecords.map((Customers, index) => (
                                    
                                    <tr
                                    
                                        key={Customers.id}
                                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } border-b`}
                                           
                                            
                                    >
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">
                                            {Customers.first_name} {Customers.last_name}
                                        </td>
                                        <td className="border px-4 py-2">{Customers.email}</td>
                                        <td className="border px-4 py-2">{Customers.phone}</td>
                                        <td className="border px-4 py-2">{Customers.gender}</td>
                                        <td className="border px-4 py-2">{Customers.collected === 1 ? (
                                            <button className="bg-blue-800 p-1 font-semibold text-white w-24">Collected</button>
                                        ) : (
                                            <button className="bg-red-800 p-1 text-white font-semibold">Not Collected</button>
                                        )}</td>
                                        <td className="border px-4 py-2">
                                            <div className="relative inline-block text-left">
                                                <Menu>
                                                    <Menu.Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-md">
                                                        Action
                                                    </Menu.Button>
                                                    <Menu.Items className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md">
                                                        <Menu.Item
                                                        onClick={() => toggleBankModal(Customers.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                        onClick={() => handleDelete (Customers.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => toggleModal(Customers.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            View
                                                        </Menu.Item>
                                                        

                                                        

                                                        
                                                        
                                                    </Menu.Items>
                                                </Menu>
                                            </div>
                                        </td>
                                    </tr>
                                 ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4">No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>                    </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-4 space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 ${currentPage === 1 ? "bg-gray-400" : "bg-blue-500"} text-white`}
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 ${currentPage === i + 1 ? "bg-blue-700" : "bg-gray-300"} text-white`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 ${currentPage === totalPages ? "bg-gray-400" : "bg-blue-500"} text-white`}
                            >
                                Next
                            </button>
                        </div>
                </div>
            </div>



            {/* Modal */}
            {isModalOpen && selectedCustomer && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-center justify-center overflow-y-auto z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-4 ">


                        {/* Right section */}
                        <div className="w- p-4  border shadow-md">
                            <h2 className="font-bold sm:text-2xl bg-green-800 text-white"><FontAwesomeIcon icon={faUserCircle} /> Personal Information
                            </h2>
                            <img src="../image/54.png" className="rounded-full items-center w-40 lg:ml-40 border-white-700 shadow-xl border-8" />

                            <div className=" mt-10">
                                <h2 className="font-bold sm:text-2xl  bg-gray-500 text-white rounded-sm"><FontAwesomeIcon icon={faUserCircle} /> {selectedCustomer.first_name} {selectedCustomer.last_name}
                                <h2 className="font-medium p-1">{selectedCustomer.office} Office</h2>
                                </h2>
                                
                            </div>
                            <div className="grid lg:grid-cols-2 gap-3 mt-7 justify-start">
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faEnvelope} /> Email Address</h2>
                                <h2 className="text-left">{selectedCustomer.email}</h2>

                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPhoneAlt} /> Phone Number</h2>
                                <h2 className="text-left">{selectedCustomer.phone}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faLocation} /> Address</h2>
                                <h2 className="text-left">{selectedCustomer.address}, {selectedCustomer.state}, {selectedCustomer.country}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faGenderless} /> Gender</h2>
                                <h2 className="text-left">{selectedCustomer.gender}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPeopleArrows} /> Marital Status</h2>
                                <h2 className="text-left">{selectedCustomer.marital_status}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faLanguage} /> Language</h2>
                                <h2 className="text-left">{selectedCustomer.language}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faCalendarAlt} /> Date of Birth</h2>
                                <h2 className="text-left">{formatDate(selectedCustomer.dob)}</h2>
                            </div>
                        </div>

                        {/* Left section */}

                        {/* contract section */}
                        <div className="w-full p-4  border shadow-md">
                            <h2 className="font-bold sm:text-2xl bg-blue-800 text-white"> <FontAwesomeIcon icon={faBank} /> Office Acknowladgement</h2>
                            <hr />
                            <div className="">

                                <div className="mb-4 grid lg:grid-cols-2 gap-3 mt-7 justify-start">



                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faBank} />Card Serial Number</h2>
                                    <h2 className="text-left">{selectedCustomer.card_number}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faUser} /> Card Type</h2>
                                    <h2 className="text-left">{selectedCustomer.card_type}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faList} /> Card Expiration Date</h2>
                                    <h2 className="text-left">{formatDate(selectedCustomer.card_expired)}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faList} /> Issued By</h2>
                                    <h2 className="text-left">{selectedCustomer.issued_by}</h2>
                                   
                                </div>






                                <p className=""></p>
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



            {/* Customer Information  Modal */}
            {isModalOpense && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-4xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleModalse}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Customers</h3>
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

                        <button
                            onClick={toggleModalse}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}






            {/* Aknowlegagement  Modal */}
            {isBankModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-md">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleBankModal}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Customer Data</h3>
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmitBank}>
                            <div
                                className="grid lg:grid-cols-2 gap-4 mb-4 items-center"
                            >

                                <div>
                                    <label className="block mb-2 font-semibold">Card Serial Number</label>

                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.card_number}
                                        onChange={(e) => handleInputChange("card_number", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Loyalty Card Type</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.card_type}
                                        onChange={(e) => handleInputChange("card_type", e.target.value)}
                                        required>

                                        <option value="" key="">Select loyalty card type</option>
                                        <option value="VIP" key="">VIP</option>
                                        <option value="Regular" key="">Regular</option>
                                       
                                       
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Card Expiration Date</label>

                                    <input
                                        type="date"
                                        placeholder="Card Expiration"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.card_expire}
                                        onChange={(e) => handleInputChange("card_expire", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Status</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.collected}
                                        onChange={(e) => handleInputChange("collected", e.target.value)}
                                        required>

                                        <option value="" key="">Select status</option>
                                        <option value="1" key="">Collected</option>
                                        <option value="0" key="">Not Collected</option>
                                       
                                       
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Card Issued By</label>

                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.issued_by}
                                        onChange={(e) => handleInputChange("issued_by", e.target.value)}
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
                            onClick={toggleBankModal}
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


export default Customer;