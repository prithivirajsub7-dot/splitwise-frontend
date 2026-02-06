import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CreateGroup from "./CreateGroup";
import Groups from "./Groups";
import AddMembers from "./AddMembers"; 
import AddExpense from "./AddExpenses";
import GroupExpenses from "./GroupExpenses";
import ExpenseDetails from "./ExpenseDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/add-members" element={<AddMembers />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/group/:groupId/expenses" element={<GroupExpenses />}/>
        <Route path="/expenses/:expenseId" element={<ExpenseDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
