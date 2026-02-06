import React, { useEffect, useState, useCallback } from "react";
import SettleUpModal from "./SettleUpModal";

const DashboardSummary = () => {
  const userId = Number(localStorage.getItem("user_id"));

  const [youGet, setYouGet] = useState([]);
  const [youOwe, setYouOwe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  //  fetchBalances wrapped in useCallback to satisfy ESLint
  const fetchBalances = useCallback(() => {
    if (!userId) {
      console.warn("❌ user_id missing");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`http://localhost:3000/users/${userId}/balances`)
      .then(res => res.json())
      .then(data => {
        console.log("🔍 BALANCE API:", data);

        const balances = data.balances || [];
        setYouGet(balances.filter(b => Number(b.amount) > 0));
        setYouOwe(balances.filter(b => Number(b.amount) < 0));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  //  useEffect calls fetchBalances when userId changes
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading balances...</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* YOU OWE */}
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold text-red-600 mb-3">
            You Owe 💸
          </h2>

          {youOwe.length === 0 ? (
            <p className="text-gray-500">You owe nothing 🎉</p>
          ) : (
            youOwe.map((b, i) => (
              <div key={i} className="flex justify-between items-center">
                <span>You owe <b>{b.name}</b></span>
                <span className="font-semibold text-red-700">
                  ₹{Math.abs(Number(b.amount)).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* YOU GET */}
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold text-green-600 mb-3">
            You Get 💰
          </h2>

          {youGet.length === 0 ? (
            <p className="text-gray-500">No one owes you</p>
          ) : (
            youGet.map((b, i) => (
              <div key={i} className="flex justify-between items-center">
                <span><b>{b.name}</b> owes you</span>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-700">
                    ₹{Number(b.amount).toFixed(2)}
                  </span>

                  <button
                    onClick={() => setSelectedUser(b)}
                    className="text-sm text-blue-600 underline"
                  >
                    Settle Up
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* SettleUp Modal */}
      {selectedUser && (
        <SettleUpModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={fetchBalances} //  refresh balances after settle
        />
      )}
    </>
  );
};

export default DashboardSummary;
