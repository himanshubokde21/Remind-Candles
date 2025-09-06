import { useEffect } from "react";
import { requestPermission, functions } from "./firebase";  // Adjust path if needed

function App() {
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <div>
      <h1>Remind Candles</h1>
    </div>
  );
}

export default App;