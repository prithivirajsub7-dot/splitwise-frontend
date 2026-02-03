import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRupeeSign, FaUser, FaFileAlt, FaArrowLeft } from "react-icons/fa";

const AddExpense = () => {
  const { state } = useLocation();
  const group = state?.group;
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [splitMembers, setSplitMembers] = useState([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIX HERE: include paidBy in splitMembers
  useEffect(() => {
    if (members.length > 0) {
      setSplitMembers(members.map(m => m.id)); // include all members, including payer
    }
  }, [members]);

  useEffect(() => {
    if (!group) return;

    fetch(`http://localhost:3000/groups/${group.id}/members`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  }, [group]);

  const handleSubmit = async () => {
    if (!paidBy || !amount || !desc) {
      alert("Please fill all fields");
      return;
    }

    if (splitMembers.length === 0) {
      alert("At least one member must be selected for split");
      return;
    }

    try {
      setLoading(true);

      await fetch(`http://localhost:3000/groups/${group.id}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paid_by: paidBy,
          amount,
          description: desc,
          members: splitMembers, // 👈 send all members including payer
        }),
      });

      alert("Expense added successfully 💸");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (memberId) => {
    setSplitMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-black"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold text-purple-600">
            {group.group_name}
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Add a new expense to this group
        </p>

        {/* Paid By */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Paid By
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Members */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Split Between
          </label>
          <div className="border rounded p-3 max-h-40 overflow-y-auto">
            {members.map(m => (
              <label
                key={m.id}
                className="flex items-center gap-2 mb-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={splitMembers.includes(m.id)}
                  onChange={() => handleCheckboxChange(m.id)}
                  className="accent-purple-600"
                />
                {m.name}
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select only members who shared this expense
          </p>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Amount
          </label>
          <div className="relative">
            <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <div className="relative">
            <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              placeholder="Eg: Dinner, Travel, Snacks"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </div>
  );
};

export default AddExpense;
