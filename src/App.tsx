import Header from "./components/Header";
import Main from "./views/Main";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Departments from "./views/Departments";
// import Navbar from "./components/Navbar";
import Technicians from "./views/Technicians";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <Navbar /> */}
      <Switch>
        <Route path="/departments">
          <Departments />
        </Route>
        <Route path="/technicians">
          <Technicians />
        </Route>
        <Route path="/">
          <Main className="py-5" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
