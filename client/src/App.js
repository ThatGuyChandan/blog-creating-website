import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Outlet from "./components/Outlet";
// import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { UserContextProvider } from "./components/UserContext";
function App() {
  return (
    <UserContextProvider>
      <React.Fragment>
        <main>
          <Navbar />
        </main>
        <Outlet /> {/*routes */}
        <BackToTop />
        {/* <Footer /> */}
      </React.Fragment>
    </UserContextProvider>
  );
}

export default App;
