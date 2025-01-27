import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import './App.css';
import './index.css';
import Home from './pages/Home';
import Login from './auth/login';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Login />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
