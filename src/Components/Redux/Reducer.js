import initialState from "./Store";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const Reducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case "userData":
      return { ...state, userData: payload };
    case "postData":
      return { ...state, postData: payload };
    case "commentsData":
      return { ...state, commentsData: payload };
    case "originalUserData":
      return { ...state, userData: { ...state.userData, user: payload } };
    case "commentsDataOfPost":
      return { ...state, commentsDataOfPost: payload };
    case "savedPost":
      return { ...state, savedPost: payload };
    case "clickedSave":
      return { ...state, clickedSave: payload };
    case "clickedHome":
      return { ...state, clickedHome: payload };
    case "loading":
      return { ...state, loading: payload };
    case "videoUpload":
      return {...state,videoUpload:payload}
      case "reels":
        return {...state,reels:payload}
    default:
      return state;
  }
};

//syntax of config file required for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

//change the redux reducer into a persisting reducer using config variable
const persistedReducer = persistReducer(persistConfig, Reducer);

//when creating store pass the persisting reducer instead of the regular redux reducer
export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//send the created store through persiststore (needed for redux-persist)
export const persistor = persistStore(store);
