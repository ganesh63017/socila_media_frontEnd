import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store, persistor } from "./Components/Redux/Reducer";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/* wrap the main component inside persist gate. This will delay our apps UI till the persisted state has been saved to redux */}
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//file conversion
// let formData = new FormData();
// formData.append("posted_photos", event.target.files[0]);
// formData.append("caption", "htting");
// formData.append("likes", '[]');

// console.log(event.target.files[0]);

// const url = "http://localhost:8080/feeds/posts";

// const options = {
//   method: "POST",
//   headers: {
//     // "Content-type": "",
//     authorization: `Bearer ${userData.token}`,
//   },
//   body: formData,
// };

// const response = await fetch(url, options);
// console.log(response);
