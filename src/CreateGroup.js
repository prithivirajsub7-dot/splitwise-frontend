import React, { useState } from "react";
import { FaPlane, FaHome, FaHeart, FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function CreateGroup() {
  const [selectedType, setSelectedType] = useState(null);
  const [enableTripDates, setEnableTripDates] = useState(false); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();



  const groupTypes = [
    { name: "Trip", icon: <FaPlane size={28} /> },
    { name: "Home", icon: <FaHome size={28} /> },
    { name: "Couple", icon: <FaHeart size={28} /> },
    { name: "Others", icon: <FaEllipsisH size={28} /> },
  ];
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = async () => {
  if (!groupName || !selectedType) {
    alert("Please enter group name and type");
    return;
  }

  const payload = {
    groupName,
    groupType: selectedType,
    startDate: enableTripDates ? startDate : null,
    endDate: enableTripDates ? endDate : null,
  };

  try {
    const res = await fetch("http://localhost:3000/addgroups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Group created successfully 🎉");
      console.log(data.group);
        navigate("/groups");

    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600 text-center">
          Create New Group
        </h2>

        {/* 🔹 Group type boxes */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {groupTypes.map((type) => (
            <div
              key={type.name}
              onClick={() => {
                setSelectedType(type.name);
                if (type.name !== "Trip") {
                  setEnableTripDates(false); // 🔹 reset if not trip
                }
              }}
              className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center
                ${
                  selectedType === type.name
                    ? "border-green-500 bg-green-50"
                    : "hover:border-gray-400"
                }`}
            >
              <div className="text-green-600 mb-2">{type.icon}</div>
              <p className="font-semibold">{type.name}</p>
            </div>
          ))}
        </div>

        {/* 🔹 Trip toggle */}
        {selectedType === "Trip" && (
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="font-medium">Add Trip Dates</span>
              <input
                type="checkbox"
                checked={enableTripDates}
                onChange={() => setEnableTripDates(!enableTripDates)}
                className="w-5 h-5"
              />
            </label>
          </div>
        )}

        {/* 🔹 Trip dates */}
        {selectedType === "Trip" && enableTripDates && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        )}

        {/* 🔹 Group name */}
 <input
  type="text"
  placeholder="Group Name"
  value={groupName}
  onChange={(e) => setGroupName(e.target.value)}
  className="w-full border p-2 rounded mb-4"
/>

        <input
  type="text"
  placeholder="Group Name"
  value={groupName}
  onChange={(e) => setGroupName(e.target.value)}
  className="w-full border p-2 rounded mb-4"
/>


        {/* 🔹 Create button */}
   <button
  onClick={handleCreateGroup}
  className="w-full bg-green-500 text-white py-2 rounded"
>
  Create Group
</button>

      </div>
    </div>
  );
}

export default CreateGroup;
