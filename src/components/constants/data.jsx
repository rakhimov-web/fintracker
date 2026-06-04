import { TbLayoutDashboard } from "react-icons/tb";
import { GoArrowSwitch } from "react-icons/go";
import { RiFolderChartLine } from "react-icons/ri";
import { FaRegChartBar } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

export const links = [
  {
    icon: <TbLayoutDashboard />,
    path: "/dashboard",
    title: "Dashboard",
  },
  {
    icon: <GoArrowSwitch />,
    path: "/dashboard/transaction",
    title: "Transactions",
  },
  {
    icon: <RiFolderChartLine />,
    path: "/dashboard/categories",
    title: "Categories",
  },
  {
    icon: <FaRegChartBar />,
    path: "/dashboard/statistics",
    title: "Statistics",
  },
  {
    icon: <FiUser />,
    path: "/dashboard/profile",
    title: "Profile",
  },
];
