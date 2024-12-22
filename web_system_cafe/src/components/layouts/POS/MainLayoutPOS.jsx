import { Link, Outlet } from "react-router";
import logo from "../../../assets/image/logo.png";
import user from "../../../assets/image/user.jpg";
import { ImList2 } from "react-icons/im";
import { BsShop } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Dropdown, Menu } from "antd";
import { FaChevronDown } from "react-icons/fa";
import { getProfile } from "../../../store/profile";
const MainLayoutPOS = () => {
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);
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
  const users = getProfile();
  const menu = (
    <Menu>
      <Menu.Item>
        <div className="flex items-center cursor-pointer">
          {/* <FaPencilAlt className="mr-2" /> */}
          <p>Logout</p>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-[#f5f5f5]">
      <div className="bg-white">
        {/* header */}
        <header className="w-[98%] mx-auto shadow-sm mb-4">
          <div className="flex  items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-14">
                <img src={logo} alt="logo" className="w-full h-full" />
              </div>
              <div>
                <h1 className="font-battambang text-2xl font-medium">
                  ផ្ទះកាហ្វេ 24/7
                </h1>
                <p className="font-battambang text-[#F06424]">សូមស្វាគមន៍</p>
              </div>
            </div>
            <div className="flex items-center gap-9">
              <div className="flex items-center gap-2 text-[#F06424] font-medium text-lg">
                <BsShop />
                <Link to={"/pos"}>POS</Link>
              </div>
              <div className="flex items-center gap-2">
                <ImList2 />
                <Link
                  to={"/product_detail"}
                  className="font-battambang text-lg font-medium"
                >
                  ផ្ទាំផលិតផល
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-lg">{currentTime}</p>
              <div className="flex items-center mx-2 relative">
                <div className="w-11">
                  <img src={user} alt="user" className="w-full rounded-full" />
                </div>
                <div className="absolute top-8 left-6 bg-[#F06424] cursor-pointer rounded-full flex items-center justify-center">
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <FaChevronDown className="h-5 w-5 text-white text-lg p-0.5" />
                  </Dropdown>
                </div>
                <div>
                  <p>role</p>
                  {/* Display user's name if available */}
                  {/* <p>ppp</p> */}
                  {user && <p className="text-sm">{users?.name}</p>}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* contant */}
        <main className="w-[98%] mx-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayoutPOS;
