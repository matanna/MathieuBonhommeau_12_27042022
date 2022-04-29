import {Route, Routes} from "react-router-dom";
import { Profil, Error404 } from "../pages";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path={"/profil"} element={<Profil/>} />
            <Route path="*" element={<Error404/> } />
        </Routes>
    </div>
  );
}

export default App;
