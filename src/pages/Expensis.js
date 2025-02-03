import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/Adminsidebar';
import axios from "axios";
import { Menu } from "@headlessui/react"; // Example dropdown library
import $ from "jquery";
// import "datatables.net-dt/css/jquery.dataTables.css"; // DataTable styling
import "datatables.net";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   
    faPlusCircle,
  
    faTimes,
   
} from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';
import moment from "moment";
import { Link } from 'react-router-dom';




const Expensis = () => {
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
    const [formDatas, setFormDatas] = useState({});
    const [isModalOpense, setIsModalOpense] = useState(false);
    const [isModalOpenseUpdate, setIsModalOpenseUpdate] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [receiverId, setReceiverId] = useState(null);
    const [keyword, setKeyword] = useState([]);
    const [bankId, setBankId] = useState(null);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10; // Adjust if needed
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("expensisupdate");
        const parsedData = savedData ? JSON.parse(savedData) : null;

        return parsedData || {
            items: "",
            e_quantity: "",
            unit_price: "",
            expensis_for: "",
        };
    });

    useEffect(() => {
        localStorage.setItem("expensisupdate", JSON.stringify(formData));
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
    // useEffect(() => {
    //     // Initialize DataTables
    //     $(document).ready(function () {
    //         $("#staffTable").DataTable();
    //     });
    // }, []);

    





    const toggleModalse = () => {
        setIsModalOpense(!isModalOpense);
    };



    const toggleModalseUpdate = (id) => {
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
                `${BASE_URL}api/v1/Expensis`,
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
            const response = await axios.delete(`${BASE_URL}api/v1/Expensis/${id}`, {
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
                const response = await axios.get(`${BASE_URL}api/v1/Expensis`, {
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
        return row.e_quantity * row.unit_price;
    };

    const calculateGrandTotal =() =>{
        return inventory.reduce((total, row)=> total + row.e_quantity * row.unit_price, 0);
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
                    <h2 className="font-bold sm:text-2xl p-4 mt- bg-white text-gray-600 shadow-sm">Expensis System</h2>
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
                            id="staffTable"
                            className="min-w-full bg-white border border-gray-300 lg:p-5 text-sm text-gray-800"
                        >
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="border px-4 py-2 text-left">#</th>
                                    <th className="border px-4 py-2 text-left">Items</th>
                                    <th className="border px-4 py-2 text-left">Quantity</th>
                                    <th className="border px-4 py-2 text-left">Unit Price</th>
                                    <th className="border px-4 py-2 text-left">Name</th>
                                   
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
                                            {invent.first_name} {invent.items}
                                        </td>
                                        <td className="border px-4 py-2">{invent.e_quantity}</td>
                                        <td className="border px-4 py-2">{invent.unit_price}</td>
                                        <td className="border px-4 py-2">{invent.expensis_for}</td>
                                        <td className="border px-4 py-2">{formatDate(invent.createdAt || invent.updatedAt)}</td>
                                        <td className="border px-4 py-2">{calculateTotal(invent)}</td>
                                       
                                        <td className="border px-4 py-2">
                                            <div className="relative inline-block text-left">
                                                <Menu>
                                                    <Menu.Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-md">
                                                        Action
                                                    </Menu.Button>
                                                    <Menu.Items className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md">
                                                        <Link to={`/editexpenses/${invent.id}`}>
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
                        </div>                                </div>
                </div>
            </div>






            {/* Expensis  Modal */}
            {isModalOpense && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-4xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleModalse}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Expensis</h3>
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
                                    <label className="block mb-2 font-semibold">Items</label>

                                    <input
                                        type="text"
                                        placeholder="Describe the product name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.items}
                                        onChange={(e) => handleInputChange("items", e.target.value)}
                                        required
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 font-semibold">Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="Last Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.e_quantity}
                                        onChange={(e) => handleInputChange("e_quantity", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Unit price</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="text"
                                        placeholder="unit_price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.unit_price}
                                        onChange={(e) => handleInputChange("unit_price", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Fullname</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="text"
                                        placeholder="name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.expensis_for}
                                        onChange={(e) => handleInputChange("expensis_for", e.target.value)}
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



            

            {/* Update Expensis  Modal */}
            {isModalOpenseUpdate &&(
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-4xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleModalseUpdate}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Update Expensis</h3>
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
                                        value={selectedStaff.items}
                                        onChange={(e) => handleUpdateChange("items", e.target.value)}
                                        required
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 font-semibold">Quantity</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.e_quantity}
                                        onChange={(e) => handleInputChange("e_quantity", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Unit Price</label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="text"
                                        placeholder="Supplier Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.unit_price}
                                        onChange={(e) => handleInputChange("unit_price", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Expensis <body class="">
                                        
                                    </body></label>
                                    {/* <p className="text-xs text-black mb-2">
                                        Enter the price for this package in your preferred currency.
                                    </p> */}
                                    <input
                                        type="number"
                                        placeholder="Purchase Price"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.expensis_for}
                                        onChange={(e) => handleInputChange("expensis_for", e.target.value)}
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


export default Expensis;
