import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ModulesList from './pages/ModulesList';
import ModuleForm from './pages/ModuleForm';
import UnitsList from './pages/UnitsList';
import UnitForm from './pages/UnitForm';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/modules" replace />} />
          <Route path="/modules" element={<ModulesList />} />
          <Route path="/modules/new" element={<ModuleForm />} />
          <Route path="/modules/:id/edit" element={<ModuleForm />} />
          <Route path="/units" element={<UnitsList />} />
          <Route path="/units/new" element={<UnitForm />} />
          <Route path="/units/:id/edit" element={<UnitForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
