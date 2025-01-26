import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { registerUser } from '../apiService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const toggleRegisterModal = () => {
        setIsRegisterModalOpen(!isRegisterModalOpen);
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await registerUser({ name, email, password, phone });
            setMessage('Registration successful');
            navigate('/log-home'); // Redirect to dashboard
        } catch (error) {
            setMessage(error);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-xl mx-auto p-6 gap-6">
            {/* Left Section */}
            <div className="flex flex-col items-center bg-my-color text-white rounded-xl p-6 lg:w-1/2">
                <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-center">
                    Success starts here
                </h3>
                <ul className="text-lg lg:text-2xl font-semibold space-y-4 list-disc list-inside">
                    <li>Over 700 categories</li>
                    <li>Quality work done faster</li>
                    <li>
                        Access to talent and <br /> businesses across the globe
                    </li>
                </ul>
                <img
                    className="w-full max-w-xs lg:max-w-2xl mt-6 lg:mr-4"
                    src="../images/login.png"
                    alt="Ads"
                />
            </div>

            {/* Right Section */}
            <div className="flex flex-col bg-white shadow-xl rounded-xl p-6 lg:w-1/2">
                <h4 className="text-2xl lg:text-3xl font-bold text-center mb-4">
                    Log in to your account
                </h4>
                <p className="text-center mb-6">
                    Don't have an account yet?{' '}
                    <Link to="/register" className="text-blue-800 font-semibold">
                        Sign up here
                    </Link>
                </p>
                <button className="flex lg:mt-20 items-center justify-center shadow-md rounded-2xl bg-white text-gray-700 text-lg lg:text-xl font-semibold p-3 lg:w-96 mx-auto gap-3 border border-gray-300">
                    <FontAwesomeIcon icon={faGoogle} className="text-blue-500" />
                    Continue with Google
                </button>
                <button className="flex lg:mt-10 mt-10 items-center justify-center shadow-md rounded-2xl bg-white text-gray-700 text-lg lg:text-xl font-semibold p-3 lg:w-96 mx-auto gap-3 border border-gray-300">
                    <FontAwesomeIcon icon={faFacebookSquare} className="text-blue-500" />
                    Continue with Facebook
                </button>
                <button
                    className="flex lg:mb-40 mb-24 lg:mt-10 mt-10 items-center justify-center shadow-md rounded-2xl bg-white text-gray-700 text-lg lg:text-xl font-semibold p-3 lg:w-96 mx-auto gap-3 border border-gray-300"
                    onClick={toggleRegisterModal}
                >
                    Continue with Eazzylyfe
                </button>

                <p className="ml-5">By joining, you agree to the Eazzylyfe Terms of Service and to occasionally receive emails from us. Please read our Privacy Policy to learn how we use your personal data.</p>
            </div>

            {/* Register Modal */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-center">Register</h3>
                        <form onSubmit={handleRegister}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                            >
                                Register
                            </button>{message && <p>{message}</p>}
                        </form>
                        <button
                            onClick={toggleRegisterModal}
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

export default Register;
