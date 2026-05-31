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
    title: "Tranzaksiyalar",
  },
  {
    icon: <RiFolderChartLine />,
    path: "/dashboard/categories",
    title: "Kategoriyalar",
  },
  {
    icon: <FaRegChartBar />,
    path: "/dashboard/statistics",
    title: "Statistika",
  },
  {
    icon: <FiUser />,
    path: "/dashboard/profile",
    title: "Profil",
  },
];
