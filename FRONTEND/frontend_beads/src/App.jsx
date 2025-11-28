import {Route, Routes ,Navigate} from "react-router-dom"

import HomePage from "./pages/main_pages/HomePage";
import CartPage from './pages/main_pages/CartPage';

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<HomePage />} />




      </Routes>
    </>
  );
}

export default App;