import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import PaymentSuccess from "./PaymentSuccess";
import SellSuccess from './SellSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/sellSuccess" element={<SellSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;