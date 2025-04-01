import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './functionality/UserContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Authorization from './pages/Authorization';
import Home from './pages/Home';
import './App.css'
import OrgChartWrapper from './components/OrgChart/OrgChartWrapper';

export default function App() {
  const { user } = useContext(UserContext) || { user: null }; 
  
  return (
    <div className="App">
      <Router>
        <Header />
          <Routes>
            <Route path="/auth" element={<Authorization />} />
            <Route path="/" element={<Home />} />
            {user && <Route path="/org" element={<OrgChartWrapper />} />}
          </Routes>
        <Footer />
      </Router>
    </div>
  );
}