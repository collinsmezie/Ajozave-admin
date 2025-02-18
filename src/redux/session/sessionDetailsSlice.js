import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch session details action 
export const fetchSessionDetails = createAsyncThunk(
  'session/fetchSessionDetails',
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`https://ajozave-api.onrender.com/api/sessions/${sessionId}`, {
        // const response = await fetch(`http://localhost:4000/api/sessions/${sessionId}`, {

        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        return rejectWithValue('Session expired, please log in.');
      }

      if (!response.ok) {
        console.log("RESPONSwE", response)
        throw new Error('Failed to fetch session details');
      }

      const data = await response.json();
      console.log("fetchSessionDetails RESPONSE", data)
      return data.session;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// New deleteMember action
export const deleteMember = createAsyncThunk(
  'session/deleteMember',
  async ({ sessionId, memberId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(
        `https://ajozave-api.onrender.com/api/sessions/${sessionId}/members/${memberId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json(); // Parse the JSON response

      if (response.status === 401) {
        return rejectWithValue('Session expired, please log in.');
      }

      // Check if API responded with an error message inside the data object
      if (!response.ok || data.error) {
        console.error("API Error Response:", data);
        return rejectWithValue(data.error || data.message || 'Failed to delete member.');
      }

      return { memberId, response: data.response };
    } catch (err) {
      console.error("Unexpected Error:", err);
      return rejectWithValue(err.message);
    }
  }
);


// **New Action: Add members to a session**
export const addMembers = createAsyncThunk(
  'session/addMembers',
  async ({ sessionId, selectedMembers }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://ajozave-api.onrender.com/api/sessions/add-members', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: sessionId,
          members: selectedMembers,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        return rejectWithValue('Session expired, please log in.');
      }

      if (response.status === 400) {
        return rejectWithValue(data.error || 'Failed to add members.');
      }

      console.log("addMembers RESPONSE", data.session)

      return data.session; // Assuming API returns updated session data
    } catch (err) {
      return rejectWithValue('Failed to add members. Please try again later.');
    }
  }
);



const sessionDetailsSlice = createSlice({
  name: 'sessionDetails',
  initialState: {
    session: null,
    members: [],
    loading: false,
    error: null,
    showModal: false,
  },
  reducers: {
    setModalVisibility(state, action) {
      state.showModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch session details
      .addCase(fetchSessionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.members = action.payload.members;
      })
      .addCase(fetchSessionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload === 'Session expired, please log in.') {
          state.showModal = true;
        }
      })
      .addCase(addMembers.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload; // Update members list with new data
      })
      .addCase(addMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMember.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter(member => member.member._id !== action.payload.memberId);
        state.loading = false;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});

export const { setModalVisibility } = sessionDetailsSlice.actions;
export default sessionDetailsSlice.reducer;
