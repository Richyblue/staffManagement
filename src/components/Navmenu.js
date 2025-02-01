import React, { Component } from 'react';

class Navmenu extends Component {
    render() {
        return (
            <div>
                 <div className="flex items-center justify-between h-16 bg-gray-800 border-b border-white">
                            <div className="flex items-center px-4">
                                <label for="menu-toggle"
                                    className="md:hidden mr-4 bg-white text-white p-2 rounded focus:outline-none cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none"
                                        viewBox="0 0 24 24" stroke="white">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </label>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                {/* <input className="mx-4 w-full border rounded-md px-4 py-2" type="text" placeholder="Search" /> */}
                            </div>
                            <div className="flex items-center pr-4">
                                <button
                                    className="flex items-center text-white hover:text-gray-200 focus:outline-none focus:text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 19l-7-7 7-7m5 14l7-7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
            </div>
        );
    }
}

export default Navmenu;