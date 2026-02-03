import { useEffect, useState } from "react";
import { FaPlane, FaHome, FaHeart, FaEllipsisH, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Group = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();



  const groupIcons = {
    Trip: <FaPlane className="text-blue-500 text-xl" />,
    Home: <FaHome className="text-green-500 text-xl" />,
    Couple: <FaHeart className="text-pink-500 text-xl" />,
    Others: <FaEllipsisH className="text-gray-500 text-xl" />,
  };

  useEffect(() => {
    fetch("http://localhost:3000/allgroups")
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch((err) => console.error(err));
  }, []);

  //  DELETE GROUP
  const handleDeleteGroup = async (groupId) => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:3000/groups/${groupId}`, {
        method: "DELETE",
      });

      setGroups(groups.filter(g => g.id !== groupId));
      setSelectedGroup(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete group");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Groups</h2>

        {groups.length === 0 ? (
          <p className="text-gray-500">No groups created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                  onClick={() => setSelectedGroup(group)}   
                className="border p-4 rounded hover:shadow transition"
              >
                <div className="flex items-center gap-3">
                  {/* 🔹 Icon */}
                  <div className="p-2 bg-gray-100 rounded-full">
                    {groupIcons[group.group_type]}
                  </div>

                  {/* 🔹 Details */}
                  <div>
                    <h3 className="text-lg font-bold text-purple-600">
                      {group.group_name}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Type: {group.group_type}
                    </p>

                    {group.start_date && (
                      <p className="text-sm text-gray-500">
                        Start:{" "}
                        {new Date(group.start_date).toLocaleDateString()}
                      </p>
                    )}

                    {group.end_date && (
                      <p className="text-sm text-gray-500">
                        End:{" "}
                        {new Date(group.end_date).toLocaleDateString()}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      Created on:{" "}
                      {new Date(group.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 🔥 POPUP */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-sm p-6 relative">

              <button
                onClick={() => setSelectedGroup(null)}
                className="absolute top-2 right-2 text-gray-500 text-xl"
              >
                ✕
              </button>

              <div className="flex justify-center mb-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  {groupIcons[selectedGroup.group_type]}
                </div>
              </div>

              <h3 className="text-xl font-bold text-center text-purple-600">
                {selectedGroup.group_name}
              </h3>

              <p className="text-center text-gray-600 mb-4">
                {selectedGroup.group_type} Group
              </p>

              <button
                onClick={() =>
                  navigate("/add-members", { state: { group: selectedGroup } })
                }
                className="bg-green-500 text-white py-2 rounded w-full mb-3"
              >
                Add Members
              </button>
              <button
  onClick={() =>
    navigate("/add-expense", { state: { group: selectedGroup } })
  }
  className="bg-purple-600 text-white py-2 rounded w-full mb-3"
>
  + Add Expense
</button>
<button
  onClick={() =>
    navigate(`/group/${selectedGroup.id}/expenses`)
  }
  className="bg-blue-500 text-white py-2 rounded w-full mb-3"
>
  View Expenses
</button>



              <button
                onClick={() => handleDeleteGroup(selectedGroup.id)}
                className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded w-full"
              >
                <FaTrash /> Delete Group
              </button>

            </div>
          </div>
        )}
    

      </div>
    </div>
  );
};

export default Group;
