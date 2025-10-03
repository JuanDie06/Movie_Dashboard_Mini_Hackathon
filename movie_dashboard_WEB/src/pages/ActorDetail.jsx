import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actorsAPI } from '../services/api';
import { Calendar, MapPin, Star, User, Film, ArrowLeft } from 'lucide-react';

export default function ActorDetail() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActorDetails();
  }, [id]);

  const fetchActorDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch actor details
      const actorResponse = await actorsAPI.getById(id);
      setActor(actorResponse.data);

      // Fetch actor's movies
      const moviesResponse = await actorsAPI.getMovies(id);
      setMovies(moviesResponse.data || []);
    } catch (err) {
      console.error('Error fetching actor:', err);
      setError('Failed to load actor details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateAge = (birthday, deathday = null) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
          <div className="text-lg text-[var(--color-text-muted)]">Loading actor details...</div>
        </div>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <div className="text-rose-400 text-xl mb-4">{error || 'Actor not found'}</div>
          <Link to="/actors" className="btn-primary">
            Back to Actors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Profile */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-[var(--color-border)]">
        <div className="container-app py-12">
          {/* Back Button */}
          <Link
            to="/actors"
            className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Actors</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {actor.profile_path || actor.profile_url ? (
                <img
                  src={actor.profile_url || `https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  alt={actor.name}
                  className="w-64 h-96 object-cover rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-64 h-96 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center">
                  <User size={96} className="text-[var(--color-text-muted)]" />
                </div>
              )}
            </div>

            {/* Actor Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                {actor.name}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-white/90 mb-6">
                {actor.known_for_department && (
                  <div className="flex items-center gap-2">
                    <Film size={16} />
                    <span>{actor.known_for_department}</span>
                  </div>
                )}

                {actor.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {formatDate(actor.birthday)}
                      {actor.deathday && ` - ${formatDate(actor.deathday)}`}
                      {' '}
                      {actor['alive?'] !== false && actor.age && `(Age ${actor.age})`}
                      {actor.deathday && actor.age && `(Died at ${calculateAge(actor.birthday, actor.deathday)})`}
                    </span>
                  </div>
                )}

                {actor.place_of_birth && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{actor.place_of_birth}</span>
                  </div>
                )}

                {actor.popularity && (
                  <div className="flex items-center gap-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span>Popularity: {parseFloat(actor.popularity).toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Biography */}
              {actor.biography && actor.biography.trim() !== '' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">Biography</h2>
                  <p className="text-white/80 leading-relaxed whitespace-pre-line">
                    {actor.biography}
                  </p>
                </div>
              )}

              {!actor.biography || actor.biography.trim() === '' && (
                <p className="text-white/60 italic">No biography available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filmography Section */}
      <div className="container-app py-12">
        <div className="mb-6">
          <h2 className="heading-section mb-2">Filmography</h2>
          <p className="text-[var(--color-text-muted)]">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="card p-12 text-center">
            <Film size={64} className="mx-auto mb-4 text-[var(--color-text-muted)]" />
            <p className="text-xl text-[var(--color-text-muted)]">
              No movies found in the database for this actor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => {
              // Find character name and cast order for this actor
              const movieActor = movie.movie_actors?.find(ma => ma);
              const characterName = movieActor?.character_name;
              const castOrder = movieActor?.cast_order;

              return (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="card overflow-hidden hover:shadow-xl transition group"
                >
                  {/* Movie Poster */}
                  <div className="relative overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                        <Film size={48} className="text-[var(--color-text-muted)]" />
                      </div>
                    )}

                    {/* Rating Badge */}
                    {movie.vote_average && (
                      <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {parseFloat(movie.vote_average).toFixed(1)}
                      </div>
                    )}

                    {/* Lead Role Badge */}
                    {castOrder !== undefined && castOrder < 3 && (
                      <div className="absolute top-2 left-2 bg-[var(--color-primary)] text-white px-2 py-1 rounded-lg text-xs font-bold">
                        Lead Role
                      </div>
                    )}
                  </div>

                  {/* Movie Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-[var(--color-text)] mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {movie.title}
                    </h3>

                    {/* Character Name */}
                    {characterName && (
                      <p className="text-sm text-[var(--color-text-muted)] mb-2 italic">
                        as {characterName}
                      </p>
                    )}

                    {/* Release Date & Genres */}
                    <div className="text-xs text-[var(--color-text-muted)] space-y-1">
                      {movie.release_date && (
                        <div>{new Date(movie.release_date).getFullYear()}</div>
                      )}

                      {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre.id}
                              className="px-2 py-0.5 bg-white/10 rounded text-[var(--color-text-muted)]"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

