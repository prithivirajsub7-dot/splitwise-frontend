import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddMembers = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const group = state?.group;

  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // 🔹 Fetch all users (for dropdown)
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  // 🔹 Fetch group members
  useEffect(() => {
    if (!group) return;

    fetch(`http://localhost:3000/group-members/${group.id}`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  }, [group]);
const handleAddMember = async () => {
  if (!selectedUser) {
    alert("Select a member");
    return;
  }

  const selectedUserId = Number(selectedUser); // 👈 convert once

  // prevent duplicate
  const alreadyAdded = members.find(m => m.id === selectedUserId);
  if (alreadyAdded) {
    alert("Member already added");
    return;
  }

  try {
    await fetch("http://localhost:3000/group-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group_id: group.id,
        user_id: selectedUserId,
      }),
    });

    const user = users.find(u => u.id === selectedUserId);

    setMembers([
      ...members,
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    ]);

    setSelectedUser("");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">

        <h2 className="text-2xl font-bold text-purple-600 mb-1">
          {group.group_name}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {group.group_type} Group • Add Members
        </p>

        {/* ➕ Select Member */}
        <div className="flex gap-2 mb-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Member</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button
            onClick={handleAddMember}
            className="bg-green-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* 👥 Members Table */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Group Members</h3>

          {members.length === 0 ? (
            <p className="text-sm text-gray-500">No members added</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td className="border p-2">{member.name}</td>
                    <td className="border p-2">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-300 py-2 rounded"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
};

export default AddMembers;
