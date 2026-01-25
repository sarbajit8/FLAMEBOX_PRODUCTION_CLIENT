import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  Upload,
  ImageIcon,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { debounce } from "lodash";

const GroupsPage = () => {
  // State for groups list
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // State for form
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    groupImage: "",
    members: [],
  });

  // State for member search
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [searchingMembers, setSearchingMembers] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // State for delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Fetch groups
  const fetchGroups = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiBase}/api/admin/groups?page=${page}&limit=10&search=${search}`,
        { withCredentials: true },
      );

      if (response.data.success) {
        setGroups(response.data.groups);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchGroups(1, query);
    }, 300),
    [],
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Search members for adding to group
  const searchMembers = async (query) => {
    if (!query.trim()) {
      setMemberSearchResults([]);
      return;
    }

    try {
      setSearchingMembers(true);
      const excludeGroup = isEditMode ? editingGroupId : "";
      const response = await axios.get(
        `${apiBase}/api/admin/groups/search-members?search=${query}&excludeGroup=${excludeGroup}`,
        { withCredentials: true },
      );

      if (response.data.success) {
        // Filter out already selected members
        const selectedIds = formData.members.map((m) => m._id);
        const filtered = response.data.members.filter(
          (m) => !selectedIds.includes(m._id),
        );
        setMemberSearchResults(filtered);
      }
    } catch (error) {
      console.error("Error searching members:", error);
    } finally {
      setSearchingMembers(false);
    }
  };

  const debouncedMemberSearch = useCallback(
    debounce((query) => {
      searchMembers(query);
    }, 300),
    [formData.members, isEditMode, editingGroupId],
  );

  const handleMemberSearchChange = (e) => {
    setMemberSearch(e.target.value);
    debouncedMemberSearch(e.target.value);
  };

  // Add member to form
  const addMemberToForm = (member) => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, member],
    }));
    setMemberSearch("");
    setMemberSearchResults([]);
  };

  // Remove member from form
  const removeMemberFromForm = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m._id !== memberId),
    }));
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      try {
        setImageUploading(true);
        toast.loading("Uploading image...");

        const formDataToUpload = new FormData();
        formDataToUpload.append("file", file);
        formDataToUpload.append("upload_preset", "FLAMEBOX");
        formDataToUpload.append("cloud_name", "dchim0zcz");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dchim0zcz/auto/upload",
          {
            method: "POST",
            body: formDataToUpload,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await response.json();

        if (data.secure_url) {
          setFormData((prev) => ({
            ...prev,
            groupImage: data.secure_url,
          }));
          toast.dismiss();
          toast.success(
            "Image uploaded successfully! Now fill in group details.",
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.dismiss();
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setImageUploading(false);
      }
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingGroupId(null);
    setFormData({
      groupName: "",
      description: "",
      groupImage: "",
      members: [],
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = async (group) => {
    setIsEditMode(true);
    setEditingGroupId(group._id);
    setFormData({
      groupName: group.groupName,
      description: group.description || "",
      groupImage: group.groupImage || "",
      members: group.members.map((m) => m.memberId).filter(Boolean),
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingGroupId(null);
    setFormData({
      groupName: "",
      description: "",
      groupImage: "",
      members: [],
    });
    setMemberSearch("");
    setMemberSearchResults([]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    try {
      setFormLoading(true);

      // Only send groupImage if it's a Cloudinary URL or already set
      // Don't send base64 strings
      let groupImageToSend = formData.groupImage;
      if (groupImageToSend && groupImageToSend.startsWith("data:")) {
        // This should not happen now, but as a fallback, don't send base64
        groupImageToSend = "";
      }

      const payload = {
        groupName: formData.groupName.trim(),
        description: formData.description.trim(),
        groupImage: groupImageToSend,
        members: formData.members.map((m) => m._id),
      };

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${apiBase}/api/admin/groups/${editingGroupId}`,
          payload,
          { withCredentials: true },
        );
      } else {
        response = await axios.post(`${apiBase}/api/admin/groups`, payload, {
          withCredentials: true,
        });
      }

      if (response.data.success) {
        toast.success(
          isEditMode
            ? "Group updated successfully"
            : "Group created successfully",
        );
        closeModal();
        fetchGroups(pagination.currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Error saving group:", error);
      toast.error(error.response?.data?.error || "Failed to save group");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete group
  const handleDelete = async () => {
    if (!deletingGroupId) return;

    try {
      const response = await axios.delete(
        `${apiBase}/api/admin/groups/${deletingGroupId}`,
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Group deleted successfully");
        setDeleteModalOpen(false);
        setDeletingGroupId(null);
        fetchGroups(pagination.currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error(error.response?.data?.error || "Failed to delete group");
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    fetchGroups(page, searchQuery);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Groups</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage member groups
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Users className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No groups found</p>
            <p className="text-sm mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Create your first group to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {groups.map((group) => (
                  <tr
                    key={group._id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {group.groupImage ? (
                          <img
                            src={group.groupImage}
                            alt={group.groupName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <span className="font-medium text-white">
                          {group.groupName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm line-clamp-1">
                        {group.description || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 3).map((member, idx) =>
                            member.memberId?.photo ? (
                              <img
                                key={idx}
                                src={member.memberId.photo}
                                alt=""
                                className="w-7 h-7 rounded-full border-2 border-gray-800 object-cover"
                              />
                            ) : (
                              <div
                                key={idx}
                                className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-xs text-white"
                              >
                                {member.memberId?.fullName?.charAt(0) || "?"}
                              </div>
                            ),
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {group.members.length} member
                          {group.members.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-400 text-sm">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(group)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingGroupId(group._id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalCount,
              )}{" "}
              of {pagination.totalCount} groups
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.currentPage) <= 1,
                )
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        page === pagination.currentPage
                          ? "bg-red-600 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {isEditMode ? "Edit Group" : "Create Group"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Group Image - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Group Image (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {formData.groupImage ? (
                    <div className="relative">
                      <img
                        src={formData.groupImage}
                        alt="Group"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-green-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, groupImage: "" }))
                          }
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute -bottom-8 left-0 text-xs text-green-400 font-semibold">
                        ✓ Image uploaded
                      </div>
                    </div>
                  ) : (
                    <label className="w-32 h-32 flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-red-500 hover:from-gray-600 hover:to-gray-700 transition-all">
                      {imageUploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                          <span className="text-xs text-gray-400 mt-2">
                            Uploading...
                          </span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-10 h-10 text-gray-400" />
                          <span className="text-xs text-gray-400 mt-2 font-medium">
                            Click to Upload
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-sm text-gray-400">
                    <p className="font-semibold text-gray-300 mb-2">
                      Upload Requirements:
                    </p>
                    <p>• Square image recommended</p>
                    <p>• Max size: 5MB</p>
                    <p>• PNG, JPG, JPEG supported</p>
                    <p className="text-gray-500 mt-2">
                      📝 Optional - can be added later
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      groupName: e.target.value,
                    }))
                  }
                  placeholder="Enter group name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter group description (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              {/* Members */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Members
                </label>

                {/* Member Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={handleMemberSearchChange}
                    placeholder="Search members to add..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />

                  {/* Search Results Dropdown */}
                  {(memberSearchResults.length > 0 || searchingMembers) && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchingMembers ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        </div>
                      ) : (
                        memberSearchResults.map((member) => (
                          <button
                            key={member._id}
                            type="button"
                            onClick={() => addMemberToForm(member)}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-600 transition-colors text-left"
                          >
                            {member.photo ? (
                              <img
                                src={member.photo}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-sm text-white">
                                {member.fullName?.charAt(0) || "?"}
                              </div>
                            )}
                            <div>
                              <p className="text-white text-sm">
                                {member.fullName}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {member.email || member.phoneNumber}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Members */}
                {formData.members.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-700/50 rounded-lg">
                    {formData.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 rounded-full"
                      >
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white">
                            {member.fullName?.charAt(0) || "?"}
                          </div>
                        )}
                        <span className="text-white text-sm">
                          {member.fullName}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMemberFromForm(member._id)}
                          className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.members.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No members added yet. Search and add members above.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || imageUploading}
                  title={imageUploading ? "Uploading image..." : ""}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(formLoading || imageUploading) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {imageUploading
                    ? "Uploading..."
                    : isEditMode
                      ? "Update Group"
                      : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">Delete Group</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this group? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingGroupId(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
