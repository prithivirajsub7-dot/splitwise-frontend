// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaRupeeSign } from "react-icons/fa";

// const GroupSummary = () => {
//   const { groupId } = useParams();
//   const [summary, setSummary] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:3000/groups/${groupId}/summary`)
//       .then(res => res.json())
//       .then(data => setSummary(data));
//   }, [groupId]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow">

//         <h2 className="text-lg font-bold text-purple-600 mb-4">
//           Group Summary
//         </h2>

//         {summary.length === 0 ? (
//           <p className="text-center text-green-600 font-semibold">
//             🎉 You are all settled up
//           </p>
//         ) : (
//           summary.map((s, i) => (
//             <div key={i} className="flex justify-between mb-2">
//               <span>{s.owes} owes {s.gets}</span>
//               <span className="font-bold flex items-center gap-1">
//                 <FaRupeeSign /> {s.amount}
//               </span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default GroupSummary;
