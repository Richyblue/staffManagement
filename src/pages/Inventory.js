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
import moment from "moment";
import { Link } from 'react-router-dom';




const Inventory = () => {
    const [inventory, setInventory] = useState([]);
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
    const [isModalOpenseUpdate, setIsModalOpenseUpdate] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [receiverId, setReceiverId] = useState(null);
    const [keyword, setKeyword] = useState([]);
    const [bankId, setBankId] = useState(null);
    const [putBank, setPutBank] = useState(null);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10; // Adjust if needed
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
            product_name: "",
            quantity: "",
            purchase_price: "",
            selling_price: "",
            category: ""
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

    const handleUpdateChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };
   

    const toggleModal = (id) => {
        const fileToEdit = inventory.find((invent) => invent.id === id); // Find package by ID
        const bankDteails = bankView.filter((ban) => ban.staffId === selectedStaff.id);
        const staffWithBankDetails = {
            ...fileToEdit,
            bank_details: bankDteails,
        };
        // setSelectedStaff(staffWithBankDetails); // Set package data  
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


    const toggleModalseUpdate = (id) => {
        setReceiverId(id);
        const fileToEdit = inventory.find((invent) => invent.id === id); // Find package by ID
        setSelectedStaff(fileToEdit); // Set package data 
        setIsModalOpenseUpdate(!isModalOpenseUpdate);
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
                `${BASE_URL}api/v1/inventory`,
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
    const handleSubmitupdate = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/inventory/${receiverId}`,
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
            const response = await axios.delete(`${BASE_URL}api/v1/inventory/${id}`, {
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
                const response = await axios.get(`${BASE_URL}api/v1/inventory`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Staff data
                const InventoryData = response.data;
                if (Array.isArray(InventoryData)) {
                    setInventory(InventoryData);
                } else {
                    console.error("Error: Expected Staff data to be an array but received:", InventoryData);
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


    const calculateTotal =(row) =>{
        return row.quantity * row.purchase_price;
    };

    const calculateGrandTotal =() =>{
        return inventory.reduce((total, row)=> total + row.quantity * row.purchase_price, 0);
    };
    // GET STAFFS BY ID

    const formatDate = (timestamp)=>{
        return moment(timestamp).format("MMMM DD, YYYY hh:mm A");
    };
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


    // Handle search
    useEffect(() => {
        if (searchQuery) {
            const filtered = inventory.filter((staff) =>
                `${staff.first_name} ${staff.last_name} ${staff.email} ${staff.phone} ${staff.gender}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            setFilteredStaffs(filtered);
            setCurrentPage(1); // Reset to first page after search
        } else {
            setFilteredStaffs(inventory);
        }
    }, [searchQuery, inventory]);

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
                    <h2 className="font-bold sm:text-2xl p-4 mt- bg-white text-gray-600 shadow-sm">Inventory System</h2>
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
                           
                            className="min-w-full bg-white border border-gray-300 lg:p-5 text-sm text-gray-800"
                        >
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="border px-4 py-2 text-left">#</th>
                                    <th className="border px-4 py-2 text-left">Name</th>
                                    <th className="border px-4 py-2 text-left">Quantity</th>
                                    <th className="border px-4 py-2 text-left">Supplier</th>
                                    <th className="border px-4 py-2 text-left">Unit Price</th>
                                    <th className="border px-4 py-2 text-left">Selling Price</th>
                                    <th className="border px-4 py-2 text-left">Category</th>
                                    <th className="border px-4 py-2 text-left">Date/Time</th>
                                    <th className="border px-4 py-2 text-left">Amount</th>
                                    <th className="border px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {currentRecords.length > 0 ? (
                                currentRecords.map((invent, index) => (
                                    <tr
                                        key={invent.id}
                                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } border-b`}
                                    >
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">
                                            {invent.first_name} {invent.product_name}
                                        </td>
                                        <td className="border px-4 py-2">{invent.quantity}</td>
                                        <td className="border px-4 py-2">{invent.supplier_name}</td>
                                        <td className="border px-4 py-2">{invent.purchase_price}</td>
                                        <td className="border px-4 py-2">{invent.selling_price}</td>
                                        <td className="border px-4 py-2">{invent.category}</td>
                                        <td className="border px-4 py-2">{formatDate(invent.createdAt || invent.updatedAt)}</td>
                                        <td className="border px-4 py-2">{calculateTotal(invent)}</td>
                                       
                                        <td className="border px-4 py-2">
                                            <div className="relative inline-block text-left">
                                                <Menu>
                                                    <Menu.Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-md">
                                                        Action
                                                    </Menu.Button>
                                                    <Menu.Items className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md">
                                                    <Link to={`/editinventory/${invent.id}`}>
                                                        <Menu.Item
                                                        
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        </Link>
                                                        <Menu.Item
                                                        onClick={()=> handleDelete(invent.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Delete
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
                            <tfoot>
                                <tr key="">
                                    <td className="font-bold sm:text-md">Grand total </td>
                                    <td className="font-bold sm:text-lg">N{calculateGrandTotal()}</td>
                                </tr>
                            </tfoot>
                        </table>  
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
                        </div>                  </div>
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



            {/* Inventory  Modal */}
            {isModalOpense && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-4xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleModalse}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Inventory</h3>
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
                                    <label className="block mb-2 font-semibold">Product Name</label>

                                    <input
                                        type="text"
                                        placeholder="Describe the product name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.product_name}
                                        onChange={(e) => handleInputChange("product_name", e.target.value)}
                                        required
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 font-semibold">Quantity</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.quantity}
                                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Suppplier Name</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="text"
                                        placeholder="Supplier Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.supplier_name}
                                        onChange={(e) => handleInputChange("supplier_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Purchase Price</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="number"
                                        placeholder="Purchase Price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.purchase_price}
                                        onChange={(e) => handleInputChange("purchase_price", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Selling Price</label>

                                    <input
                                        type="number"
                                        placeholder="Selling Price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.selling_price}
                                        onChange={(e) => handleInputChange("selling_price", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Category</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="Selling" key="">Selling</option>
                                        <option value="Use" key="">use</option>
                                    </select>
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



            

            {/* Update Inventory  Modal */}
            {isModalOpenseUpdate &&  selectedStaff &&(
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-4xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleModalseUpdate}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Update Inventory</h3>
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmitupdate}>
                            <div
                                className="grid lg:grid-cols-2 gap-4 mb-4 items-center"
                            >



                                <div>
                                    <label className="block mb-2 font-semibold">Product Name</label>

                                    <input
                                        type="text"
                                        placeholder="Describe the product name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.product_name}
                                        onChange={(e) => handleUpdateChange("product_name", e.target.value)}
                                        required
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 font-semibold">Quantity</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.quantity}
                                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Suppplier Name</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="text"
                                        placeholder="Supplier Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.supplier_name}
                                        onChange={(e) => handleInputChange("supplier_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Purchase Price</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="number"
                                        placeholder="Purchase Price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.purchase_price}
                                        onChange={(e) => handleInputChange("purchase_price", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Selling Price</label>

                                    <input
                                        type="number"
                                        placeholder="Selling Price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.selling_price}
                                        onChange={(e) => handleInputChange("selling_price", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Category</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.category}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                        required>

                                        <option value="" key="">Select one option</option>
                                        <option value="Selling" key="">Selling</option>
                                        <option value="Use" key="">use</option>
                                    </select>
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
                            onClick={toggleModalseUpdate}
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


export default Inventory;
