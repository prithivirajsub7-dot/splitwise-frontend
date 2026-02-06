import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHome,
  FaHeart,
  FaEllipsisH,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import Groups from "./Groups";
import DashboardSummary from "./DashboardSummary";

/*  Group Icon Helper */
export const getGroupIcon = (type, size = 22) => {
  switch (type) {
    case "Trip":
      return <FaPlane size={size} className="text-blue-500" />;
    case "Home":
      return <FaHome size={size} className="text-green-500" />;
    case "Couple":
      return <FaHeart size={size} className="text-pink-500" />;
    default:
      return <FaEllipsisH size={size} className="text-gray-500" />;
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  /*  Login check */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  /*  Fetch groups */
  useEffect(() => {
    fetch("http://localhost:3000/allgroups")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /*  Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /*  Create group */
  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  /*  Add expense */
  const handleAddExpense = () => {
    if (groups.length === 0) {
      alert("Create a group first 🙂");
      return;
    }
    navigate("/add-expense", { state: { group: groups[0] } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/*  HEADER */}
        <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">
            Splitwise
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/*  BALANCE SUMMARY (MOST IMPORTANT) */}
        <DashboardSummary />

        {/*  QUICK ACTIONS */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ⚡ Quick Actions
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCreateGroup}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition"
            >
              <FaPlus /> Create Group
            </button>

            <button
              onClick={handleAddExpense}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition"
            >
              <FaPlus /> Add Expense
            </button>
          </div>
        </div>

        {/*  GROUPS LIST */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            👥 Your Groups
          </h2>

          {groups.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No groups yet. Create one to get started 🚀
            </p>
          ) : (
            <Groups groups={groups} />
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
