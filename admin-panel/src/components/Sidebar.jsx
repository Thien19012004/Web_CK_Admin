import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ width: "200px", background: "#333", color: "#fff", height: "100vh" }}>
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
          </li>
          <li>
            <Link to="/products" style={{ color: "#fff", textDecoration: "none" }}>Products</Link>
          </li>
          <li>
            <Link to="/users" style={{ color: "#fff", textDecoration: "none" }}>Users</Link>
          </li>
          <li>
            <Link to="/orders" style={{ color: "#fff", textDecoration: "none" }}>Orders</Link>
          </li>
          <li>
            <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
