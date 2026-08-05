import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ModulesList from './pages/ModulesList';
import ModuleForm from './pages/ModuleForm';
import UnitsList from './pages/UnitsList';
import UnitForm from './pages/UnitForm';
import TimeSlotsList from './pages/TimeSlotsList';
import TimeSlotForm from './pages/TimeSlotForm';
import BookingsList from './pages/BookingsList';

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
          <Route path="/timeslots" element={<TimeSlotsList />} />
          <Route path="/timeslots/new" element={<TimeSlotForm />} />
          <Route path="/timeslots/:id/edit" element={<TimeSlotForm />} />
          <Route path="/bookings" element={<BookingsList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
