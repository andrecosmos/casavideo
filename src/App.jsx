import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Sem chaves {}
import MovieDetail from './pages/MovieDetail';


import './App.css'; // Mantém seus estilos globais

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
