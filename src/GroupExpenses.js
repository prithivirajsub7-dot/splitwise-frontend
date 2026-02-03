import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRupeeSign, FaUser } from "react-icons/fa";

const ViewExpenses = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesRes = await fetch(
          `http://localhost:3000/groups/${groupId}/expenses`
        );
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);

        const membersRes = await fetch(
          `http://localhost:3000/groups/${groupId}/members`
        );
        const membersData = await membersRes.json();
        setMembers(membersData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading expenses...
      </div>
    );
  }

  const getUserName = (userId) => {
    const user = members.find((m) => m.id === userId);
    return user ? user.name : `User #${userId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="text-gray-500 text-lg" />
          </button>
          <h2 className="text-lg font-bold text-purple-700">
            Group Expenses
          </h2>
        </div>

        {/* EXPENSE LIST */}
        {expenses.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No expenses yet
          </div>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl shadow-md p-4 space-y-3"
            >
              {/* TOP ROW */}
              <div
                onClick={() =>
                  navigate(`/expenses/${exp.id}`, {
                    state: { groupId },
                  })
                }
                className="flex justify-between items-center cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {exp.description}
                  </p>

                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <FaUser /> Paid by {getUserName(exp.paid_by)}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    {new Date(exp.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <FaRupeeSign />
                  {Number(exp.amount).toFixed(2)}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t pt-3"></div>

              {/* SPLITWISE STYLE */}
              <div className="space-y-2">

                {/* OWES */}
                {exp.owes && exp.owes.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-red-600 font-semibold text-sm mb-1">
                      💸 Owes
                    </p>

                    {exp.owes.map((o) => (
                      <div
                        key={o.user_id}
                        className="flex justify-between text-xs text-red-700"
                      >
                        <span>{getUserName(o.user_id)}</span>
                        <span>
                          ₹{Number(o.share_amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* GETS */}
                {exp.gets > 0 && (
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-green-600 font-semibold text-sm mb-1">
                      💰 Gets
                    </p>

                    <div className="flex justify-between text-xs text-green-700">
                      <span>{getUserName(exp.paid_by)}</span>
                      <span>₹{Number(exp.gets).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewExpenses;
