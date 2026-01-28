import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ============================================
// ASYNC THUNKS
// ============================================

// Get Tasks Summary
export const fetchTasksSummary = createAsyncThunk(
  "tasks/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/tasks/summary`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks summary",
      );
    }
  },
);

// Get Member Birthdays
export const fetchMemberBirthdays = createAsyncThunk(
  "tasks/fetchMemberBirthdays",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        dateFilter = "today",
      } = params;
      const response = await axios.get(
        `${API_URL}/api/admin/tasks/members/birthdays`,
        {
          params: { page, limit, search, dateFilter },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch member birthdays",
      );
    }
  },
);

// Get Member Renewals
export const fetchMemberRenewals = createAsyncThunk(
  "tasks/fetchMemberRenewals",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        status = "all",
        daysRange = 7,
      } = params;
      const response = await axios.get(
        `${API_URL}/api/admin/tasks/members/renewals`,
        {
          params: { page, limit, search, status, daysRange },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch member renewals",
      );
    }
  },
);

// Get Member Payments Due
export const fetchMemberPaymentsDue = createAsyncThunk(
  "tasks/fetchMemberPaymentsDue",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        amountFilter = "all",
      } = params;
      const response = await axios.get(
        `${API_URL}/api/admin/tasks/members/payments-due`,
        {
          params: { page, limit, search, amountFilter },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch member payments due",
      );
    }
  },
);

// Get Lead Follow-ups
export const fetchLeadFollowUps = createAsyncThunk(
  "tasks/fetchLeadFollowUps",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        dateFilter = "today",
        statusFilter = "all",
        priorityFilter = "all",
      } = params;
      const response = await axios.get(
        `${API_URL}/api/admin/tasks/leads/follow-ups`,
        {
          params: {
            page,
            limit,
            search,
            dateFilter,
            statusFilter,
            priorityFilter,
          },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lead follow-ups",
      );
    }
  },
);

// Get New Leads
export const fetchNewLeads = createAsyncThunk(
  "tasks/fetchNewLeads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "", daysRange = 7 } = params;
      const response = await axios.get(`${API_URL}/api/admin/tasks/leads/new`, {
        params: { page, limit, search, daysRange },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch new leads",
      );
    }
  },
);

// ============================================
// SLICE
// ============================================

const initialState = {
  // Summary
  summary: {
    members: {
      todayBirthdays: 0,
      expiredPackages: 0,
      expiringSoon: 0,
      pendingPayments: 0,
    },
    leads: {
      todayFollowUps: 0,
      overdueFollowUps: 0,
      newLeads: 0,
    },
  },
  summaryLoading: false,
  summaryError: null,

  // Member Birthdays
  memberBirthdays: [],
  memberBirthdaysLoading: false,
  memberBirthdaysError: null,
  memberBirthdaysPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },

  // Member Renewals
  memberRenewals: [],
  memberRenewalsLoading: false,
  memberRenewalsError: null,
  memberRenewalsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  memberRenewalsSummary: {
    expired: 0,
    expiringSoon: 0,
  },

  // Member Payments Due
  memberPaymentsDue: [],
  memberPaymentsDueLoading: false,
  memberPaymentsDueError: null,
  memberPaymentsDuePagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },

  // Lead Follow-ups
  leadFollowUps: [],
  leadFollowUpsLoading: false,
  leadFollowUpsError: null,
  leadFollowUpsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  leadFollowUpsSummary: {
    today: 0,
    overdue: 0,
    thisWeek: 0,
  },

  // New Leads
  newLeads: [],
  newLeadsLoading: false,
  newLeadsError: null,
  newLeadsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasksError: (state) => {
      state.summaryError = null;
      state.memberBirthdaysError = null;
      state.memberRenewalsError = null;
      state.memberPaymentsDueError = null;
      state.leadFollowUpsError = null;
      state.newLeadsError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks Summary
    builder
      .addCase(fetchTasksSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchTasksSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload.data;
      })
      .addCase(fetchTasksSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      });

    // Fetch Member Birthdays
    builder
      .addCase(fetchMemberBirthdays.pending, (state) => {
        state.memberBirthdaysLoading = true;
        state.memberBirthdaysError = null;
      })
      .addCase(fetchMemberBirthdays.fulfilled, (state, action) => {
        state.memberBirthdaysLoading = false;
        state.memberBirthdays = action.payload.data;
        state.memberBirthdaysPagination = action.payload.pagination;
      })
      .addCase(fetchMemberBirthdays.rejected, (state, action) => {
        state.memberBirthdaysLoading = false;
        state.memberBirthdaysError = action.payload;
      });

    // Fetch Member Renewals
    builder
      .addCase(fetchMemberRenewals.pending, (state) => {
        state.memberRenewalsLoading = true;
        state.memberRenewalsError = null;
      })
      .addCase(fetchMemberRenewals.fulfilled, (state, action) => {
        state.memberRenewalsLoading = false;
        state.memberRenewals = action.payload.data;
        state.memberRenewalsPagination = action.payload.pagination;
        state.memberRenewalsSummary = action.payload.summary;
      })
      .addCase(fetchMemberRenewals.rejected, (state, action) => {
        state.memberRenewalsLoading = false;
        state.memberRenewalsError = action.payload;
      });

    // Fetch Member Payments Due
    builder
      .addCase(fetchMemberPaymentsDue.pending, (state) => {
        state.memberPaymentsDueLoading = true;
        state.memberPaymentsDueError = null;
      })
      .addCase(fetchMemberPaymentsDue.fulfilled, (state, action) => {
        state.memberPaymentsDueLoading = false;
        state.memberPaymentsDue = action.payload.data;
        state.memberPaymentsDuePagination = action.payload.pagination;
      })
      .addCase(fetchMemberPaymentsDue.rejected, (state, action) => {
        state.memberPaymentsDueLoading = false;
        state.memberPaymentsDueError = action.payload;
      });

    // Fetch Lead Follow-ups
    builder
      .addCase(fetchLeadFollowUps.pending, (state) => {
        state.leadFollowUpsLoading = true;
        state.leadFollowUpsError = null;
      })
      .addCase(fetchLeadFollowUps.fulfilled, (state, action) => {
        state.leadFollowUpsLoading = false;
        state.leadFollowUps = action.payload.data;
        state.leadFollowUpsPagination = action.payload.pagination;
        state.leadFollowUpsSummary = action.payload.summary;
      })
      .addCase(fetchLeadFollowUps.rejected, (state, action) => {
        state.leadFollowUpsLoading = false;
        state.leadFollowUpsError = action.payload;
      });

    // Fetch New Leads
    builder
      .addCase(fetchNewLeads.pending, (state) => {
        state.newLeadsLoading = true;
        state.newLeadsError = null;
      })
      .addCase(fetchNewLeads.fulfilled, (state, action) => {
        state.newLeadsLoading = false;
        state.newLeads = action.payload.data;
        state.newLeadsPagination = action.payload.pagination;
      })
      .addCase(fetchNewLeads.rejected, (state, action) => {
        state.newLeadsLoading = false;
        state.newLeadsError = action.payload;
      });
  },
});

export const { clearTasksError } = taskSlice.actions;
export default taskSlice.reducer;
