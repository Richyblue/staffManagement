import React, { useEffect, useState, useRef } from "react";
import Adminsidebar from '../components/Adminsidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from "axios";

function Home() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
const [totalStaff, setTotalStaff] = useState(null);
    const [totalSuspended, setTotalSuspended] = useState(null);
     const [totalLeave, setTotalLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
      const barRef = useRef(null);
  const pieRef = useRef(null);


    useEffect(() => {
    const token = localStorage.getItem("token"); // get token from localStorage

    axios
      .get(`${BASE_URL}api/v1/staffcount`, {
        headers: {
          Authorization: `Bearer ${token}`, // attach token
        },
      })
      .then((res) => {
        setTotalStaff(res.data.total); // matches { total: totalCount }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

    useEffect(() => {
    const token = localStorage.getItem("token"); // get token from localStorage

    axios
      .get(`${BASE_URL}api/v1/staffsuspendedcount`, {
        headers: {
          Authorization: `Bearer ${token}`, // attach token
        },
      })
      .then((res) => {
        setTotalSuspended(res.data.suspendedCount); // matches { total: totalCount }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

    useEffect(() => {
    const token = localStorage.getItem("token"); // get token from localStorage

    axios
      .get(`${BASE_URL}api/v1/Leavecount`, {
        headers: {
          Authorization: `Bearer ${token}`, // attach token
        },
      })
      .then((res) => {
        setTotalLeave(res.data.leaveCount); // matches { total: totalCount }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);


    useEffect(() => {
    axios.get(`${BASE_URL}api/v1/staffchart`)
      .then((res) => {
        const data = res.data;
        if (!window.Chart) return; // Make sure Chart.js is loaded

        // Destroy old charts if they exist (to prevent duplicates)
        if (barRef.current.chart) barRef.current.chart.destroy();
        if (pieRef.current.chart) pieRef.current.chart.destroy();

        // Bar Chart - Staff by Department
        barRef.current.chart = new window.Chart(barRef.current, {
          type: "bar",
          data: {
            labels: data.byDepartment.map((d) => d.language),
            datasets: [
              {
                label: "Staff Count",
                data: data.byDepartment.map((d) => d.count),
                backgroundColor: "#36a2eb",
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Staff by Department" },
            },
          },
        });

        // Pie Chart - Staff by Gender
        pieRef.current.chart = new window.Chart(pieRef.current, {
          type: "pie",
          data: {
            labels: data.byGender.map((g) => g.gender),
            datasets: [
              {
                data: data.byGender.map((g) => g.count),
                backgroundColor: ["#ff6384", "#36a2eb"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: "Staff by Gender" },
            },
          },
        });
      })
      .catch((err) => {
        console.error("Failed to load staff stats:", err);
      });
  }, []);

        return (
            <div>
                <div className="flex h-screen ">
                    <div className="">
                        <Adminsidebar />
                    </div>
                    {/* <!-- Main content --> */}
                    <div className="flex flex-col flex-1 overflow-y-auto">
                       
                        <div className="p-4">
                            <h1 className="text-2xl font-bold text-black">Welcome to my dashboard!</h1>
                            <p className="mt-2 text-gray-700">ThisStaff Management System Developed for Kays Place Barber Shop .</p>
                        </div>
                        <div className="grid lg:grid-cols-4 gap-4 p-3">
                        <button
                            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 shadow-lg rounded hover:bg-gray-400 transition"
                        >
                           <h2 className="font-bold sm:text-lg p-3">0</h2>
                           <FontAwesomeIcon icon={faRefresh}/>  Terminated Staff
                        </button>
                        <Link to='/alldata'>
                        <button
                            className="mt-4 w-full bg-blue-200 text-gray-700 p-2 shadow-lg rounded hover:bg-gray-400 transition"
                        >
                            <h2 className="font-bold sm:text-lg p-3">{totalStaff ?? 0}</h2>
                           <FontAwesomeIcon icon={faUserFriends}/> Total Staff
                        </button>
                        </Link>
                        <button
                            className="mt-4 w-full bg-yellow-200 text-gray-700 shadow-lg p-2 rounded hover:bg-gray-400 transition"
                        >
                            <h2 className="font-bold sm:text-lg p-3">{totalSuspended ?? 0}</h2>
                            <FontAwesomeIcon icon={faRefresh}/>  Suspended Staff
                        </button>
                        <Link to='/leave'>
                        <button
                            className="mt-4 w-full bg-red-200 text-gray-700 shadow-lg p-2 rounded hover:bg-gray-400 transition"
                        >
                           <h2 className="font-bold sm:text-lg p-3">{totalLeave ?? 0}</h2>
                           <FontAwesomeIcon icon={faRefresh}/>  Staff on Leave
                        </button>
                        </Link>
                        </div>
                    </div>
                                 <canvas ref={barRef} style={{ maxWidth: "500px", margin: "20px" }}></canvas>
      <canvas ref={pieRef} style={{ maxWidth: "500px", margin: "20px" }}></canvas>
                </div>
            </div>
        );
    
}

export default Home;
