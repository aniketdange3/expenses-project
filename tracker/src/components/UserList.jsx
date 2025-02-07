import { FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserModal from './UserModal'; // Import UserModal component
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

const UserList = ({ users, setUsers }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    phoneNo: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching user data!');
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/auth/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Error deleting user!');
      console.error('Error deleting user:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:4000/api/auth/users/${editingUser._id}`, formData);
      toast.success('User updated successfully!');
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error updating user!');
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-semibold text-white mb-4">Users List</h1>

      <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-500 px-4 py-2 font-normal">ID</th>
              <th className="border border-gray-500 px-4 py-2 font-normal">Name</th>
              <th className="border border-gray-500 px-4 py-2 font-normal">Email</th>
              <th className="border border-gray-500 px-4 py-2 font-normal">Date of Birth</th>
              <th className="border border-gray-500 px-4 py-2 font-normal">Gender</th>
              <th className="border border-gray-500 px-4 py-2 font-normal">Address</th>
              <th className="border border-gray-500 px-4 py-2 font-normal">Phone No.</th>
              <th className="border border-gray-500  px-4 py-2 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className=" text-center">
                  <td className="border-gray-500 border px-4 py-2">{index + 1}</td>
                  <td className="border-gray-500 border px-4 py-2">{user.name}</td>
                  <td className="border-gray-500 border px-4 py-2">{user.email}</td>
                  <td className="border-gray-500 border px-4 py-2">{new Date(user.dob).toLocaleDateString()}</td>
                  <td className="border-gray-500 border px-4 py-2">{user.gender}</td>
                  <td className="border-gray-500 border px-4 py-2">{user.address}</td>
                  <td className="border-gray-500 border px-4 py-2">{user.phoneNo}</td>
                  <td className="border-gray-500 border px-4 py-2 space-x-4">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-gray-700 rounded-full p-3 hover:bg-black hover:text-white"
                      title="Edit"
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-gray-700 rounded-full p-3 hover:bg-black hover:text-white"
                      title="Delete"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleUpdateUser={handleUpdateUser}
      />
    </div>
  );
};

export default UserList;
