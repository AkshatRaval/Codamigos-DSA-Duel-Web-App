import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";

// ... (Your existing fetch thunks) ...

// 1. SEND Request
export const sendFriendRequest = createAsyncThunk(
  "friends/sendRequest",
  async ({ myUid, friendUid }, { rejectWithValue }) => {
    try {
      await Promise.all([
        updateDoc(doc(db, "users", myUid), { outgoingFriendReq: arrayUnion(friendUid) }),
        updateDoc(doc(db, "users", friendUid), { incomingFriendReq: arrayUnion(myUid) })
      ]);
      return friendUid; 
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// 2. ACCEPT Request
export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptRequest",
  async ({ myUid, friendRequest }, { rejectWithValue }) => {
    try {
      const friendUid = friendRequest.id || friendRequest.uid;
      await Promise.all([
        updateDoc(doc(db, "users", myUid), { 
          incomingFriendReq: arrayRemove(friendUid), 
          friends: arrayUnion(friendUid) 
        }),
        updateDoc(doc(db, "users", friendUid), { 
          outgoingFriendReq: arrayRemove(myUid), 
          friends: arrayUnion(myUid) 
        })
      ]);
      return friendRequest; // Return whole object to add to friends list
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// 3. IGNORE Request (Decline)
export const ignoreFriendRequest = createAsyncThunk(
  "friends/ignoreRequest",
  async ({ myUid, friendUid }, { rejectWithValue }) => {
    try {
      await Promise.all([
        updateDoc(doc(db, "users", myUid), { incomingFriendReq: arrayRemove(friendUid) }),
        updateDoc(doc(db, "users", friendUid), { outgoingFriendReq: arrayRemove(myUid) })
      ]);
      return friendUid;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// 4. CANCEL Request (Take back)
export const cancelFriendRequest = createAsyncThunk(
  "friends/cancelRequest",
  async ({ myUid, friendUid }, { rejectWithValue }) => {
    try {
      await Promise.all([
        updateDoc(doc(db, "users", myUid), { outgoingFriendReq: arrayRemove(friendUid) }),
        updateDoc(doc(db, "users", friendUid), { incomingFriendReq: arrayRemove(myUid) })
      ]);
      return friendUid;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// 5. REMOVE Friend
export const removeFriend = createAsyncThunk(
  "friends/removeFriend",
  async ({ myUid, friendUid }, { rejectWithValue }) => {
    try {
      await Promise.all([
        updateDoc(doc(db, "users", myUid), { friends: arrayRemove(friendUid) }),
        updateDoc(doc(db, "users", friendUid), { friends: arrayRemove(myUid) })
      ]);
      return friendUid;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// --- HANDLE STATE UPDATES IN EXTRA REDUCERS ---
const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    friendsList: [],
    incomingReqs: [],
    outgoingReqs: [],
    discoverUsers: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Accept: Remove from incoming, Add to friends
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const req = action.payload;
        state.incomingReqs = state.incomingReqs.filter(u => u.id !== (req.id || req.uid));
        state.friendsList.push({ ...req, status: "Offline" }); // Optimistic add
      })
      // Send: Add ID to outgoing
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
    
        state.discoverUsers = state.discoverUsers.filter(u => u.uid !== action.payload);
      })
      // Ignore: Remove from incoming
      .addCase(ignoreFriendRequest.fulfilled, (state, action) => {
        state.incomingReqs = state.incomingReqs.filter(u => u.id !== action.payload);
      })
      // Cancel: Remove from outgoing
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.outgoingReqs = state.outgoingReqs.filter(u => u.id !== action.payload);
      })
      // Remove: Filter out of friends list
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.friendsList = state.friendsList.filter(f => f.uid !== action.payload);
      });
  },
});

export default friendsSlice.reducer;