import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User,
  Package,
  TrendingUp,
  DollarSign,
  Cake,
  RefreshCw,
  UserCheck,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  fetchTasksSummary,
  fetchMemberBirthdays,
  fetchMemberRenewals,
  fetchMemberPaymentsDue,
  fetchLeadFollowUps,
  fetchNewLeads,
} from "../../store/admin/taskSlice";
import { toast } from "sonner";

const Tasks = () => {
  const dispatch = useDispatch();
  const {
    summary,
    summaryLoading,
    memberBirthdays,
    memberBirthdaysLoading,
    memberBirthdaysPagination,
    memberRenewals,
    memberRenewalsLoading,
    memberRenewalsPagination,
    memberRenewalsSummary,
    memberPaymentsDue,
    memberPaymentsDueLoading,
    memberPaymentsDuePagination,
    leadFollowUps,
    leadFollowUpsLoading,
    leadFollowUpsPagination,
    leadFollowUpsSummary,
    newLeads,
    newLeadsLoading,
    newLeadsPagination,
  } = useSelector((state) => state.tasks);

  const [activeTab, setActiveTab] = useState("members"); // members or leads
  const [activeMemberSubTab, setActiveMemberSubTab] = useState("birthdays"); // birthdays, renewals, payments
  const [activeLeadSubTab, setActiveLeadSubTab] = useState("followups"); // followups, new

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [birthdayFilter, setBirthdayFilter] = useState("today");
  const [renewalFilter, setRenewalFilter] = useState("all");
  const [daysRange, setDaysRange] = useState(7);
  const [followUpDateFilter, setFollowUpDateFilter] = useState("today");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [leadPriorityFilter, setLeadPriorityFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTasksSummary());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "members") {
      if (activeMemberSubTab === "birthdays") {
        dispatch(
          fetchMemberBirthdays({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            dateFilter: birthdayFilter,
          }),
        );
      } else if (activeMemberSubTab === "renewals") {
        dispatch(
          fetchMemberRenewals({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            status: renewalFilter,
            daysRange: daysRange,
          }),
        );
      } else if (activeMemberSubTab === "payments") {
        dispatch(
          fetchMemberPaymentsDue({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            amountFilter: "all",
          }),
        );
      }
    } else if (activeTab === "leads") {
      if (activeLeadSubTab === "followups") {
        dispatch(
          fetchLeadFollowUps({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            dateFilter: followUpDateFilter,
            statusFilter: leadStatusFilter,
            priorityFilter: leadPriorityFilter,
          }),
        );
      } else if (activeLeadSubTab === "new") {
        dispatch(
          fetchNewLeads({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            daysRange: 7,
          }),
        );
      }
    }
  }, [
    activeTab,
    activeMemberSubTab,
    activeLeadSubTab,
    currentPage,
    searchTerm,
    birthdayFilter,
    renewalFilter,
    daysRange,
    followUpDateFilter,
    leadStatusFilter,
    leadPriorityFilter,
    dispatch,
  ]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    dispatch(fetchTasksSummary());
    if (activeTab === "members") {
      if (activeMemberSubTab === "birthdays") {
        dispatch(
          fetchMemberBirthdays({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            dateFilter: birthdayFilter,
          }),
        );
      } else if (activeMemberSubTab === "renewals") {
        dispatch(
          fetchMemberRenewals({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            status: renewalFilter,
            daysRange: daysRange,
          }),
        );
      } else if (activeMemberSubTab === "payments") {
        dispatch(
          fetchMemberPaymentsDue({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            amountFilter: "all",
          }),
        );
      }
    } else if (activeTab === "leads") {
      if (activeLeadSubTab === "followups") {
        dispatch(
          fetchLeadFollowUps({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            dateFilter: followUpDateFilter,
            statusFilter: leadStatusFilter,
            priorityFilter: leadPriorityFilter,
          }),
        );
      } else if (activeLeadSubTab === "new") {
        dispatch(
          fetchNewLeads({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            daysRange: 7,
          }),
        );
      }
    }
    toast.success("Data refreshed successfully");
  };

  const getStatusColor = (status) => {
    const colors = {
      Expired: "bg-red-500/10 text-red-400",
      "Expiring Soon": "bg-yellow-500/10 text-yellow-400",
      Active: "bg-green-500/10 text-green-400",
      Today: "bg-blue-500/10 text-blue-400",
      Overdue: "bg-red-500/10 text-red-400",
      Scheduled: "bg-green-500/10 text-green-400",
    };
    return colors[status] || "bg-gray-100 text-white";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Urgent: "bg-red-500/10 text-red-400",
      High: "bg-orange-500/10 text-orange-400",
      Medium: "bg-yellow-500/10 text-yellow-400",
      Low: "bg-green-500/10 text-green-400",
    };
    return colors[priority] || "bg-gray-100 text-white";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const renderPagination = (pagination) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of{" "}
          {pagination.totalItems} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-2 text-sm font-medium text-white">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(pagination.totalPages, prev + 1),
              )
            }
            disabled={currentPage === pagination.totalPages}
            className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderMemberBirthdays = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Member Birthdays</h3>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <select
            value={birthdayFilter}
            onChange={(e) => {
              setBirthdayFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="upcoming">Upcoming (3 Months)</option>
          </select>
        </div>
      </div>

      {memberBirthdaysLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : memberBirthdays.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <Cake className="w-12 h-12 mb-3 text-gray-400" />
          <p>No birthdays found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Birthday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Days Until
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {memberBirthdays.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={member.photo}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {member.registrationNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {member.phoneNumber}
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {member.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {formatDate(member.dateOfBirth)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {member.age} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.isToday ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                          <Cake className="w-3 h-3 mr-1" />
                          Today
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          {member.daysUntilBirthday} days
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(memberBirthdaysPagination)}
        </>
      )}
    </div>
  );

  const renderMemberRenewals = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Package Renewals</h3>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 font-medium">Expired</p>
                <p className="text-2xl font-bold text-red-400">
                  {memberRenewalsSummary.expired}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400 font-medium">
                  Expiring Soon
                </p>
                <p className="text-2xl font-bold text-yellow-400">
                  {memberRenewalsSummary.expiringSoon}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <select
            value={renewalFilter}
            onChange={(e) => {
              setRenewalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="all">All Status</option>
            <option value="expired">Expired</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="renewed">Active</option>
          </select>
          <select
            value={daysRange}
            onChange={(e) => {
              setDaysRange(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="3">Next 3 Days</option>
            <option value="7">Next 7 Days</option>
            <option value="15">Next 15 Days</option>
            <option value="30">Next 30 Days</option>
          </select>
        </div>
      </div>

      {memberRenewalsLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : memberRenewals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <Package className="w-12 h-12 mb-3 text-gray-400" />
          <p>No renewals found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Days Until Due
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {memberRenewals.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={member.photo}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {member.registrationNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {member.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {formatDate(member.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {member.daysUntilDue < 0
                          ? `${Math.abs(member.daysUntilDue)} days overdue`
                          : `${member.daysUntilDue} days`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          member.renewalStatus,
                        )}`}
                      >
                        {member.renewalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(memberRenewalsPagination)}
        </>
      )}
    </div>
  );

  const renderMemberPayments = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Pending Payments</h3>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {memberPaymentsDueLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : memberPaymentsDue.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <DollarSign className="w-12 h-12 mb-3 text-gray-400" />
          <p>No pending payments found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Fees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {memberPaymentsDue.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={member.photo}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {member.registrationNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {member.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {formatCurrency(member.totalFees)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-400 font-medium">
                        {formatCurrency(member.paymentsMade)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-400 font-medium">
                        {formatCurrency(member.pendingAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {formatDate(member.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.isOverdue ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                          Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(memberPaymentsDuePagination)}
        </>
      )}
    </div>
  );

  const renderLeadFollowUps = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Follow-up Tasks</h3>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 font-medium">Today</p>
                <p className="text-2xl font-bold text-blue-400">
                  {leadFollowUpsSummary.today}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 font-medium">Overdue</p>
                <p className="text-2xl font-bold text-red-400">
                  {leadFollowUpsSummary.overdue}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 font-medium">This Week</p>
                <p className="text-2xl font-bold text-green-400">
                  {leadFollowUpsSummary.thisWeek}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <select
            value={followUpDateFilter}
            onChange={(e) => {
              setFollowUpDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select
            value={leadStatusFilter}
            onChange={(e) => {
              setLeadStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
          <select
            value={leadPriorityFilter}
            onChange={(e) => {
              setLeadPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {leadFollowUpsLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : leadFollowUps.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <Clock className="w-12 h-12 mb-3 text-gray-400" />
          <p>No follow-ups found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Follow-up Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Interested In
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {leadFollowUps.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {lead.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            Score: {lead.leadScore}/100
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {lead.phoneNumber}
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {formatDate(lead.nextFollowUpDate)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lead.daysUntilFollowUp !== null &&
                          (lead.daysUntilFollowUp < 0
                            ? `${Math.abs(lead.daysUntilFollowUp)} days overdue`
                            : lead.daysUntilFollowUp === 0
                              ? "Today"
                              : `In ${lead.daysUntilFollowUp} days`)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          lead.followUpStatus,
                        )}`}
                      >
                        {lead.followUpStatus}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        {lead.leadStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          lead.leadPriority,
                        )}`}
                      >
                        {lead.leadPriority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {lead.interestedPackage}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lead.leadSource}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(leadFollowUpsPagination)}
        </>
      )}
    </div>
  );

  const renderNewLeads = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            New Leads (Last 7 Days)
          </h3>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {newLeadsLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : newLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <UserCheck className="w-12 h-12 mb-3 text-gray-400" />
          <p>No new leads found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Interested In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {newLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {lead.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {lead.leadStatus}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {lead.phoneNumber}
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {lead.leadSource}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lead.contactMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          lead.leadPriority,
                        )}`}
                      >
                        {lead.leadPriority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {lead.interestedPackage}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {formatDate(lead.createdAt)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lead.daysOld === 0
                          ? "Today"
                          : `${lead.daysOld} days ago`}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(newLeadsPagination)}
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Tasks Dashboard
          </h1>
          <p className="text-gray-400">
            Manage member birthdays, renewals, payments, and lead follow-ups
          </p>
        </div>

        {/* Summary Cards */}
        {summaryLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">
                    Today's Birthdays
                  </p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">
                    {summary.members.todayBirthdays}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Cake className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">
                    Expired Packages
                  </p>
                  <p className="text-3xl font-bold text-red-400 mt-2">
                    {summary.members.expiredPackages}
                  </p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">
                    Expiring Soon
                  </p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">
                    {summary.members.expiringSoon}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">
                    Today's Follow-ups
                  </p>
                  <p className="text-3xl font-bold text-purple-400 mt-2">
                    {summary.leads.todayFollowUps}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab("members");
                  setCurrentPage(1);
                  setSearchTerm("");
                }}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "members"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                Member Tasks
              </button>
              <button
                onClick={() => {
                  setActiveTab("leads");
                  setCurrentPage(1);
                  setSearchTerm("");
                }}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "leads"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                Lead Tasks
              </button>
            </div>
          </div>

          {/* Sub Tabs */}
          {activeTab === "members" && (
            <div className="border-b border-gray-700 bg-gray-900/50">
              <div className="flex px-6">
                <button
                  onClick={() => {
                    setActiveMemberSubTab("birthdays");
                    setCurrentPage(1);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeMemberSubTab === "birthdays"
                      ? "border-blue-500 text-blue-400 bg-gray-800"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Birthdays
                </button>
                <button
                  onClick={() => {
                    setActiveMemberSubTab("renewals");
                    setCurrentPage(1);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeMemberSubTab === "renewals"
                      ? "border-blue-500 text-blue-400 bg-gray-800"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Renewals
                </button>
                <button
                  onClick={() => {
                    setActiveMemberSubTab("payments");
                    setCurrentPage(1);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeMemberSubTab === "payments"
                      ? "border-blue-500 text-blue-400 bg-gray-800"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Pending Payments
                </button>
              </div>
            </div>
          )}

          {activeTab === "leads" && (
            <div className="border-b border-gray-700 bg-gray-900/50">
              <div className="flex px-6">
                <button
                  onClick={() => {
                    setActiveLeadSubTab("followups");
                    setCurrentPage(1);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeLeadSubTab === "followups"
                      ? "border-blue-500 text-blue-400 bg-gray-800"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Follow-ups
                </button>
                <button
                  onClick={() => {
                    setActiveLeadSubTab("new");
                    setCurrentPage(1);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeLeadSubTab === "new"
                      ? "border-blue-500 text-blue-400 bg-gray-800"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  New Leads
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div>
          {activeTab === "members" && (
            <>
              {activeMemberSubTab === "birthdays" && renderMemberBirthdays()}
              {activeMemberSubTab === "renewals" && renderMemberRenewals()}
              {activeMemberSubTab === "payments" && renderMemberPayments()}
            </>
          )}

          {activeTab === "leads" && (
            <>
              {activeLeadSubTab === "followups" && renderLeadFollowUps()}
              {activeLeadSubTab === "new" && renderNewLeads()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;

