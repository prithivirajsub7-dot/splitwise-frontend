import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRupeeSign } from "react-icons/fa";

const ExpenseDetails = () => {
  const { expenseId } = useParams();
  const navigate = useNavigate();

  const [splits, setSplits] = useState([]);
  const [paidBy, setPaidBy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSplits = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/expenses/${expenseId}/splits`
        );
        const data = await res.json();

        if (data.length > 0) {
          setPaidBy(Number(data[0].paid_by)); // 👈 payer
        }

        setSplits(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchSplits();
  }, [expenseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading expense details...
      </div>
    );
  }

  // 🔹 payer object
  const payer = splits.find(s => Number(s.user_id) === paidBy);

  // 🔹 payer gets = sum of others
  const payerGets = splits
    .filter(s => Number(s.user_id) !== paidBy)
    .reduce((sum, s) => sum + Number(s.share_amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="text-gray-500 text-lg" />
          </button>
          <h2 className="text-lg font-bold text-purple-700">
            Expense Details
          </h2>
        </div>

        {/* 💸 OWES CARD */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-red-600 font-bold mb-3 flex items-center gap-1">
            💸 Owes
          </h3>

          {splits.filter(s => Number(s.user_id) !== paidBy).length > 0 ? (
            splits
              .filter(s => Number(s.user_id) !== paidBy)
              .map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-red-50 rounded-xl px-3 py-2 mb-2"
                >
                  <span className="text-sm text-red-700">
                    {s.name}
                  </span>
                  <span className="text-sm font-semibold text-red-700 flex items-center gap-1">
                    <FaRupeeSign />
                    {Number(s.share_amount).toFixed(2)}
                  </span>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center">
              No one owes 🎉
            </p>
          )}
        </div>

        {/* 💰 GETS CARD */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-green-600 font-bold mb-3 flex items-center gap-1">
            💰 Gets
          </h3>

          {payer && payerGets > 0 ? (
            <div className="flex justify-between items-center bg-green-50 rounded-xl px-3 py-3">
              <span className="text-sm text-green-700 font-medium">
                {payer.name}
              </span>
              <span className="text-sm font-bold text-green-700 flex items-center gap-1">
                <FaRupeeSign />
                {payerGets.toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No one gets 💰
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExpenseDetails;
