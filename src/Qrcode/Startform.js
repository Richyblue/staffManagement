import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CheckEmail = () => {
const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [email, setEmail] = useState("");
  const [staffExists, setStaffExists] = useState(false);
  const [friendEmail, setFriendEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [staffId, setStaffId] = useState(null); // Store staff ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    setLoading(true);
    setError("");
    setEmailChecked(false);

    try {
      const response = await axios.post(`${BASE_URL}api/v1/checkMail`, { email });

      if (response.data.exists) {
        setStaffExists(true);
        setFriendEmail(response.data.friend_email);
        setStaffId(response.data.staff_id); // Get staff ID
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmailChecked(true);

        if (response.data.friend_email) {
          navigate("/staff-success");
        }
      } else {
        setStaffExists(false);
        setEmailChecked(true);
      }
    } catch (err) {
      setError("Error checking email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 mx-auto max-w-lg lg:mt-8 mt-4 shadow-md">
        <p className="p-2 font-bold mx-auto mt-4 mb-4">Welcome, Kindly insert your email address to get started</p>
      <h1 className="text-xl font-bold mb-4"> Email Address</h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-80 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleCheckEmail}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Email"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {emailChecked && staffExists && friendEmail === null && (
        <div className="">
            <h2 className="font-bold sm:text-xl mt-4 mb-2 text-green-600">Welcome back {firstName} {lastName}!</h2>
            <p className="">You have an incomplete form, kindly click the button below to continue</p>
        <Link to={`/staff-form-next/${staffId}`}>
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Continue Your Form
        </button>
        </Link>
        </div>
      )}

      {emailChecked && !staffExists && (
        <div>
            <h2 className="font-bold text-lg mx-auto p-2">Important Notice Before Filling This Form</h2>
            <p className="">To ensure a smooth and complete application process, kindly make sure you have the following details readily available before proceeding:
                Parent Information, Extended Family information, Friends/Neighbor,  Bank details, BVN and NIN
            </p>
         <Link to='/staff-form'>
         <button
           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
         >
           Get Started
         </button>
         </Link>
         </div>
      )}

<p className="ml-5">By joining, you agree to the  Terms of Service and to occasionally receive emails from us. Please read our Privacy Policy to learn how we use your personal data.</p>
    </div>
  );
};

export default CheckEmail;
