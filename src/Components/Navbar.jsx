import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('https://ims.ksrtc.in/itbt_startup/public/Api/1');
        if (response.status === 200) {
          const data = response.data;
          if (data && data.menu_data && data.menu_data.list) {
            const menuItems = Object.values(data.menu_data.list);
            setMenuItems(menuItems);
          } else {
            console.error("Error: The menu data or list is undefined or null.");
          }
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const handleDropdownClick = (menuId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId],
    }));
  };

  const renderMenuItems = (parentId) => {
    const childItems = menuItems.filter(item => item.parent_id === parentId.toString());

    if (childItems.length === 0) return null;

    return (
      <ul className={parentId === "0" ? "flex space-x-6 text-white" : "absolute bg-white text-blue-600 mt-2 shadow-lg rounded-md"}>
        {childItems.map((item) => (
          <li key={item.menu_id} className={parentId === "0" ? "relative" : "relative hover:bg-blue-100"}>
            <button
              onClick={() => handleDropdownClick(item.menu_id)}
              className={parentId === "0" ? "hover:text-gray-200 focus:outline-none" : "block px-4 py-2 w-full text-left"}
            >
              {item.menu_name}
            </button>
            {openDropdowns[item.menu_id] && renderMenuItems(item.menu_id)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/">MyCompany</Link>
        </div>
        {renderMenuItems("0")}
      </div>
    </nav>
  );
};

export default Navbar;
