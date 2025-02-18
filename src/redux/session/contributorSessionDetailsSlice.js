import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch session details action 
export const fetchSessionDetails = createAsyncThunk(
  'contributor-sessions/fetchSessionDetails',
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`https://ajozave-api.onrender.com/api/sessions/any/${sessionId}`, {
        // const response = await fetch(`http://localhost:4000/api/sessions/${sessionId}`, {

        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        return rejectWithValue('Session expired, please log in.');
      }

      if (!response.ok) {
        console.log("SEE RESPONSE", await response.json())
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

const contributorSessionDetailsSlice = createSlice({
  name: 'contributorSessionDetails',
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
  },
});

export const { setModalVisibility } = contributorSessionDetailsSlice.actions;
export default contributorSessionDetailsSlice.reducer;
