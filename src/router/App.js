import { Route, Routes } from "react-router-dom";
import { Header, Sidebar } from "../components";
import { Profil, Error404 } from "../pages";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <Sidebar />
        <main>
          <Routes>
            <Route path={"/profil/:user"} element={<Profil />} />
            {<Route path={"/error"} element={<Error404 />} />}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
