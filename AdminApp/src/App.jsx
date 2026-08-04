import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LessonsList from './pages/LessonsList';
import LessonForm from './pages/LessonForm';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/lessons" replace />} />
          <Route path="/lessons" element={<LessonsList />} />
          <Route path="/lessons/new" element={<LessonForm />} />
          <Route path="/lessons/:id/edit" element={<LessonForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
