import React, { useState } from "react";
import QRCode from "react-qr-code";
import { SketchPicker } from "react-color";
import AdminSidebar from '../components/Adminsidebar';
import Navmenu from '../components/Navmenu';

const QRCodeGenerator = () => {
    const [url, setUrl] = useState("");
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(200);
    const [logo, setLogo] = useState(null);

    const MAIN_URL = process.env.REACT_APP_MAIN_URL;

    const handleDownload = () => {
        const canvas = document.querySelector("canvas");
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "qrcode.png";
        link.click();
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogo(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div className="flex h-screen bg-gray-100">
                <div className="">
                    <AdminSidebar />
                </div>
                <div className="fle shadow-xl flex-col flex-1 overflow-y-auto">
                    <Navmenu />

                    <div className="flex flex-col bg-white items-start p-6  min-h-screen">
                        <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
                        <select
                        className="border p-2 w-80 mb-4"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        >
                            <option value="" key="">Select link</option>
                            <option value={`${MAIN_URL}start`}  key="">Staff form</option>
                            <option value={`${MAIN_URL}customer-form`}  key="">Customer form</option>
                            <option value={`${MAIN_URL}leave-form`}  key="">Leave form</option>
                        </select>
                        
                        <div className="mb-4">
                            <SketchPicker color={color} onChange={(c) => setColor(c.hex)} />
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="400"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="mb-4"
                        />
                        <input type="file" onChange={handleLogoUpload} className="mb-4" />
                        <div className="relative bg-white p-4 shadow-lg">
                            <QRCode value={url} size={size} fgColor={color} includeMargin={true} />
                            {logo && (
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ width: size * 0.2, height: size * 0.2 }}
                                />
                            )}
                        </div>
                        <button
                            onClick={handleDownload}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Download QR Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
