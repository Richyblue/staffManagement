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
    faInfoCircle,
    faLanguage,
    faList,
    faLocation,
    faMapLocation,
    faPen,
    faPenAlt,
    faPeopleArrows,
    faPhoneAlt,
    faPlusCircle,
    faRefresh,
    faShieldAlt,
    faTimes,
    faUser,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import Navmenu from '../components/Navmenu';
import moment from "moment";
import { Link } from 'react-router-dom';




const Datas = () => {
    const [staff, setStaff] = useState([]);
    const [leaves, setLeave] = useState([]);
    const [banks, setBank] = useState([]);
    const [personalId, setGetPersonalId] = useState([]);
    const [parentId, setGetParentId] = useState([]);
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
    const [isStatusModalOpense, setIsStatusModalOpense] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
    const [isParentModalOpen, setIsParentModalOpen] = useState(false);
    const [receiverId, setReceiverId] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const [keyword, setKeyword] = useState([]);
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
            first_name: "", last_name: "", email: "",
            phone: "", country: "", state: "", city: "",
            address: "", gender: "", marital_status: "",
            bvn: "", language: "", role: "", is_terminated: "",
            is_suspended: "", leave_reason: "", leave_duration: "",
            on_leave: "", bank_name: "", beneficiary: "",
            acc_number: "", nin_number: "", dob: "", parent_email: "",
            parent_address: "", parent_name: "", parent_number: "",
            extended_address: "", extended_email: "", extended_name: "",
            extended_number: "", friend_address: "", friend_email: "",
            friend_number: "", friend_name: "",
            medical_address: "", medical_email: "",
            medical_number: "", parent_name: "", status: "",

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

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // useEffect(() => {
    //     // Initialize DataTables
    //     $(document).ready(function () {
    //         $("#staffTable").DataTable();
    //     });
    // }, []);

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

    const togglepersonalModal = (id) => {
        setGetPersonalId(id);
        setIsPersonalModalOpen(!isPersonalModalOpen);
        setSubmissionStatus(null); // Clear status on modal open
    };

    const toggleparentModal = (id) => {
        setGetParentId(id);
        setIsParentModalOpen(!isParentModalOpen);
        setSubmissionStatus(null); // Clear status on modal open
    };

    const toggleStatusModal = (id) => {
        setStatusId(id);
        setIsStatusModalOpense(!isStatusModalOpense);
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
            setFormData({ first_name: "",last_name: "", email: "",
            phone: "", country: "", state: "", city: "",
            address: "", gender: "", marital_status: "",
            bvn: "", language: "", role: "",bank_name: "", beneficiary: "",
            acc_number: "", nin_number: "", dob: "" });
  

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
            const response = await axios.delete(`${BASE_URL}api/v1/staff/${id}`, {
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
        axios
            .get(`${BASE_URL}api/v1/bank/3`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setBank(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, [token]);


    useEffect(() => {
        let intervalId;

        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/staff`, {
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
                const response = await axios.get(`${BASE_URL}api/v1/staff/get/1`, {
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


    // submmit others form 
    const handleSubmitUpdateOther = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/staff/others/${bankId}`,
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



    // submmit others form 
    const handleSubmitUpdateMedical = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/staff/medical/${receiverId}`,
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
            setFormData({ medical_address: "", medical_email: "",
            medical_number: "", medical_name: "" });
                

        } catch (error) {
            setSubmissionStatus({
                success: false,
                message: error.response?.data?.message || "Failed to submit the form.",
            });
        }
    };

    // submmit Update Personal  form 
    const handleSubmitUpdatePersonal = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/staff/${personalId}`,
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

    // submmit Update Personal  form 
    const handleSubmitUpdateParent = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/staff/${parentId}`,
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
            setFormData({parent_email: "", parent_address: "", parent_name: "", parent_number: "",
             extended_address: "", extended_email: "", extended_name: "",
            extended_number: "", friend_address: "", friend_email: "",
            friend_number: "", friend_name: ""});


        } catch (error) {
            setSubmissionStatus({
                success: false,
                message: error.response?.data?.message || "Failed to submit the form.",
            });
        }
    };



    // submmit Update Personal  form 
    const handleSubmitUpdateStatus = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_URL}api/v1/staff/status/${statusId}`,
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


    // Handle search
    useEffect(() => {
        if (searchQuery) {
            const filtered = staff.filter((staff) =>
                `${staff.first_name} ${staff.last_name} ${staff.email} ${staff.phone} ${staff.gender}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            setFilteredStaffs(filtered);
            setCurrentPage(1); // Reset to first page after search
        } else {
            setFilteredStaffs(staff);
        }
    }, [searchQuery, staff]);

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredStaffs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredStaffs.length / recordsPerPage);






    const formatDate = (timestamp) => {
        return moment(timestamp).format("MMMM DD, YYYY hh:mm A");
    };
    return (
        <div>
            <div className="flex h-screen bg-gray-100">
                <div className="">
                    <AdminSidebar  />
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Navmenu />
                    <h2 className="font-bold sm:text-2xl p-4 mt- bg-white text-gray-600 shadow-sm">Staff Management System</h2>
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
                        {/* Staff Table */}
                        <table id="staffTable" className="min-w-full bg-white border border-gray-300 lg:p-5 text-sm text-gray-800">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="border px-4 py-2 text-left">#</th>
                                    <th className="border px-4 py-2 text-left">Name</th>
                                    <th className="border px-4 py-2 text-left">Email</th>
                                    <th className="border px-4 py-2 text-left">Phone</th>
                                    <th className="border px-4 py-2 text-left">Gender</th>
                                 <th className="border px-4 py-2 text-left">Location</th>
                                    <th className="border px-4 py-2 text-left">Status</th>
                                    <th className="border px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.length > 0 ? (
                                    currentRecords.map((staffs, index) => (
                                        <tr key={staffs.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b`}>
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{staffs.first_name} {staffs.last_name}</td>
                                            <td className="border px-4 py-2">{staffs.email}</td>
                                            <td className="border px-4 py-2">{staffs.phone}</td>
                                            <td className="border px-4 py-2">{staffs.gender}</td>
                                            <td className="border px-4 py-2">{staffs.language}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() => toggleStatusModal(staffs.id)}
                                                    className={`p-1 font-semibold text-white w-24
                                            ${staffs.status === 1 ? "bg-blue-800" :
                                                            staffs.status === 2 ? "bg-yellow-600" :
                                                                staffs.status === 3 ? "bg-gray-600" :
                                                                    staffs.status === 4 ? "bg-purple-600" :
                                                                        staffs.status === 5 ? "bg-red-800" : ""}
                                        `}
                                                >
                                                    {staffs.status === 1 ? "Active" :
                                                        staffs.status === 2 ? "Pending" :
                                                            staffs.status === 3 ? "Suspended" :
                                                                staffs.status === 4 ? "On Leave" :
                                                                    staffs.status === 5 ? "Terminated" : "Unknown"}
                                                </button>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="relative inline-block text-left">
                                                    <Menu>
                                                        <Menu.Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-md">
                                                            Action
                                                        </Menu.Button>
                                                        <Menu.Items className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md">
                                                            <Menu.Item as="button" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item onClick={() => handleDelete(staffs.id)} as="button" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                                                Delete
                                                            </Menu.Item>
                                                            <Menu.Item onClick={() => toggleModal(staffs.id)} as="button" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                                                View
                                                            </Menu.Item>
                                                            <Menu.Item onClick={() => toggleBankModal(staffs.id)} as="button" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                                                Add Family
                                                            </Menu.Item>
                                                            <Menu.Item onClick={() => toggleLeaveModal(staffs.id)} as="button" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                                                Add Medical
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
                        </div>
                    </div>
                </div>
            </div>



            {/* Modal */}
            {isModalOpen && selectedStaff && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-center justify-center overflow-y-auto z-50" 
                initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-4"
                    initial={{ scale: 0.5 }} // Start at 50%
                    animate={{ scale: 1 }} // Scale to 100%
                    exit={{ scale: 0.5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth animation
                    >


                        {/* Right section */}
                        <div className="w- p-4  border shadow-md">
                            <h2 className="font-bold sm:text-xl rounded-full p-2 bg-green-800 text-white"><FontAwesomeIcon icon={faUserCircle} /> Personal Information</h2>
                            <img src="../image/54.png" className="rounded-full items-center w-40 lg:ml-40 ml-24 border-white-700 shadow-xl border-8" />
                            <button
                                onClick={() => toggleStatusModal(selectedStaff.id)}
                                className={`
            p-1 font-semibold text-white w-24 mt-5
            ${selectedStaff.status === 1 ? "bg-blue-800" :
                                        selectedStaff.status === 2 ? "bg-yellow-600" :
                                            selectedStaff.status === 3 ? "bg-gray-600" :
                                                selectedStaff.status === 4 ? "bg-purple-600" :
                                                    selectedStaff.status === 5 ? "bg-red-800" : ""}
        `}
                            >
                                {selectedStaff.status === 1 ? "Active" :
                                    selectedStaff.status === 2 ? "Pending" :
                                        selectedStaff.status === 3 ? "Suspended" :
                                            selectedStaff.status === 4 ? "On Leave" :
                                                selectedStaff.status === 5 ? "Terminated" : "Unknown"}
                            </button>

                            <div className=" mt-10">
                                <h2 className="font-bold sm:text-2xl  bg-gray-500 text-white rounded-sm"><FontAwesomeIcon icon={faUserCircle} /> {selectedStaff.first_name} {selectedStaff.last_name}</h2>
                                <h2 className="font-semibold">{selectedStaff.role} ({selectedStaff.language}) Branch</h2>
                            </div>
                            <Link to={`/editp/${selectedStaff.id}`}>
                                <button

                                    className="bg-blue-600 text-white hover:bg-blue-700 text-sm lg:ml-60 font-semibold p-2 w-20"
                                >
                                    <FontAwesomeIcon icon={faPen} /> Edit
                                </button>
                            </Link>
                            <div className="grid lg:grid-cols-2 grid-cols-2 gap-3 mt-7 justify-start">
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
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faLanguage} /> Office</h2>
                                <h2 className="text-left">{selectedStaff.language}</h2>
                                <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faCalendarAlt} /> Date of Birth</h2>
                                <h2 className="text-left">{formatDate(selectedStaff.dob)}</h2>
                            </div>

                        </div>

                        {/* Left section */}
                        <div className="w-full p-4  border shadow-md">
                            <h2 className="font-bold sm:text-xl rounded-full p-2 bg-blue-800 text-white"> <FontAwesomeIcon icon={faBank} /> Family Information</h2>
                            <hr className='mt-6 mx-8 mb-4' />
                            <div className="">
                                <Link to={`/editparent/${selectedStaff.id}`}>
                                    <button

                                        className="bg-blue-600 text-white hover:bg-blue-700 text-sm lg:ml-60 font-semibold p-2 w-20"
                                    >
                                        <FontAwesomeIcon icon={faPen} /> Edit
                                    </button>
                                </Link>

                                <div className="mb-4 grid lg:grid-cols-2 grid-cols-2 gap-3 mt-7 justify-start">




                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faUser} />Full Name</h2>
                                    <h2 className="text-left">{selectedStaff.parent_name}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faMapLocation} /> Address</h2>
                                    <h2 className="text-left">{selectedStaff.parent_address}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faEnvelope} /> Email Address</h2>
                                    <h2 className="text-left">{selectedStaff.parent_email}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPhoneAlt} /> Phone Number</h2>
                                    <h2 className="text-left">{selectedStaff.parent_number}</h2>







                                </div>
                                <hr />

                                <h2 className="font-bold sm:text-xl  mt-6 rounded-full p-2 bg-blue-800 text-white"> <FontAwesomeIcon icon={faBank} /> Extended Family Information</h2>
                                <Link to={`/editextended/${selectedStaff.id}`}>
                                    <button
                                        className="bg-blue-600 mt-4 text-white hover:bg-blue-700 text-sm lg:ml-60 font-semibold p-2 w-20"
                                    >
                                        <FontAwesomeIcon icon={faPen} /> Edit
                                    </button>
                                </Link>
                                <div className="mb-4 grid lg:grid-cols-2 grid-cols-2 gap-3 mt-7 justify-start">
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faUser} />Full Name</h2>
                                    <h2 className="text-left">{selectedStaff.extended_name}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faMapLocation} /> Address</h2>
                                    <h2 className="text-left">{selectedStaff.extended_address}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faEnvelope} /> Email Address</h2>
                                    <h2 className="text-left">{selectedStaff.extended_email}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPhoneAlt} /> Phone Number</h2>
                                    <h2 className="text-left">{selectedStaff.extended_number}</h2>

                                </div>

                                <hr />
                                <h2 className="font-bold sm:text-xl mt-6 rounded-full p-2 bg-blue-800 text-white"> <FontAwesomeIcon icon={faBank} /> Friend / Neighbours Information</h2>
                                <Link to={`/editfriend/${selectedStaff.id}`}>
                                    <button
                                        className="bg-blue-600 mt-4 text-white hover:bg-blue-700 text-sm lg:ml-60 font-semibold p-2 w-20"
                                    >
                                        <FontAwesomeIcon icon={faPen} /> Edit
                                    </button>
                                </Link>
                                <div className="mb-4 grid lg:grid-cols-2 grid-cols-2 gap-3 mt-7 justify-start">
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faUser} />Full Name</h2>
                                    <h2 className="text-left">{selectedStaff.friend_name}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faMapLocation} /> Address</h2>
                                    <h2 className="text-left">{selectedStaff.friend_address}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faEnvelope} /> Email Address</h2>
                                    <h2 className="text-left">{selectedStaff.friend_email}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPhoneAlt} /> Phone Number</h2>
                                    <h2 className="text-left">{selectedStaff.friend_number}</h2>

                                </div>


                                <p className=""></p>
                            </div>
                        </div>
                        {/* contract section */}
                        <div className="w-full p-4  border shadow-md">
                            <h2 className="font-bold sm:text-xl mt-6 rounded-full p-2 bg-blue-800 text-white"> <FontAwesomeIcon icon={faBank} /> Bank Information</h2>
                            <hr />
                            <div className="">
                                <Link to={`/editbank/${selectedStaff.id}`}>
                                    <button
                                        className="bg-blue-600 mt-4 text-white hover:bg-blue-700 text-sm lg:ml-60 font-semibold p-2 w-20"
                                    >
                                        <FontAwesomeIcon icon={faPen} /> Edit
                                    </button>
                                </Link>

                                <div className="mb-4 grid lg:grid-cols-2 grid-cols-2 gap-3 mt-7 justify-start">




                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faBank} />Bank Name</h2>
                                    <h2 className="text-left">{selectedStaff.bank_name}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faUser} /> Beneficiary</h2>
                                    <h2 className="text-left">{selectedStaff.beneficiary}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faList} /> Account Number</h2>
                                    <h2 className="text-left">{selectedStaff.acc_number}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faList} /> BVN</h2>
                                    <h2 className="text-left">{selectedStaff.bvn}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faShieldAlt} /> NIN</h2>
                                    <h2 className="text-left">{selectedStaff.nin_number}</h2>


                                </div>






                                <p className=""></p>
                            </div>
                        </div>
                        <div className="w-full p-4  border shadow-md">
                            <h2 className="font-bold sm:text-xl rounded-full p-2 mt-6 bg-blue-800 text-white"> <FontAwesomeIcon icon={faBank} /> Medical Information</h2>
                            <hr />
                            <div className="">
                                <button
                                    className="bg-blue-600 mt-4 text-white hover:bg-blue-700 text-sm lg:ml-60 font-semibold p-2 w-20"
                                >
                                    <FontAwesomeIcon icon={faPen} /> Edit
                                </button>

                                <div className="mb-4 grid lg:grid-cols-2 grid-cols-2 gap-3 mt-7 justify-start">



                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faUser} />Full Name</h2>
                                    <h2 className="text-left">{selectedStaff.medical_name}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faMapLocation} /> Address</h2>
                                    <h2 className="text-left">{selectedStaff.medical_address}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faEnvelope} /> Email Address</h2>
                                    <h2 className="text-left">{selectedStaff.medical_email}</h2>
                                    <h2 className="font-bold sm:text-lg text-left"> <FontAwesomeIcon icon={faPhoneAlt} /> Phone Number</h2>
                                    <h2 className="text-left">{selectedStaff.medical_number}</h2>


                                </div>






                                <p className=""></p>
                            </div>
                        </div>




                        <button
                            onClick={toggleModal}
                            className="mt-4 w-full bg-red-700 text-white p-2 rounded hover:bg-red-900 transition"
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
                                    <label className="block mb-2 font-semibold">Date of Birth</label>

                                    <input
                                        type="date"
                                        placeholder="Date of birth"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.dob}
                                        onChange={(e) => handleInputChange("dob", e.target.value)}
                                        required
                                    />
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
                                    <label className="block mb-2 font-semibold">NIN Number</label>

                                    <input
                                        type="text"
                                        placeholder="NIN"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.nin_number}
                                        onChange={(e) => handleInputChange("nin_number", e.target.value)}
                                        required
                                    />
                                </div>

                                
                                <div>
                                    <label className="block mb-2 font-semibold">Office Location</label>

                                    <select
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.language}
                                        onChange={(e) => handleInputChange("language", e.target.value)}
                                        required>

                                        <option value="" key="">Select office location</option>
                                        <option value="Lekki" key="">Lekki</option>
                                        <option value="VGC" key="">VGC</option>
                                        <option value="Surulere" key="">Surulere</option>
                                    </select>
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
                                            <option value="Pedicurist" key="">Pedicurist</option>
                                            <option value="Stylist" key="">Stylist</option>
                                            <option value="Cashier" key="">Cashier</option>
                                            <option value="Nail technician" key="">Nail technician</option>
                                            <option value="Logtrician" key="">Logtrician</option>
                                    </select>
                                </div>

                            </div>
                            <hr />
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
                                <button onClick={() => toggleModal(false)}>burron</button>
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



            {/* Leave Details  Modal */}
            {isLeaveModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-md">
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
                        <form className="" onSubmit={handleSubmitUpdateMedical}>
                            <hr className='mt-10 mx-8 mb-4' />
                            <h2 className="font-bold sm:text-lg mb-4">Medical Informations</h2>
                            <hr className='mt-4 mx-8 mb-4' />
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.medical_name}
                                        onChange={(e) => handleInputChange("medical_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.medical_address}
                                        onChange={(e) => handleInputChange("friend_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.medical_number}
                                        onChange={(e) => handleInputChange("medical_number", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold"> Email</label>

                                    <input
                                        type="text"
                                        placeholder=" Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.medical_email}
                                        onChange={(e) => handleInputChange("medical_email", e.target.value)}
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
                            onClick={toggleLeaveModal}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            {/* Update Parent form  Modal */}
            {isParentModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-md">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleparentModal}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Staff Data</h3>
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmitUpdateParent}>
                            <hr className='mt-10 mx-8 mb-4' />
                            <h2 className="font-bold sm:text-lg mb-4">Medical Informations</h2>
                            <hr className='mt-4 mx-8 mb-4' />
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_name}
                                        onChange={handleUpdateChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.parent_address}
                                        onChange={(e) => handleInputChange("parent_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.parent_number}
                                        onChange={(e) => handleInputChange("parent_number", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold"> Email</label>

                                    <input
                                        type="text"
                                        placeholder=" Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={selectedStaff.parent_email}
                                        onChange={(e) => handleInputChange("parent_email", e.target.value)}
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
                            onClick={toggleparentModal}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            {/* Bank Details  Modal */}
            {isBankModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-3xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleBankModal}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add Staff Family Menbers</h3>
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
                                    <label className="block mb-2 font-semibold">Parent/Guadian Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Parent full name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_name}
                                        onChange={(e) => handleInputChange("parent_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_address}
                                        onChange={(e) => handleInputChange("parent_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_number}
                                        onChange={(e) => handleInputChange("parent_number", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Parent Email</label>

                                    <input
                                        type="text"
                                        placeholder="Parent Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.parent_email}
                                        onChange={(e) => handleInputChange("parent_email", e.target.value)}
                                        required
                                    />
                                </div>

                            </div>

                            <hr className='mt-10 mx-8 mb-4' />
                            <h2 className="font-bold sm:text-lg mb-4">Extended Family Informations</h2>
                            <hr className='mt-4 mx-8 mb-4' />
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_name}
                                        onChange={(e) => handleInputChange("extended_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_address}
                                        onChange={(e) => handleInputChange("extended_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_number}
                                        onChange={(e) => handleInputChange("extended_number", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold"> Email</label>

                                    <input
                                        type="text"
                                        placeholder=" Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.extended_email}
                                        onChange={(e) => handleInputChange("extended_email", e.target.value)}
                                        required
                                    />
                                </div>

                            </div>
                            <hr className='mt-10 mx-8 mb-4' />
                            <h2 className="font-bold sm:text-lg mb-4">Frends and Neighbours Informations</h2>
                            <hr className='mt-4 mx-8 mb-4' />
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Full Name</label>

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_name}
                                        onChange={(e) => handleInputChange("friend_name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Address</label>

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_address}
                                        onChange={(e) => handleInputChange("friend_address", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">Phone Number</label>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_number}
                                        onChange={(e) => handleInputChange("friend_number", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold"> Email</label>

                                    <input
                                        type="text"
                                        placeholder=" Email"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.friend_email}
                                        onChange={(e) => handleInputChange("friend_email", e.target.value)}
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



            {/* Personal Information  Modal */}
            {isPersonalModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-4xl">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={togglepersonalModal}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Add More Staff Data</h3>
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
                                    <label className="block mb-2 font-semibold">Date of Birth</label>

                                    <input
                                        type="date"
                                        placeholder="Date of birth"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.dob}
                                        onChange={(e) => handleInputChange("dob", e.target.value)}
                                        required
                                    />
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
                                    <label className="block mb-2 font-semibold">NIN Number</label>

                                    <input
                                        type="text"
                                        placeholder="NIN"
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.nin_number}
                                        onChange={(e) => handleInputChange("nin_number", e.target.value)}
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

                            <button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold p-3 w-40"
                            >
                                <FontAwesomeIcon icon={faPlusCircle} /> Add
                            </button>
                        </form>

                        <button
                            onClick={togglepersonalModal}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            {/* Update Status  Modal */}
            {isStatusModalOpense && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-end overflow-y-auto justify-end z-50">
                    <div className="bg-white shadow-lg p-6 w-full max-w-md">
                        <button className=" bg-red-800 text-white w-10 p-1" onClick={toggleStatusModal}><FontAwesomeIcon icon={faTimes} /></button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Update Status</h3>
                        {submissionStatus && (
                            <div
                                className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {submissionStatus.message}
                            </div>
                        )}
                        <form className="" onSubmit={handleSubmitUpdateStatus}>
                            <hr className='mt-10 mx-8 mb-4' />
                            <h2 className="font-bold sm:text-lg mb-4">Status Informations</h2>
                            <hr className='mt-4 mx-8 mb-4' />
                            <div className="grid lg:grid-cols-2 gap-4 mb-4 items-center">

                                <div>
                                    <label className="block mb-2 font-semibold">Status</label>
                                    <select
                                        name='status'
                                        className="block w-full border border-gray-300 p-2"
                                        value={formData.status}
                                        onChange={handleUpdateChange}
                                    >
                                        <option value="" key="">Select</option>
                                        <option value="1" key="">Active</option>
                                        <option value="2" key="">Pending</option>
                                        <option value="3" key="">Suspended</option>
                                        <option value="4" key="">On Leave</option>
                                        <option value="5" key="">Terminated</option>

                                    </select>
                                    <input


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
                            onClick={toggleStatusModal}
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


export default Datas;
