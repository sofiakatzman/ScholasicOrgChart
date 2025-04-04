import { BrowserRouter, Routes, Route } from 'react-router-dom';import { useContext } from 'react';
import { UserContext } from './functionality/UserContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Authorization from './pages/Authorization';
import Home from './pages/Home';
import './App.css'
import OrgChartWrapper from './components/OrgChart/OrgChartWrapper';
import OrgChartComponent from './components/OrgChart/OrgChartComponent';

export default function App() {
  const { user } = useContext(UserContext) || { user: null }; 
  
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/auth" element={<Authorization />} />
            <Route path="/" element={<Home />} />
            {user && <Route path="/org" element={<OrgChartWrapper />} />}
            {user && <Route path="/orgv2" element={<OrgChartComponent />} />}

          </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}