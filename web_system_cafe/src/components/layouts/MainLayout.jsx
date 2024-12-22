import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { request } from "../../store/Configstore";

import { FaChevronDown } from "react-icons/fa";
import {
  MdHome,
  MdPerson,
  MdShoppingCart,
  MdLock,
  MdAttachMoney,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { BsShop } from "react-icons/bs";
import {
  getProfile,
  removeAcccessToken,
  setProfile,
} from "../../store/profile";
import logo from "../../assets/image/logo.png";
import userPtofile from "../../assets/image/user.jpg";
import { Dropdown, Menu } from "antd";

const items = [
  { key: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: <MdHome /> },
  { key: "/customer", label: "អតិថិជន", icon: <MdPerson /> },
  { key: "/pos", label: "POS", icon: <BsShop /> },
  { key: "/employees", label: "និយោជិត", icon: <MdPerson /> },
  {
    key: "/product_detail",
    label: "ផលិតផល",
    icon: <MdOutlineProductionQuantityLimits />,
  },
  {
    key: "/category",
    label: "ប្រភេទផលិតផល",
    icon: <MdOutlineProductionQuantityLimits />,
  },
  { key: "/order", label: "ការបញ្ជាទិញ", icon: <MdShoppingCart /> },
  { key: "/expense", label: "ការចំណាយ", icon: <MdAttachMoney /> },
  { key: "/account_staff", label: "បុគ្គលិកគណនេយ្យ", icon: <MdPerson /> },
  { key: "/role", label: "តួនាទី", icon: <MdLock /> },
];

const MainLayout = () => {
  const [currentTime, setCurrentTime] = useState("");
  // const [user, setUser] = useState(getProfile());
  const user = getProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const url = location.pathname || "";

  const updateCurrentTime = () => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })
    );
  };

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      const res = await request("logout", "post");

      if (res) {
        removeAcccessToken("");
        setProfile("");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message);
    }
  };
  if (!user) {
    return null;
  }

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        <div className="flex items-center cursor-pointer">
          {/* <FaPencilAlt className="mr-2" /> */}
          <p>Logout</p>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    user && (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white p-3 shadow-sm">
          <ul className="relative">
            {items.map((item) => (
              <li
                key={item.key}
                className={`relative flex items-center ${
                  url === item.key ? "text-[#F06424] bg-[#f0652425]" : ""
                }`}
              >
                {url === item.key && (
                  <div className="w-2 h-full rounded-e-xl bg-[#F06424] absolute left-0 transition-all ease-in-out duration-300"></div>
                )}
                <a
                  href={item.key}
                  className={`py-3.5 pl-5 pr-2 font-battambang flex items-center space-x-2 relative z-10 hover:translate-x-2.5 transition-all ease-in-out duration-300 ${
                    url === item.key
                      ? "text-[#F06424] translate-x-2.5 hover:text-[#F06424]"
                      : ""
                  }`}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <span className="font-khmer_battambang text-lg">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white mx-3 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Logo and title */}
              <div className="flex items-center gap-3">
                <div className="w-28 h-16">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-battambang text-2xl font-medium">
                    ផ្ទះកាហ្វេ 24/7
                  </h1>
                  <p className="font-battambang text-[#F06424]">សូមស្វាគមន៍</p>
                </div>
              </div>
              {/* Date and User Info */}
              <div className="flex items-center space-x-4">
                <p className="text-lg">{currentTime}</p>
                <div className="flex items-center flex-col relative">
                  <img
                    src={userPtofile}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex items-center gap-2">
                    <p>role</p>
                    {/* Display user's name if available */}
                    {user && <p className="text-sm">{user?.name}</p>}
                    {/* Dropdown */}
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <FaChevronDown className="h-5 w-5 text-black" />
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    )
  );
};

export default MainLayout;
