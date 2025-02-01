import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/Adminsidebar';
import axios from "axios";
import { Menu } from "@headlessui/react"; // Example dropdown library
import $ from "jquery";
// import "datatables.net-dt/css/jquery.dataTables.css"; // DataTable styling
import "datatables.net";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faList,
    faPlusCircle,
    faTimeline,
    faTimes,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';
import moment from "moment";




const Leave = () => {
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
    const [keyword, setKeyword] = useState([]);
    const [putBank, setPutBank] = useState(null);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10; // Adjust if needed
    const [selectedLeave, setSelectedLeave] = useState(null); // State for selected package
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("leaveInfo");
        const parsedData = savedData ? JSON.parse(savedData) : null;

        return parsedData || {
           leave_reason: "", leave_duration: "",
            on_leave: "", staff_name: "", 
            
        };
    });

    useEffect(() => {
        localStorage.setItem("leaveInfo", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };
 

    // const toggleModal = (id) => {
    //     const fileToEdit = leaves.find((leave) => leave.id === id); // Find package by ID
    //     const bankDteails = bankView.filter((ban) => ban.staffId === selectedStaff.id);
    //     const staffWithBankDetails = {
    //         ...fileToEdit,
    //         bank_details: bankDteails,
    //     };
    //     setSelectedStaff(staffWithBankDetails); // Set package data  
    //     // setBank(bankDteails)


    //     setIsModalOpen(!isModalOpen); // Toggle modal visibility
    //     setSubmissionStatus(null); // Clear status on modal open
    // };

    const toggleModal = (id) => {
        const fileToEdit = leaves.find((leave) => leave.id === id); // Find package by ID
        setSelectedLeave(fileToEdit);
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




    // delete

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.delete(`${BASE_URL}api/v1/Leave/${id}`, {
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
            .get(`${BASE_URL}api/v1/Leave`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setLeave(response.data);
            })
            .catch((error) => {
                console.error("Error fetching languagess:", error);
            });
    }, [token]);

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





    useEffect(() => {
        let intervalId;

        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/Leave`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Validate and set Staff data
                const StaffData = response.data;
                if (Array.isArray(StaffData)) {
                    setLeave(StaffData);
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




    const formatDate = (timestamp) => {
        return moment(timestamp).format("MMMM DD, YYYY hh:mm A");
    };

    // Handle search
    useEffect(() => {
        if (searchQuery) {
            const filtered = leaves.filter((staff) =>
                `${staff.first_name} ${staff.last_name} ${staff.email} ${staff.phone} ${staff.gender}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            setFilteredStaffs(filtered);
            setCurrentPage(1); // Reset to first page after search
        } else {
            setFilteredStaffs(leaves);
        }
    }, [searchQuery, leaves]);

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
                    <h2 className="font-bold sm:text-2xl p-4 mt- bg-white text-gray-600 shadow-sm">Leave System</h2>

                    <button onClick={toggleLeaveModal} className="bg-blue-600 rounded-xl p-2 ml-8 mt-2 items-end justify-end text-white w-40"><FontAwesomeIcon icon={faPlusCircle} /> Add new</button>
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
                                    <th className="border px-4 py-2 text-left">Name</th>
                                    <th className="border px-4 py-2 text-left">Duration</th>
                                    <th className="border px-4 py-2 text-left">Reason</th>
                                    <th className="border px-4 py-2 text-left">Status</th>
                                    <th className="border px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {currentRecords.length > 0 ? (
                                currentRecords.map((leave, index) => (
                                    <tr
                                        key={leave.id}
                                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } border-b`}
                                    >
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">
                                            {leave.staff_name}
                                        </td>
                                        <td className="border px-4 py-2">{leave.leave_duration}</td>
                                        <td className="border px-4 py-2">{leave.leave_reason}</td>
                                        <td className="border px-4 py-2">{leave.on_leave === 1 ? (
                                            <button className="bg-blue-800 p-1 font-semibold text-white w-24">On Leave</button>
                                        ) : (
                                            <button className="bg-red-800 p-1 text-white font-semibold">Not on leave</button>
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
                                                            onClick={() => handleDelete(leave.id)}
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => toggleModal(leave.id)}
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
                        </div>                             </div>
                </div>
            </div>



            {/* Modal */}
            {isModalOpen && selectedLeave && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-center justify-center overflow-y-auto z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl mx-auto grid lg:grid-cols-1 gap-4 ">


                        {/* Right section */}
                        <div className="w- p-4  border shadow-md">
                            <h2 className="font-bold sm:text-2xl bg-green-800 text-white"><FontAwesomeIcon icon={faUserCircle} /> Leave Information</h2>
                            
                            <div className=" mt-4">
                                <h2 className="font-bold sm:text-2xl  bg-gray-500 text-white rounded-sm"><FontAwesomeIcon icon={faUserCircle} /> {selectedLeave.staff_name}</h2>
                                
                            </div>
                            <div className="grid lg:grid-cols-2 gap-3 mt-7 justify-start">
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faTimeline} /> Leave Duration</h2>
                                <h2 className="text-left">{selectedLeave.leave_duration}</h2>

                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faList} /> Leave Reason</h2>
                                <h2 className="text-left">{selectedLeave.leave_reason}</h2>

                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faCalendarAlt} /> Date</h2>
                                <h2 className="text-left">{formatDate(selectedLeave.createdAt)}</h2>
                            </div>
                        </div>

                       


                        {/* Left section */}

                        {/* contract section */}
                        



                        <button
                            onClick={toggleModal}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>



                </div>

            )}





            {/* Leave Details  Modal */}
            {isLeaveModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-3xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleLeaveModal}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Staff Data</h3>
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

                        <button
                            onClick={toggleLeaveModal}
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


export default Leave;