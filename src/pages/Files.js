import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/Adminsidebar";
import axios from "axios";
import Navmenu from "../components/Navmenu";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@headlessui/react"; // Example dropdown library
import moment from "moment";

const Files = () => {
     const formatDate = (timestamp) => {
    return moment(timestamp).format("MMMM DD, YYYY hh:mm A");
  };
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { id } = useParams();
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [staffData, setStaffData] = useState({});
    const [fileData, setFileData] = useState({ staff_name: "",file: null, file_name: ""  });
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staff, setStaff] = useState([]);
    const [leaves, setLeave] = useState([]);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10; // Adjust if needed
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("files");
        return savedData
            ? JSON.parse(savedData)
            : {
                staff_name: "",
                files: [],
                file_name: "",


            };
    });

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    useEffect(() => {
        localStorage.setItem("files", JSON.stringify(formData));
    }, [formData]);
    // Fetch staff details
    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/staff`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStaffData(response.data);
            } catch (error) {
                console.error("Error fetching staff details:", error);
            }
        };

        fetchStaffData();
    }, [id, BASE_URL]);

    // Fetch uploaded files
    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUploadedFiles = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/filess`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUploadedFiles(response.data.files);
            } catch (error) {
                console.error("Error fetching uploaded files:", error);
            }
        };

        fetchUploadedFiles();
    }, [id, BASE_URL]);

    // Handle input change for text fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFileData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file change
    const handleFileChange = (files) => {
        setFormData((prevData) => ({
          ...prevData,
          files: Array.from(files), // Convert FileList to Array
        }));
      };




      const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
    
        try {
            // Create FormData object
            const formData = new FormData();
            const fileInput = document.getElementById("fileInput");
            const staffName = document.getElementById("staff_name").value;
            const fileName = document.getElementById("file_name").value;
    
            // Ensure file input exists and has files
            if (fileInput && fileInput.files.length > 0) {
                Array.from(fileInput.files).forEach((file) => {
                    formData.append("files", file); // Ensure key matches backend expectation
                });
            } else {
                console.error("No file selected");
            }
    
            // Append additional data
            formData.append("staff_name", staffName);
            formData.append("file_name", fileName);
    
            // Debugging: Check what is being sent
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
    
            const response = await axios.post(
                `${BASE_URL}api/v1/files`, // Ensure correct API URL
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                    transformRequest: (data) => data, // Ensure FormData is properly handled
                }
            );
    
            setSubmissionStatus({ success: true, message: response.data.message });
            localStorage.removeItem("formData");
    
        } catch (error) {
            console.error("Upload error:", error.response?.data || error);
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
                const response = await axios.get(`${BASE_URL}api/v1/files`, {
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
                <AdminSidebar />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Navmenu />
                    <div className="bg-white shadow-lg p-6 mt-6 mb-6 w-full max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4 text-center">Upload Staff File</h3>
                        <button onClick={toggleModal} className="bg-blue-600 rounded-xl p-2 ml-8 mt-2 items-end justify-end text-white w-40"><FontAwesomeIcon icon={faPlusCircle} /> Add new</button>
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
                                    <th className="border px-4 py-2 text-left">Staff Name</th>
                                    <th className="border px-4 py-2 text-left">Documents</th>
                                    <th className="border px-4 py-2 text-left">Doc Name</th>
                                    <th className="border px-4 py-2 text-left">Date/Time</th>
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
                                        <td className="border px-4 py-2"><a href={ `${BASE_URL}${leave.files} `} target="_blank" rel="noopener noreferrer" className="text-red-600 text-3xl"><FontAwesomeIcon icon={faFilePdf}/></a></td>
                                        <td className="border px-4 py-2">{leave.file_name}</td>
                                        <td className="border px-4 py-2">{formatDate(leave.createdAt)}</td>
                                       
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
            </div>



            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 fle items-center justify-center overflow-y-auto z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl mx-auto grid lg:grid-cols-1 gap-4 ">


                    {submissionStatus && (
                            <div className={`mt-6 p-4 rounded ${submissionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {submissionStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block mb-2 font-semibold">Staff Name</label>
                                    <select
                                     name="staff_name"
                                     id="staff_name"
                                     placeholder="Enter staff name"
                                     className="block w-full border border-gray-300 p-2"
                                     value={fileData.staff_name}
                                     onChange={handleInputChange}
                                     required
                                    >
                                        <option value="" key="">Select</option>
                                
                                        {staff.map((staf)=>(
                                        <option value={`${staf.first_name} ${staf.last_name}`}  key={staf.id}>{`${staf.first_name} ${staf.last_name}`}</option>
                                    ))}

                                    </select>
                                   
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold">Upload File</label>
                                    <input
                                        type="file"
                                        name="files"
                                        id="fileInput"
                                        className="block w-full border border-gray-300 p-2"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">File Name</label>
                                    <input
                                        type="text"
                                        name="file_name"
                                        id="file_name"
                                        placeholder="Enter file name"
                                        className="block w-full border border-gray-300 p-2"
                                        value={fileData.file_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold p-3 w-40">
                                <FontAwesomeIcon icon={faPlusCircle} /> Upload
                            </button>
                        </form>

                        <button
                            onClick={toggleModal}
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>



                </div>

            )}

        </div>
    );
};

export default Files;

