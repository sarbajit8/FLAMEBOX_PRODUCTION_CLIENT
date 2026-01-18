import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  Download,
  Users,
  Calendar,
  Umbrella,
  DollarSign,
  FileText,
  MessageSquare,
  BarChart3,
  Layers,
  Shield,
  FileCheck,
  User,
  Image,
  Menu,
  X,
  CreditCard,
  Clock,
  IndianRupee,
  Activity,
  TrendingUpIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const performanceData = [
  { team: "Developer Team", percentage: 85, color: "bg-orange-500" },
  { team: "Design Team", percentage: 84, color: "bg-cyan-500" },
  { team: "Marketing Team", percentage: 28, color: "bg-purple-500" },
  { team: "Management Team", percentage: 16, color: "bg-pink-500" },
];

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalMembers: 0,
    totalPaid: 0,
    totalPending: 0,
    totalRevenue: 0,
    totalReports: 0,
  });
  const [leadsStats, setLeadsStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    newLeads: 0,
    conversionRate: 0,
  });
  const [engagementStats, setEngagementStats] = useState({
    newMemberships: 0,
    renewals: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    vaccination: {
      vaccinated: 0,
      partiallyVaccinated: 0,
      notVaccinated: 0,
      unknown: 0,
      total: 0,
    },
    attendanceData: [],
  });
  const [analyticsStats, setAnalyticsStats] = useState({
    leadsBySource: [],
    leadsByStatus: [],
    conversionFunnel: [],
    monthlyTrends: [],
    teamPerformance: [],
  });
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Revenue");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "2025-12-01",
    end: "2025-12-31",
  });
  const [tempDateRange, setTempDateRange] = useState({
    start: "2025-12-01",
    end: "2025-12-31",
  });

  useEffect(() => {
    fetchDashboardStats();
    fetchLeadsData();
    fetchEngagementStats();
    fetchAnalyticsStats();
  }, [dateRange]);

  const fetchDashboardStats = async () => {
    try {
      console.log("📊 Fetching dashboard statistics...");
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await axios.get(`${apiBase}/api/admin/dashboard/stats`, {
        withCredentials: true,
      });
      console.log("Dashboard stats response:", response.data);
      if (response.data.success) {
        setDashboardStats(response.data.statistics);
        console.log("Dashboard stats set:", response.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error ||
          "Failed to load dashboard statistics. Please ensure you're logged in.",
      );
      // Set to 0 on error
      setDashboardStats({
        totalMembers: 0,
        totalPaid: 0,
        totalPending: 0,
        totalRevenue: 0,
        totalReports: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsData = async () => {
    try {
      console.log("📊 Fetching leads data with date range:", dateRange);
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

      // Fetch all leads with date range filter
      const url = `${apiBase}/api/leads?limit=1000&startDate=${dateRange.start}&endDate=${dateRange.end}`;

      const leadsResponse = await axios.get(url, {
        withCredentials: true,
      });

      console.log("API Response:", leadsResponse.data);

      if (leadsResponse.data.success) {
        const filteredLeads = leadsResponse.data.leads || [];
        console.log(`Received ${filteredLeads.length} leads from API`);
        console.log("First lead sample:", filteredLeads[0]);
        setLeadsData(filteredLeads);

        // Calculate statistics from filtered leads
        const totalLeads = filteredLeads.length;
        const convertedLeads = filteredLeads.filter(
          (l) => l.leadStatus === "Converted",
        ).length;
        const hotLeads = filteredLeads.filter(
          (l) => l.leadStatus === "Hot",
        ).length;
        const warmLeads = filteredLeads.filter(
          (l) => l.leadStatus === "Warm",
        ).length;
        const coldLeads = filteredLeads.filter(
          (l) => l.leadStatus === "Cold",
        ).length;
        const newLeads = filteredLeads.filter(
          (l) => l.leadStatus === "New",
        ).length;
        const conversionRate =
          totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;

        setLeadsStats({
          totalLeads,
          convertedLeads,
          hotLeads,
          warmLeads,
          coldLeads,
          newLeads,
          conversionRate,
        });

        console.log("Leads stats calculated:", {
          totalLeads,
          convertedLeads,
          hotLeads,
          warmLeads,
          coldLeads,
          newLeads,
          dateRange,
        });
      }
    } catch (error) {
      console.error("Error fetching leads data:", error);
      console.error("Error details:", error.response?.data || error.message);
      // Set default values on error
      setLeadsStats({
        totalLeads: 0,
        convertedLeads: 0,
        hotLeads: 0,
        warmLeads: 0,
        coldLeads: 0,
        newLeads: 0,
        conversionRate: 0,
      });
      setLeadsData([]);
    }
  };

  const fetchEngagementStats = async () => {
    try {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await axios.get(
        `${apiBase}/api/admin/dashboard/engagement`,
        {
          params: {
            start: dateRange.start,
            end: dateRange.end,
          },
          withCredentials: true,
        },
      );
      console.log("Engagement stats response:", response.data);
      if (response.data.success) {
        setEngagementStats(response.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching engagement stats:", error);
      toast.error(
        error.response?.data?.error || "Failed to load engagement statistics.",
      );
    }
  };

  const fetchAnalyticsStats = async () => {
    try {
      console.log("📊 Fetching analytics statistics...");
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await axios.get(
        `${apiBase}/api/admin/dashboard/analytics`,
        {
          params: {
            start: dateRange.start,
            end: dateRange.end,
          },
          withCredentials: true,
        },
      );
      console.log("Analytics stats response:", response.data);
      if (response.data.success) {
        setAnalyticsStats(response.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
      toast.error(
        error.response?.data?.error || "Failed to load analytics statistics.",
      );
    }
  };

  const getLeadsBySource = () => {
    const sources = {};
    leadsData.forEach((lead) => {
      if (lead.leadSource) {
        sources[lead.leadSource] = (sources[lead.leadSource] || 0) + 1;
      }
    });
    return Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const getLeadsByMonth = () => {
    const months = {};
    leadsData.forEach((lead) => {
      if (lead.addedDate) {
        const date = new Date(lead.addedDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const month = date.toLocaleString("default", { month: "short" });

        if (!months[monthKey]) {
          months[monthKey] = { month, converted: 0, total: 0 };
        }
        months[monthKey].total++;

        if (lead.leadStatus === "Converted") {
          months[monthKey].converted++;
        }
      }
    });

    return Object.values(months).slice(-6);
  };

  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const suffix = ["st", "nd", "rd"][day % 10] || "th";
    if (day >= 10 && day <= 20) return `${day}th ${month} ${year}`;
    return `${day}${suffix} ${month} ${year}`;
  };

  const handleDateRangeApply = () => {
    setDateRange(tempDateRange);
    setIsDateModalOpen(false);
  };

  const handleDateModalOpen = () => {
    setTempDateRange(dateRange);
    setIsDateModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const tabs = ["Revenue", "Acquisition", "Engagement", "Analytics"];

  const stats = [
    {
      value: loading ? "..." : formatCurrency(dashboardStats.totalRevenue),
      label: "Total Sales",
      icon: DollarSign,
      change: "-58%",
      changeType: "decrease",
    },
    {
      value: loading ? "..." : formatCurrency(dashboardStats.totalPaid),
      label: "Payment Received",
      icon: CreditCard,
      change: "-50%",
      changeType: "decrease",
    },
    {
      value: loading ? "..." : formatCurrency(dashboardStats.totalPending),
      label: "Pending Payments",
      icon: Clock,
      change: "+1900%",
      changeType: "increase",
    },
    {
      value: loading ? "..." : dashboardStats.totalMembers,
      label: "Packages Sold",
      icon: FileCheck,
      change: "-54%",
      changeType: "decrease",
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        {/* Title and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-semibold text-sm transition-colors ${
                  activeTab === tab
                    ? tab === "Revenue" ||
                      tab === "Analytics" ||
                      tab === "Engagement" ||
                      tab === "Acquisition"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                } rounded-lg border border-gray-700`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range and Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">
              Showing Results From:{" "}
              <span className="text-white font-semibold">
                {formatDateForDisplay(dateRange.start)} -{" "}
                {formatDateForDisplay(dateRange.end)}
              </span>
            </span>
          </div>
          <button
            onClick={handleDateModalOpen}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Change Duration
          </button>
        </div>

        {/* Stats Cards - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTab === "Revenue"
            ? stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <stat.icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          {stat.label}
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {stat.value}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        stat.changeType === "decrease"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {stat.changeType === "decrease" ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                      <span className="text-xs font-semibold">
                        {stat.change} less than last month
                      </span>
                    </div>
                  </div>
                </div>
              ))
            : activeTab === "Acquisition"
              ? [
                  {
                    value: leadsStats.totalLeads,
                    label: "Lead Generated",
                    icon: Users,
                    change: "+12%",
                    changeType: "increase",
                  },
                  {
                    value: leadsStats.totalLeads - leadsStats.convertedLeads,
                    label: "Open Leads",
                    icon: Activity,
                    change: "+8%",
                    changeType: "increase",
                  },
                  {
                    value: leadsStats.convertedLeads,
                    label: "Leads Converted",
                    icon: FileCheck,
                    change: "+5%",
                    changeType: "increase",
                  },
                  {
                    value: leadsStats.coldLeads,
                    label: "Unqualified Leads",
                    icon: TrendingDown,
                    change: "-2%",
                    changeType: "decrease",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <stat.icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            {stat.label}
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {stat.value}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          stat.changeType === "decrease"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {stat.changeType === "decrease" ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                        <span className="text-xs font-semibold">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              : activeTab === "Engagement"
                ? [
                    {
                      value: engagementStats.newMemberships,
                      label: "New Memberships",
                      icon: Users,
                      change: "71%",
                      changeType: "decrease",
                    },
                    {
                      value: engagementStats.renewals || "--",
                      label: "Membership Renewals",
                      icon: FileCheck,
                      change: "--",
                      changeType: "decrease",
                    },
                    {
                      value: engagementStats.activeMembers,
                      label: "Active Members",
                      icon: Activity,
                      change: "0%",
                      changeType: "decrease",
                    },
                    {
                      value: engagementStats.inactiveMembers,
                      label: "Inactive Members",
                      icon: TrendingDown,
                      change: "31%",
                      changeType: "increase",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gray-700 rounded-lg">
                            <stat.icon className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              {stat.label}
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {stat.value}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded ${
                            stat.changeType === "decrease"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          {stat.changeType === "decrease" ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          <span className="text-xs font-semibold">
                            {stat.change}{" "}
                            {stat.change !== "--" && "less than last month"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                : activeTab === "Analytics"
                  ? [
                      // Revenue Stats
                      {
                        value: loading
                          ? "..."
                          : formatCurrency(dashboardStats.totalRevenue),
                        label: "Total Sales",
                        icon: DollarSign,
                        change: "-58%",
                        changeType: "decrease",
                        category: "Revenue",
                      },
                      {
                        value: loading
                          ? "..."
                          : formatCurrency(dashboardStats.totalPaid),
                        label: "Payment Received",
                        icon: CreditCard,
                        change: "-50%",
                        changeType: "decrease",
                        category: "Revenue",
                      },
                      {
                        value: loading
                          ? "..."
                          : formatCurrency(dashboardStats.totalPending),
                        label: "Pending Payments",
                        icon: Clock,
                        change: "+1900%",
                        changeType: "increase",
                        category: "Revenue",
                      },
                      {
                        value: loading ? "..." : dashboardStats.totalMembers,
                        label: "Packages Sold",
                        icon: FileCheck,
                        change: "-54%",
                        changeType: "decrease",
                        category: "Revenue",
                      },
                      // Acquisition Stats
                      {
                        value: leadsStats.totalLeads,
                        label: "Lead Generated",
                        icon: Users,
                        change: "+12%",
                        changeType: "increase",
                        category: "Acquisition",
                      },
                      {
                        value:
                          leadsStats.totalLeads - leadsStats.convertedLeads,
                        label: "Open Leads",
                        icon: Activity,
                        change: "+8%",
                        changeType: "increase",
                        category: "Acquisition",
                      },
                      {
                        value: leadsStats.convertedLeads,
                        label: "Leads Converted",
                        icon: FileCheck,
                        change: "+5%",
                        changeType: "increase",
                        category: "Acquisition",
                      },
                      {
                        value: leadsStats.coldLeads,
                        label: "Unqualified Leads",
                        icon: TrendingDown,
                        change: "-2%",
                        changeType: "decrease",
                        category: "Acquisition",
                      },
                      // Engagement Stats
                      {
                        value: engagementStats.newMemberships,
                        label: "New Memberships",
                        icon: Users,
                        change: "71%",
                        changeType: "decrease",
                        category: "Engagement",
                      },
                      {
                        value: engagementStats.renewals || "--",
                        label: "Membership Renewals",
                        icon: FileCheck,
                        change: "--",
                        changeType: "decrease",
                        category: "Engagement",
                      },
                      {
                        value: engagementStats.activeMembers,
                        label: "Active Members",
                        icon: Activity,
                        change: "0%",
                        changeType: "decrease",
                        category: "Engagement",
                      },
                      {
                        value: engagementStats.inactiveMembers,
                        label: "Inactive Members",
                        icon: TrendingDown,
                        change: "31%",
                        changeType: "increase",
                        category: "Engagement",
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-700 rounded-lg">
                              <stat.icon className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-semibold">
                                {stat.category}
                              </div>
                              <div className="text-sm text-gray-400">
                                {stat.label}
                              </div>
                              <div className="text-2xl font-bold text-white">
                                {stat.value}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded ${
                              stat.changeType === "decrease"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-green-500/10 text-green-400"
                            }`}
                          >
                            {stat.changeType === "decrease" ? (
                              <TrendingDown className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            <span className="text-xs font-semibold">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
        </div>
      </div>

      {/* Reports Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Reports</h2>
      </div>

      {/* Charts Section - Revenue Tab */}
      {activeTab === "Revenue" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Total Revenue Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Total Revenue (Last Month vs This Month)
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>₹50,000</span>
                <span>₹45,000</span>
                <span>₹40,000</span>
                <span>₹35,000</span>
                <span>₹30,000</span>
                <span>₹25,000</span>
                <span>₹20,000</span>
                <span>₹15,000</span>
                <span>₹10,000</span>
                <span>₹5,000</span>
                <span>₹0</span>
              </div>

              <svg
                className="w-full h-full pl-12"
                viewBox="0 0 700 300"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <line
                    key={`grid-${i}`}
                    x1="40"
                    y1={i * 27}
                    x2="680"
                    y2={i * 27}
                    stroke="#374151"
                    strokeWidth="1"
                  />
                ))}

                {/* Bar groups for each week */}
                {[
                  { x: 60, lastMonth: 42, thisMonth: 32 },
                  { x: 150, lastMonth: 18, thisMonth: 12 },
                  { x: 240, lastMonth: 38, thisMonth: 8 },
                  { x: 330, lastMonth: 12, thisMonth: 8 },
                  { x: 420, lastMonth: 8, thisMonth: 5 },
                ].map((data, i) => (
                  <g key={`bars-${i}`}>
                    {/* Last Month bar (yellow) */}
                    <rect
                      x={data.x}
                      y={270 - data.lastMonth * 5}
                      width="30"
                      height={data.lastMonth * 5}
                      fill="#fbbf24"
                      rx="4"
                    />
                    {/* This Month bar (blue) */}
                    <rect
                      x={data.x + 35}
                      y={270 - data.thisMonth * 5}
                      width="30"
                      height={data.thisMonth * 5}
                      fill="#3b82f6"
                      rx="4"
                    />
                  </g>
                ))}
              </svg>

              <div className="absolute bottom-0 left-12 right-0 flex justify-around px-4 text-xs text-gray-500">
                <span>1 Dec - 7 Dec '25</span>
                <span>8 Dec - 14 Dec '25</span>
                <span>15 Dec - 21 Dec '25</span>
                <span>22 Dec - 28 Dec '25</span>
                <span>29 Dec - 31 Dec '25</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-400"></div>
                <span className="text-xs text-gray-400">Last Month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-xs text-gray-400">This Month</span>
              </div>
            </div>
          </div>

          {/* Planned & Actual Sales Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Planned & Actual Sales
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>₹0</span>
                <span>₹10,000</span>
                <span>₹20,000</span>
                <span>₹30,000</span>
                <span>₹40,000</span>
                <span>₹50,000</span>
                <span>₹60,000</span>
                <span>₹70,000</span>
              </div>

              <svg
                className="w-full h-full pl-12"
                viewBox="0 0 700 300"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <line
                    key={`grid-${i}`}
                    x1="40"
                    y1={i * 37.5}
                    x2="680"
                    y2={i * 37.5}
                    stroke="#374151"
                    strokeWidth="1"
                  />
                ))}

                {/* Horizontal bar showing actual sales */}
                <rect
                  x="100"
                  y="100"
                  width="550"
                  height="80"
                  fill="#3b82f6"
                  rx="4"
                  opacity="0.8"
                />

                {/* Labels for ranges */}
                <text
                  x="50"
                  y="145"
                  fontSize="12"
                  fill="#9ca3af"
                  textAnchor="end"
                >
                  Actual
                </text>
                <text
                  x="50"
                  y="70"
                  fontSize="12"
                  fill="#9ca3af"
                  textAnchor="end"
                >
                  Planned
                </text>
              </svg>

              <div className="absolute bottom-0 left-12 right-0 flex justify-between px-4 text-xs text-gray-500">
                <span>₹0</span>
                <span>₹10,000</span>
                <span>₹20,000</span>
                <span>₹30,000</span>
                <span>₹40,000</span>
                <span>₹50,000</span>
                <span>₹60,000</span>
                <span>₹70,000</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-400"></div>
                <span className="text-xs text-gray-400">Planned Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-xs text-gray-400">Actual Sales</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section - Acquisition Tab */}
      {activeTab === "Acquisition" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lead By Sources */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Lead By Sources</h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {getLeadsBySource().map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">{item.source}</span>
                    <span className="text-sm font-bold text-white">
                      {item.count} leads
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        idx === 0
                          ? "bg-red-500"
                          : idx === 1
                            ? "bg-orange-500"
                            : idx === 2
                              ? "bg-yellow-500"
                              : idx === 3
                                ? "bg-green-500"
                                : idx === 4
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                      }`}
                      style={{
                        width: `${(item.count / Math.max(...getLeadsBySource().map((s) => s.count), 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leads Converted Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Leads Converted (Last Month vs This Month)
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              <svg
                className="w-full h-full pl-12"
                viewBox="0 0 700 300"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={`grid-${i}`}
                    x1="40"
                    y1={i * 50}
                    x2="680"
                    y2={i * 50}
                    stroke="#374151"
                    strokeWidth="1"
                  />
                ))}

                {/* Bar groups for each period */}
                {getLeadsByMonth().map((data, i) => {
                  const totalHeight = Math.max(
                    ...getLeadsByMonth().map((m) => m.total),
                    1,
                  );
                  const convertedHeight = Math.max(
                    ...getLeadsByMonth().map((m) => m.converted),
                    1,
                  );
                  const x = 60 + i * 100;
                  const lastMonthHeight = (data.total / totalHeight) * 200;
                  const thisMonthHeight =
                    (data.converted / convertedHeight) * 200;

                  return (
                    <g key={i}>
                      {/* Last Month bar (yellow) */}
                      <rect
                        x={x}
                        y={250 - lastMonthHeight}
                        width="35"
                        height={lastMonthHeight}
                        fill="#fbbf24"
                        rx="4"
                      />
                      {/* This Month bar (green) */}
                      <rect
                        x={x + 40}
                        y={250 - thisMonthHeight}
                        width="35"
                        height={thisMonthHeight}
                        fill="#10b981"
                        rx="4"
                      />
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-0 left-12 right-0 flex justify-around px-4 text-xs text-gray-500">
                {getLeadsByMonth().map((data, idx) => (
                  <span key={idx}>{data.month}</span>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-400"></div>
                <span className="text-xs text-gray-400">Total Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-xs text-gray-400">Converted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section - Engagement Tab */}
      {activeTab === "Engagement" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Attendance Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Attendance (Last Month vs This Month)
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Data Not Available</p>
              </div>
            </div>
          </div>

          {/* Vaccination Status Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Vaccination Status
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center gap-12">
                {/* Donut Chart */}
                <div className="relative">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="30"
                      strokeDasharray={`${
                        (engagementStats.vaccination.notVaccinated /
                          Math.max(engagementStats.vaccination.total, 1)) *
                        440
                      } 440`}
                      transform="rotate(-90 90 90)"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="30"
                      strokeDasharray={`${
                        (engagementStats.vaccination.partiallyVaccinated /
                          Math.max(engagementStats.vaccination.total, 1)) *
                        440
                      } 440`}
                      strokeDashoffset={`-${
                        (engagementStats.vaccination.notVaccinated /
                          Math.max(engagementStats.vaccination.total, 1)) *
                        440
                      }`}
                      transform="rotate(-90 90 90)"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="30"
                      strokeDasharray={`${
                        (engagementStats.vaccination.vaccinated /
                          Math.max(engagementStats.vaccination.total, 1)) *
                        440
                      } 440`}
                      strokeDashoffset={`-${
                        ((engagementStats.vaccination.notVaccinated +
                          engagementStats.vaccination.partiallyVaccinated) /
                          Math.max(engagementStats.vaccination.total, 1)) *
                        440
                      }`}
                      transform="rotate(-90 90 90)"
                    />
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                      <span className="text-xs text-gray-400">
                        {Math.round(
                          (engagementStats.vaccination.vaccinated /
                            Math.max(engagementStats.vaccination.total, 1)) *
                            100,
                        )}
                        % Members
                      </span>
                    </div>
                    <div className="ml-5">
                      <div className="text-lg font-bold text-white">
                        {engagementStats.vaccination.vaccinated} Members
                      </div>
                      <div className="text-xs text-gray-500">
                        Fully Vaccinated
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
                      <span className="text-xs text-gray-400">
                        {Math.round(
                          (engagementStats.vaccination.partiallyVaccinated /
                            Math.max(engagementStats.vaccination.total, 1)) *
                            100,
                        )}
                        % Members
                      </span>
                    </div>
                    <div className="ml-5">
                      <div className="text-lg font-bold text-white">
                        {engagementStats.vaccination.partiallyVaccinated}{" "}
                        Members
                      </div>
                      <div className="text-xs text-gray-500">
                        Partially Vaccinated
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                      <span className="text-xs text-gray-400">
                        {Math.round(
                          (engagementStats.vaccination.notVaccinated /
                            Math.max(engagementStats.vaccination.total, 1)) *
                            100,
                        )}
                        % Members
                      </span>
                    </div>
                    <div className="ml-5">
                      <div className="text-lg font-bold text-white">
                        {engagementStats.vaccination.notVaccinated} Members
                      </div>
                      <div className="text-xs text-gray-500">
                        Not Vaccinated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section - Analytics Tab */}
      {activeTab === "Analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Conversion Funnel */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Conversion Funnel
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-6">
              {analyticsStats.conversionFunnel.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-300">
                      {stage.stage}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-8 bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className={`h-full flex items-center justify-center text-white text-xs font-bold transition-all ${
                        idx === 0
                          ? "bg-blue-500"
                          : idx === 1
                            ? "bg-purple-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${stage.percentage}%` }}
                    >
                      {stage.percentage > 10 && `${stage.percentage}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Lead Sources</h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {analyticsStats.leadsBySource.slice(0, 6).map((source, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">{source._id}</span>
                    <span className="text-sm font-bold text-white">
                      {source.count} leads
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        idx === 0
                          ? "bg-red-500"
                          : idx === 1
                            ? "bg-orange-500"
                            : idx === 2
                              ? "bg-yellow-500"
                              : idx === 3
                                ? "bg-green-500"
                                : idx === 4
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                      }`}
                      style={{
                        width: `${
                          (source.count /
                            Math.max(
                              ...analyticsStats.leadsBySource.map(
                                (s) => s.count,
                              ),
                              1,
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Status Breakdown */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Lead Status Breakdown
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {analyticsStats.leadsByStatus.map((status, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-300">{status._id}</span>
                  <span className="text-sm font-bold text-white">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Monthly Trends</h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="h-64 relative">
              {analyticsStats.monthlyTrends.length > 0 ? (
                <div>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                    <span>
                      {Math.max(
                        ...analyticsStats.monthlyTrends.map((t) => t.leads),
                        1,
                      )}
                    </span>
                    <span>
                      {Math.max(
                        ...analyticsStats.monthlyTrends.map((t) => t.leads),
                        1,
                      ) / 2}
                    </span>
                    <span>0</span>
                  </div>

                  <svg
                    className="w-full h-full pl-12"
                    viewBox="0 0 700 300"
                    preserveAspectRatio="none"
                  >
                    {/* Grid lines */}
                    {[0, 1, 2].map((i) => (
                      <line
                        key={`grid-${i}`}
                        x1="40"
                        y1={i * 100}
                        x2="680"
                        y2={i * 100}
                        stroke="#374151"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Bar chart */}
                    {analyticsStats.monthlyTrends.map((trend, i) => {
                      const maxLeads = Math.max(
                        ...analyticsStats.monthlyTrends.map((t) => t.leads),
                        1,
                      );
                      const x =
                        60 + (i * 600) / analyticsStats.monthlyTrends.length;
                      const barWidth =
                        600 / (analyticsStats.monthlyTrends.length * 1.5);
                      const height = (trend.leads / maxLeads) * 250;

                      return (
                        <g key={i}>
                          {/* Total leads bar */}
                          <rect
                            x={x}
                            y={250 - height}
                            width={barWidth}
                            height={height}
                            fill="#3b82f6"
                            rx="4"
                            opacity="0.7"
                          />
                          {/* Converted leads bar */}
                          <rect
                            x={x + barWidth * 0.6}
                            y={250 - (trend.converted / maxLeads) * 250}
                            width={barWidth * 0.4}
                            height={(trend.converted / maxLeads) * 250}
                            fill="#10b981"
                            rx="4"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">No data available</p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-xs text-gray-400">Total Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-xs text-gray-400">Converted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-6">
              Change Duration
            </h2>

            <div className="space-y-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempDateRange.start}
                  onChange={(e) =>
                    setTempDateRange({
                      ...tempDateRange,
                      start: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempDateRange.end}
                  onChange={(e) =>
                    setTempDateRange({ ...tempDateRange, end: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-6">
                <button
                  onClick={() => {
                    const today = new Date();
                    const thirtyDaysAgo = new Date(
                      today.getTime() - 30 * 24 * 60 * 60 * 1000,
                    );
                    setTempDateRange({
                      start: thirtyDaysAgo.toISOString().split("T")[0],
                      end: today.toISOString().split("T")[0],
                    });
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const startOfMonth = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      1,
                    );
                    setTempDateRange({
                      start: startOfMonth.toISOString().split("T")[0],
                      end: today.toISOString().split("T")[0],
                    });
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                >
                  This Month
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const startOfYear = new Date(today.getFullYear(), 0, 1);
                    setTempDateRange({
                      start: startOfYear.toISOString().split("T")[0],
                      end: today.toISOString().split("T")[0],
                    });
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                >
                  This Year
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const yesterday = new Date(
                      today.getTime() - 24 * 60 * 60 * 1000,
                    );
                    setTempDateRange({
                      start: yesterday.toISOString().split("T")[0],
                      end: today.toISOString().split("T")[0],
                    });
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                >
                  Last 2 Days
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsDateModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDateRangeApply}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
