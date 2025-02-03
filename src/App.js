import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import './App.css';
import './index.css';
import Home from './pages/Home';
import Login from './auth/login';
import Datas from './pages/Datas';
import ProtectedRoute from './ProtectedRoute';
import Suspended from './pages/Suspended';
import Inventory from './pages/Inventory';
import Expensis from './pages/Expensis';
import Customer from './pages/Customer';
import Files from './pages/Files';
import Leave from './pages/Leave';
import Editpersonal from './pages/Editpersonal';
import Editfamily from './pages/Editfamily';
import Editextended from './pages/Editextended';
import Editfriend from './pages/Editfriend';
import Editbank from './pages/Editbank';
import QRCodeGenerator from './Qrcode/Qrcode';
import Staff from './Qrcode/Staff';
import Nextstaff from './Qrcode/Nextstaff';
import CustomerForm from './Qrcode/Customer';
import LeaveForm from './Qrcode/Leaveform';
import Staffcongrate from './Qrcode/Staffcongrate';
import CheckEmail from './Qrcode/Startform';
import Editexpenses from './pages/Editexpenses';
import Editinventry from './pages/Editinventry';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
      <Route path='/alldata' element={<ProtectedRoute><Datas /></ProtectedRoute>}/>
      <Route path='/suspended' element={<ProtectedRoute><Suspended /></ProtectedRoute>}/>
      <Route path='/inventory' element={<ProtectedRoute><Inventory /></ProtectedRoute>}/>
      <Route path='/expenses' element={<ProtectedRoute><Expensis /></ProtectedRoute>}/>
      <Route path='/customer' element={<ProtectedRoute><Customer /></ProtectedRoute>}/>
      <Route path='/files' element={<ProtectedRoute><Files /></ProtectedRoute>}/>
      <Route path='/leave' element={<ProtectedRoute><Leave /></ProtectedRoute>}/>
      <Route path='/editp/:id' element={<ProtectedRoute><Editpersonal /></ProtectedRoute>}/>
      <Route path='/editparent/:id' element={<ProtectedRoute><Editfamily /></ProtectedRoute>}/>
      <Route path='/editextended/:id' element={<ProtectedRoute><Editextended /></ProtectedRoute>}/>
      <Route path='/editfriend/:id' element={<ProtectedRoute><Editfriend /></ProtectedRoute>}/>
      <Route path='/editbank/:id' element={<ProtectedRoute><Editbank /></ProtectedRoute>}/>
      <Route path='/qrcode' element={<ProtectedRoute><QRCodeGenerator /></ProtectedRoute>}/>
      <Route path='/staff-form' element={<ProtectedRoute><Staff /></ProtectedRoute>}/>
      <Route path='/staff-form-next/:staffId' element={<ProtectedRoute><Nextstaff /></ProtectedRoute>}/>
      <Route path='/customer-form' element={<ProtectedRoute><CustomerForm /></ProtectedRoute>}/>
      <Route path='/leave-form' element={<ProtectedRoute><LeaveForm /></ProtectedRoute>}/>
      <Route path='/staff-success' element={<ProtectedRoute><Staffcongrate /></ProtectedRoute>}/>
      <Route path='/start' element={<ProtectedRoute><CheckEmail /></ProtectedRoute>}/>
      <Route path='/editexpenses/:id' element={<ProtectedRoute><Editexpenses /></ProtectedRoute>}/>
      <Route path='/editinventory/:id' element={<ProtectedRoute><Editinventry /></ProtectedRoute>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
