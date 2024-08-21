import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { LanguageContext } from "../LanguageContext";

const Navbar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [openParentDropdown, setOpenParentDropdown] = useState(null);
  const [openChildDropdowns, setOpenChildDropdowns] = useState({});
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(
          "https://vyapti.in/public/cms4/public/Api/1"
        );
        if (response.status === 200) {
          const data = response.data;
          if (data && data.menu_data && data.menu_data.list) {
            const menuItems = Object.values(data.menu_data.list);
            menuItems.sort((a, b) => a.sort_order - b.sort_order);
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

  const handleParentDropdownClick = (menuId) => {
    setOpenParentDropdown((prevOpenParentDropdown) =>
      prevOpenParentDropdown === menuId ? null : menuId
    );
    setOpenChildDropdowns({});
  };

  const handleChildDropdownClick = (menuId) => {
    setOpenChildDropdowns((prevOpenChildDropdowns) => ({
      ...prevOpenChildDropdowns,
      [menuId]: !prevOpenChildDropdowns[menuId],
    }));
  };

  const renderMenuItems = (parentId, isHamburgerMenu = false) => {
    let childItems = menuItems
      .filter((item) => item.parent_id === parentId.toString())
      .sort((a, b) => a.sort_order - b.sort_order);

    if (parentId === "0") {
      if (isHamburgerMenu) {
        // Show items that are beyond the first 8 in the hamburger menu
        childItems = childItems.slice(8);
      } else {
        // Limit the top-level items to 8 for the main navbar
        childItems = childItems.slice(0, 8);
      }
    }

    if (childItems.length === 0) return null;

    return (
      <ul
        className={`${
          parentId === "0"
            ? "flex space-x-6 text-white"
            : "absolute left-0 top-full mt-4 bg-white text-blue-600 shadow-xl shadow-slate-400 rounded-md z-10"
        } ${isHamburgerMenu ? "flex-col space-y-2 bg-blue-600 text-white p-2 rounded-md" : ""}`}
      >
        {childItems.map((item) => {
          const hasChildren = menuItems.some(
            (child) => child.parent_id === item.menu_id.toString()
          );
          const isOpen =
            parentId === "0"
              ? openParentDropdown === item.menu_id
              : openChildDropdowns[item.menu_id];
    
          return (
            <li
              key={item.menu_id}
              className={`relative ${isHamburgerMenu ? "pl-2" : ""}`} // Added pl-2 for padding-left
            >
              <Link
                to={`/page/${item.page_id}`}
                onClick={() =>
                  parentId === "0"
                    ? handleParentDropdownClick(item.menu_id)
                    : handleChildDropdownClick(item.menu_id)
                }
                className={
                  parentId === "0"
                    ? "hover:text-gray-200 focus:outline-none flex items-center whitespace-nowrap"
                    : "px-4 py-2 w-full text-left flex items-center"
                }
              >
                {language === "English" ? item.menu_name : item.kn_menu_name || item.menu_name}
                {hasChildren && (
                  <i
                    className={`bi bi-chevron-down ml-2 transition-transform duration-500 ease-in-out ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  ></i>
                )}
              </Link>
              {isOpen && (
                <ul
                  className={`${
                    parentId === "0"
                      ? "flex flex-col space-y-2"
                      : "absolute left-full top-0 mt-2 w-48 bg-white text-blue-600 shadow-xl shadow-slate-400 rounded-md z-10"
                  }`}
                >
                  {renderMenuItems(item.menu_id)}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
    
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md relative">
      <div className="container mx-auto flex justify-evenly items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/">CMS</Link>
        </div>
        <div className="flex items-center">
          {renderMenuItems("0")}
          {menuItems.length > 8 && (
            <div className="relative">
              <button
                onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                className="text-white ml-36 focus:outline-none"
              >
                <i className="bi bi-list text-2xl"></i>
              </button>
              <div
                className={`absolute top-full mt-2 bg-blue-600 text-white shadow-xl shadow-slate-400 rounded-md z-10 w-48 transition-all duration-500 ease-in-out overflow-hidden ${
                  isHamburgerOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{ marginLeft: "-72rem" }} // Adjust the margin to move the menu left
              >
                <ul className="flex flex-col space-y-2 p-2">
                  {renderMenuItems("0", true)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
