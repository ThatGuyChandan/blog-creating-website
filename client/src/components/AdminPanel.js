import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || "chandanthakur.k123@gmail.com";

function AdminPanel() {
  const { userInfo } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    if (userInfo && userInfo.email === ADMIN_EMAIL) {
      fetchUsers();
    }
  }, [userInfo]);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, { credentials: "include" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Access denied");
        setUsers([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, action) {
    setActionMsg("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${id}/${action}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(data.message);
        fetchUsers();
      } else {
        setActionMsg(data.error || "Action failed");
      }
    } catch (err) {
      setActionMsg("Action failed");
    }
  }

  if (!userInfo || userInfo.email !== ADMIN_EMAIL) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 mb-10 text-center">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Access Denied</h2>
        <p className="text-gray-700">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Admin Panel - User Approvals</h2>
      {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
      {actionMsg && <div className="mb-4 text-green-600 text-center font-semibold">{actionMsg}</div>}
      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.status}</td>
                <td className="p-2 border">
                  {user.status === "pending" && (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleAction(user._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleAction(user._id, "reject")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {user.status !== "pending" && <span className="text-gray-400">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel; 