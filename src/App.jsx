import { useEffect, useState } from "react";
import { requestPermission } from "./firebase";
import Home from "./components/Home";
import BirthdayList from "./components/BirthdayList";
import Settings from "./components/Settings";
import ErrorBoundary from "./ErrorBoundary";
import Login from "./components/Login"; // Import Login component

function App() {
  const [section, setSection] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    requestPermission();
  }, []);

  // Example: Show Login if user is not authenticated
  if (!user) {
    return <Login onLogin={() => setUser(true)} />;
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <header>
          <h1>Remind Candles</h1>
          <nav>
            <button onClick={() => setSection("home")}>Home</button>
            <button onClick={() => setSection("list")}>Birthdays</button>
            <button onClick={() => setSection("settings")}>Settings</button>
          </nav>
        </header>
        <main>
          {section === "home" && <Home />}
          {section === "list" && <BirthdayList />}
          {section === "settings" && <Settings />}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;