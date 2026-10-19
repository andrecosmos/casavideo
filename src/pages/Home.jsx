import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  const fetchMovies = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  // 3. Atualize o seu useEffect que busca os filmes para escutar o selectedGenre
useEffect(() => {
  if (search.trim() !== '') {
    // Se houver busca por texto, ignora o gênero temporariamente
    fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}&language=pt-BR`);
  } else if (selectedGenre !== '') {
    // Se houver gênero selecionado, busca por gênero
    fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&language=pt-BR`);
  } else {
    // Padrão: filmes populares
    fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
  }
}, [search, selectedGenre]);


useEffect(() => {
  const fetchGenres = async () => {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    setGenres(data.genres || []);
  };
  fetchGenres();
}, []);

  return (
    <div className="app-container">
    <header className="header">
      {/* Nova div para agrupar o título e o input lado a lado */}
      <div className="header-top">
        <h1>🍿 CasaVideo</h1>
        <input 
          type="text"
          className="search-input" // Certifique-se de adicionar esta classe
          placeholder="Pesquisar filmes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {/* Barra de Filtros por Categoria */}
      <div className="genres-filter-bar">
        <button 
          onClick={() => { setSelectedGenre(''); setSearch(''); }}
          className={selectedGenre === '' ? 'active-genre' : ''}
        >
          Todos
        </button>
        {genres.map(genre => (
          <button 
            key={genre.id} 
            onClick={() => { setSelectedGenre(genre.id); setSearch(''); }}
            className={selectedGenre === genre.id ? 'active-genre' : ''}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </header>

      <main className="catalog-grid">
        {movies.map((movie) => (
          /* O Link redireciona para a rota com o ID dinâmico do filme */
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            {movie.poster_path ? (
              <img src={`${IMAGE_URL}${movie.poster_path}`} alt={movie.title} />
            ) : (
              <div className="no-image">Sem imagem</div>
            )}
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>⭐ {movie.vote_average.toFixed(1)}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
