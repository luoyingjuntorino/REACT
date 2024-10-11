import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css"; // 引入我们将要创建的CSS文件

const App = () => {
  return (
    <div>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="content-container">
            <h1>Welcome to the App</h1>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li>
          <Link className="sidebar-link" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="sidebar-link" to="/about">
            About
          </Link>
        </li>
        <li>
          <Link className="sidebar-link" to="/contact">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

const Home = () => <h2>Home Page</h2>;
const About = () => <h2>About Page</h2>;
const Contact = () => <h2>Contact Page</h2>;

export default App;
