import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getTweetUrl = 'http://localhost:8082/tweet/getAllTweets';
const addTweetUrl = 'http://localhost:8082/tweet/addTweet';
const getMyTweetsUrl = 'http://localhost:8082/tweet/getTweetsByUserId';
const getAllUsersUrl = 'http://localhost:8082/tweet/getAllUsers';
const searchUserURL = 'http://localhost:8082/tweet/searchByUserName';
const likeTweetURL = 'http://localhost:8082/tweet/likeTweet';
const replyTweetURL = 'http://localhost:8082/tweet/replyTweet';
const editTweetURL = 'http://localhost:8082/tweet/updateTweet';
const deleteTweetURL = 'http://localhost:8082/tweet/deleteTweet';

const initialState = {
  isLoading: false,
  tweets: [],
  myTweets: [],
  allUsers: [],
  searchUserResults: [],
};

export const getTweets = createAsyncThunk(
  'tweet/getTweets',
  async (reqBody, thunkAPI) => {
    try {
      //   const authToken = reqBody.token;
      console.log('calling tweet api');
      const resp = await axios.get(getTweetUrl, {
        headers: {
          Authorization: reqBody,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      return resp.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);

export const addTweet = createAsyncThunk(
  'tweet/addTweet',
  async (reqBody, thunkAPI) => {
    try {
      const res = await axios.post(addTweetUrl, reqBody.body, {
        headers: {
          Authorization: reqBody.token,
        },
      });
      return res;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);

export const getMyTweets = createAsyncThunk(
  'tweet/getMyTweetsgetMyTweets',
  async (reqBody, thunkAPI) => {
    try {
      const res = await axios.get(`${getMyTweetsUrl}/${reqBody.userId}`, {
        headers: {
          Authorization: reqBody.token,
        },
      });
      return res;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'tweet/getAllUsers',
  async (reqBody, thunkAPI) => {
    try {
      const res = await axios.get(getAllUsersUrl, {
        headers: {
          Authorization: reqBody,
        },
      });
      return res;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);

export const searchUserByUsername = createAsyncThunk(
  'tweet/searchUserByUsername',
  async (reqBody, thunkAPI) => {
    try {
      const res = await axios.get(`${searchUserURL}/${reqBody.userInput}`, {
        headers: {
          Authorization: reqBody.token,
        },
      });
      return res;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);

export const likeTweet = createAsyncThunk(
  'likeTweet',
  async (reqBody, thunkAPI) => {
    try {
      const res = await axios.get(`${likeTweetURL}/${reqBody.tweetId}`, {
        headers: {
          Authorization: reqBody.token,
        },
      });
      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
    }
  }
);

export const tweetReply = createAsyncThunk('tweetReply', async (reqBody) => {
  try {
    const res = axios.post(
      `${replyTweetURL}/${reqBody.tweetId}`,
      reqBody.body,
      {
        headers: {
          Authorization: reqBody.token,
        },
      }
    );
    return res;
  } catch (err) {
    console.error(err);
  }
});

export const editTweet = createAsyncThunk('editTweet', async (reqBody) => {
  try {
    const res = await axios.post(editTweetURL, reqBody.body, {
      headers: {
        Authorization: reqBody.token,
      },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
});

export const deleteTweet = createAsyncThunk('deleteTweet', async (reqBody) => {
  try {
    const res = axios.get(`${deleteTweetURL}/${reqBody.tweetId}`, {
      headers: {
        Authorization: reqBody.token,
      },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
});

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    getTweetsData: (state, action) => {
      const details = action.payload;
      state.loginInput = details;
    },
  },
  extraReducers: {
    [getTweets.pending]: (state) => {
      state.isLoading = true;
    },
    [getTweets.fulfilled]: (state, action) => {
      state.tweets = action.payload;
    },
    [getTweets.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [addTweet.fulfilled]: (state, action) => {
      state.tweets = [...state.tweets, action.payload.data];
    },
    [getMyTweets.fulfilled]: (state, action) => {
      state.myTweets = action.payload.data;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.allUsers = action.payload.data;
    },
    [searchUserByUsername.fulfilled]: (state, action) => {
      state.searchUserResults = action.payload.data;
    },
    [likeTweet.fulfilled]: (state, action) => {
      state.tweets = state.tweets.map((t) => {
        if (t.tweetId === action.payload.data.tweetId) {
          t.hasLiked = action.payload.data.hasLiked;
          t.tweetLikes = action.payload.data.tweetLikes;
          t.tweetLikesCount = action.payload.data.tweetLikesCount;
          t.updateDateTime = action.payload.data.tweetLikesCount;
        }
        return t;
      });

      state.myTweets = state.myTweets.map((t) => {
        if (t.tweetId === action.payload.data.tweetId) {
          t.hasLiked = action.payload.data.hasLiked;
          t.tweetLikes = action.payload.data.tweetLikes;
          t.tweetLikesCount = action.payload.data.tweetLikesCount;
          t.updateDateTime = action.payload.data.tweetLikesCount;
        }
        return t;
      });
    },
    [tweetReply.fulfilled]: (state, action) => {
      state.tweets = state.tweets.map((t) => {
        if (t.tweetId === action.payload.data.tweetId) {
          t.tweetReply = action.payload.data.tweetReply;
          t.updateDateTime = action.payload.data.tweetLikesCount;
        }
        return t;
      });
      state.myTweets = state.myTweets.map((t) => {
        if (t.tweetId === action.payload.data.tweetId) {
          t.tweetReply = action.payload.data.tweetReply;
          t.updateDateTime = action.payload.data.tweetLikesCount;
        }
        return t;
      });
    },
    [editTweet.fulfilled]: (state, action) => {
      state.tweets = state.tweets.map((t) => {
        if (t.tweetId === action.payload.data.tweetId) {
          t.message = action.payload.data.message;
        }
        return t;
      });
      state.myTweets = state.myTweets.map((t) => {
        if (t.tweetId === action.payload.data.tweetId) {
          t.message = action.payload.data.message;
        }
        return t;
      });
    },
    [deleteTweet.fulfilled]: (state, action) => {
      state.tweets = state.tweets.filter(
        (item) => item.tweetId !== action.payload.data.tweetId
      );
      state.myTweets = state.myTweets.filter(
        (item) => item.tweetId !== action.payload.data.tweetId
      );
      
    },
  },
});

export const { handleLogin } = tweetSlice.actions;

export default tweetSlice.reducer;
