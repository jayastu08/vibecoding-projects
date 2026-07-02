import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Dashboard, Creators, CreatorProfile, UploadData, Settings, Contact } from './pages';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/creators/:id" element={<CreatorProfile />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}
