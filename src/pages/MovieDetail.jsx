import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetail() {
  const { id } = useParams(); // Pega o ID passado na URL
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState('');
  

useEffect(() => {
  const fetchMovieDetail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=pt-BR`);
      const data = await response.json();
      setCast(data.cast ? data.cast.slice(0, 10) : []);
    } catch (error) {
      console.error("Erro ao buscar elenco:", error);
    }
  };

  // 2. NOVA CHAMADA: Busca os vídeos e trailers do filme
  const fetchVideos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=pt-BR`);
      const data = await response.json();
      
      // Filtra para encontrar um vídeo que seja do tipo "Trailer" e esteja no "YouTube"
      const officialTrailer = data.results?.find(
        video => video.type === "Trailer" && video.site === "YouTube"
      );
      
      // Se achar, salva a chave secreta ('key') do vídeo
      if (officialTrailer) {
        setTrailerKey(officialTrailer.key);
      } else {
        setTrailerKey(''); // Reseta se não houver trailer
      }
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
    }
  };

  fetchMovieDetail();
  fetchCredits();
  fetchVideos(); // Executa a busca do trailer
}, [id]);





    if (!movie) return <div style={{ padding: '20px', color: '#fff' }}>Carregando...</div>;

  return (
    <div className="movie-detail-container">

     <button className="back-button" onClick={() => window.location.href = '/'}>
        ← Voltar para o Início
      </button>

      {/* Área Principal: Filme e Detalhes */}
      <div className="movie-detail-main">
        <img 
          className="movie-detail-poster" 
          src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://placeholder.com'} 
          alt={movie.title} 
        />
        
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.release_date?.substring(0, 4)}</span>
          </div>
          <h2 className="movie-overview-title">Sinopse</h2>
          <p className="movie-overview">{movie.overview || "Nenhuma sinopse disponível."}</p>
        </div>
      </div>

   {/* Seção do Trailer (Versão Corrigida com Concatenação Direta) */}
{trailerKey ? (
  <div className="trailer-section">
    <h2>Trailer Oficial</h2>
    <div className="video-responsive">
      <iframe
        src={"https://www.youtube.com/embed/" + trailerKey} // <-- Alterado para o formato com o "+"
        title="Trailer do Filme"
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
) : (
  <div className="trailer-section">
    <h2>Trailer Oficial</h2>
    <p className="no-trailer">Nenhum trailer oficial disponível para este filme.</p>
  </div>
)}


     {cast.length > 0 && (
  <div className="cast-section">
    <h2>Elenco Principal</h2>
    <div className="cast-carousel">
      {cast.map(actor => {
        // 1. Usamos exatamente a mesma constante IMAGE_URL que já funciona no seu filme
        // Se o ator tiver profile_path, monta a URL dinâmica correta, senão usa o avatar fallback
        const actorImageUrl = actor.profile_path 
          ? `${IMAGE_URL}${actor.profile_path}`
          : 'https://unsplash.com';

        return (
          <div key={actor.id} className="cast-card">
            <img 
              src={actorImageUrl} 
              alt={actor.name} 
              onError={(e) => {
                // Se o link falhar ou o ator não tiver foto no TMDB, joga o avatar genérico na tela
                e.target.src = 'https://unsplash.com';
              }}
            />
            <div className="cast-info">
              <h3>{actor.name}</h3>
              <p>{actor.character}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


    </div>
  );
} // Fechamento do componente MovieDetail

