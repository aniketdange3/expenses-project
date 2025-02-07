import Modal from 'react-modal';
import { toast } from 'react-toastify';

const UserModal = ({ isOpen, onClose, formData, handleInputChange, handleUpdateUser }) => {

  const handleSave = () => {
    handleUpdateUser();
    toast.success('User updated successfully!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-3xl mx-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ content: { width: '60%', height: 'auto' } }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Edit User</h2>
      <form className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-white">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 bg-gray-700 text-white"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block mb-1 text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 bg-gray-700 text-white"
          />
        </div>
        {/* Date of Birth */}
        <div>
          <label className="block mb-1 text-white">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 bg-gray-700 text-white"
          />
        </div>
        {/* Gender */}
        <div>
          <label className="block mb-1 text-white">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 bg-gray-700 text-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Address */}
        <div className="col-span-2">
          <label className="block mb-1 text-white">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 bg-gray-700 text-white"
          />
        </div>
        {/* Phone Number */}
        <div className="col-span-2">
          <label className="block mb-1 text-white">Phone No.</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 bg-gray-700 text-white"
          />
        </div>
      </form>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default UserModal;
