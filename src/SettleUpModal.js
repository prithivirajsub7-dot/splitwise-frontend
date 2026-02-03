import React, { useState } from "react";

const SettleUpModal = ({ user, onClose, refresh }) => {
  const myId = Number(localStorage.getItem("user_id"));
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSettle = async () => {
    console.log("🟡 SETTLE CLICKED");
    console.log("➡️ from_user:", myId);
    console.log("➡️ to_user:", user?.user_id);
    console.log("➡️ amount:", amount);

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_user: myId,
          to_user: user.user_id,
          amount: Number(amount)
        })
      });

      const data = await res.json();

      console.log("🟢 SETTLE RESPONSE STATUS:", res.status);
      console.log("🟢 SETTLE RESPONSE DATA:", data);

      if (!res.ok) {
        alert(data.message || "Settle failed");
        return;
      }

      alert("Settlement successful ✅");
      refresh();   // dashboard refresh
      onClose();   // close modal

    } catch (err) {
      console.error("❌ FRONTEND SETTLE ERROR:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-bold mb-4">
          Settle with {user.name}
        </h2>

        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded mb-4"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSettle}
            disabled={loading}
            className="px-4 py-1 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Settling..." : "Settle"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettleUpModal;
