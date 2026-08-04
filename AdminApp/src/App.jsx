import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ModulesList from './pages/ModulesList';
import ModuleForm from './pages/ModuleForm';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/modules" replace />} />
          <Route path="/modules" element={<ModulesList />} />
          <Route path="/modules/new" element={<ModuleForm />} />
          <Route path="/modules/:id/edit" element={<ModuleForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
