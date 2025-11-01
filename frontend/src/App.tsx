import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/create" element={<CreateEvent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
