import { useEffect, useState } from "react";
import AppRoutes from "./Routing/AppRoutes";
import LoadingScreen from "./UI/LoadingScreen";
import { themeReady } from "./utils/Color";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    themeReady.then(() => {
      setReady(true);
    });
  }, []);

  // if (!ready) {
  //   return <LoadingScreen />;
  // }

  return <AppRoutes />;
}

export default App;
