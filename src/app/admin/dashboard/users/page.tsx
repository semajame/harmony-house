"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Search,
  User,
  Plus,
  X,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from "lucide-react";

interface UserType {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  isActive: boolean;
}

interface UserFormData {
  username: string;
  name: string;
  email: string;
  password?: string; // ✅ optional
  phone: string;
  role: string;
  isActive?: boolean;
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | string | null>(
    null
  );

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    isActive: true,
  });

  const router = useRouter();

  const isEditing = editingUser !== null;

  useEffect(() => {
    //^ fetch users
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        console.log(data);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = user?.username || "";
    const email = user?.email || "";
    const role = user?.role || "";
    const isActive = user?.isActive;

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" || role.toLowerCase() === filterRole.toLowerCase();

    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" && isActive === true) ||
      (filterActive === "inactive" && isActive === false);

    return matchesSearch && matchesRole && matchesActive;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive === true
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-purple-600 bg-purple-100";
      case "customer":
        return "text-blue-600 bg-blue-100";
      case "staff":
        return "text-pink-600 bg-pink-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  //^ submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let response;
      let url = "/api/admin/users";
      let method = "POST";

      if (isEditing) {
        url = `/api/admin/users/${editingUser.id}`;
        method = "PUT";
      }

      // Prepare the data - don't send empty password for updates

      const submitData = { ...formData };
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }

      response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} user`);
      }

      const userData = await response.json();

      if (isEditing) {
        // Update the user in the list
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUser.id ? { ...user, ...userData } : user
          )
        );
      } else {
        // Add the new user to the list
        setUsers((prev) => [...prev, userData]);
      }

      closeModal();
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} user:`,
        error
      );
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false);
    }
  };

  //^ edit from
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.username, // Assuming name is same as username, adjust as needed
      email: user.email,
      password: "", // Don't pre-fill password for editing
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
    setShowDropdown(null);
  };

  //^ delete user data by id
  const handleDeleteUser = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to delete user:", errorData.error);
      } else {
        const contentType = res.headers.get("content-type");
        const data = contentType?.includes("application/json")
          ? await res.json()
          : null;

        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "customer",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "customer",
      isActive: true,
    });
    setShowPassword(false);
  };

  const toggleDropdown = (id: number) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <div className="flex h-full bg-gray-100">
      <div className="flex-1 flex flex-col ">
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <div>
                <button
                  onClick={handleCreateUser}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Create User
                </button>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="all" className="cursor-pointer">
                    All Roles
                  </option>
                  <option value="admin" className="cursor-pointer">
                    Admin
                  </option>
                  <option value="staff" className="cursor-pointer">
                    Staff
                  </option>
                  <option value="customer" className="cursor-pointer">
                    Customer
                  </option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.username.charAt(0).toUpperCase() ?? ""}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.username}
                          </h3>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(user.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>

                        {showDropdown === user.id && (
                          <div className="absolute right-0 mt-2 w-38 bg-white rounded-md shadow-lg z-[10000] border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent closing the dropdown too early
                                  handleDeleteUser(user.id);
                                  setShowDropdown(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.isActive
                        )}`}
                      >
                        {user.isActive === true ? "Active" : "Inactive"}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.charAt(0).toUpperCase() +
                          user.role.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit User" : "Create New User"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Username */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                {/* Email */}
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Password (only required when creating a user) */}
                {!isEditing && (
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123-456-7890"
                  />
                </div>
                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="customer" className="cursor-pointer">
                      Customer
                    </option>
                    <option value="staff" className="cursor-pointer">
                      Staff
                    </option>
                    <option value="admin" className="cursor-pointer">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              {/* Active Status - Only show for editing */}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active User
                  </label>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 w-full">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  {isProcessing
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
