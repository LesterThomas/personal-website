import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import AboutPage from './pages/AboutPage';

/**
 * Main App component with HashRouter for GitHub Pages compatibility
 */
function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;

