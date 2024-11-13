import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/contents";
import { IoLocationOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { RxCircleBackslash } from "react-icons/rx";
import "./Search.css";

const Main = () => {
  const [camerasData, setCamerasData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: "Bearer 4ApVMIn5sTxeW7GQ5VWeWiy",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log("API Response:", json);

      if (Array.isArray(json)) {
        setCamerasData(json);
      } else if (json.data && Array.isArray(json.data)) {
        setCamerasData(json.data);
      } else {
        console.error("Unexpected data structure:", json);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const uniqueLocations = [...new Set(camerasData.map((data) => data.location))];

  const filteredData = camerasData.filter((data) => {
    const text = filterText.toLowerCase();
    const matchesText =
      data.name?.toLowerCase().includes(text) ||
      data.location?.toLowerCase().includes(text) ||
      data.recorder?.toLowerCase().includes(text);

    const matchesStatus =
      statusFilter === "all" || data.status === statusFilter;

    const matchesLocation =
      locationFilter === "all" || data.location === locationFilter;

    return matchesText && matchesStatus && matchesLocation;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{margin:"0 40px", backgroundColor:"white", border:"1px solid #ccc", borderRadius:"3px"}}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="search-input"
          placeholder="Search..."
        />
        <FaSearch style={{position:"absolute", right:"53px", top:"6.9rem", color:"gray"}}/>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <IoLocationOutline style={{position:"absolute", left:"6.3rem", top:"13.1rem", zIndex:"10", color:"gray"}}/>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="location-filter"
        >
          <option value="all"> <IoLocationOutline /> Location</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <ul style={{ listStyle: "none", display: "flex", justifyContent: "space-around"}}>
        <li><p style={{position:"relative", right:"2.1rem"}}>NAME</p></li>
        <li><p>HEALTH</p></li>
        <li><p>LOCATION</p></li>
        <li><p>RECORDER</p></li>
        <li><p>TASKS</p></li>
        <li><p>STATUS</p></li>
        <li><p>ACTIONS</p></li>
      </ul>

      <ul style={{ listStyle: "none", padding: 0, color: "grey" }}>
        {currentData.map((data) => (
          <li
            key={data.id}
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "10px 0",
              borderBottom: "1px solid #ccc",
            }}
          >
            <span style={{ flex: 1, textAlign: "center" }}>{data.name}</span>
            <span style={{ flex: 1, textAlign: "center" }}>{data.health.cloud} {data.health.device}</span>
            <span style={{ flex: 1, textAlign: "center" }}>{data.location}</span>
            <span style={{ flex: 1, textAlign: "center" }}>{data.recorder}</span>
            <span style={{ flex: 1, textAlign: "center" }}>{data.tasks} Tasks</span>
            <span style={{ flex: 1, textAlign: "center" }}>{data.status}</span>
            <span style={{ flex: 1, textAlign: "center" }}><RxCircleBackslash /></span>
          </li>
        ))}
      </ul>

      <select
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          className="page-dropdown"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginTop: "10px", marginBottom:"7px", marginRight:"10px"}}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{border:"1px solid rgb(209, 207, 207)", color:"gray", fontWeight:"bold", borderRadius:"2px", padding:"2px", margin:"2px"}}
          >
           Previous
         </button>
         <button
           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
           disabled={currentPage === totalPages}
           style={{border:"1px solid rgb(209, 207, 207)", color:"gray", fontWeight:"bold", borderRadius:"2px", padding:"2px", margin:"2px"}}
         >
          Next
        </button>
       </div>

    </div>
  );
};

export default Main;
