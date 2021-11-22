import axios from "axios";

export const dummyData = [
  {
    "adult": false,
    "backdrop_path": "/mqYP8KJ0lrLcSzghe3o27mbciaU.jpg",
    "genre_ids": [
      12,
      18
    ],
    "id": 8358,
    "original_language": "en",
    "original_title": "Cast Away",
    "overview": "Chuck Nolan, a top international manager for FedEx, and Kelly, a Ph.D. student, are in love and heading towards marriage. Then Chuck's plane to Malaysia crashes at sea during a terrible storm. He's the only survivor, and finds himself marooned on a desolate island. With no way to escape, Chuck must find ways to survive in his new home.",
    "popularity": 32.668,
    "poster_path": "/4x4puNUAqBpi9sUMYL5dNPSdB6I.jpg",
    "release_date": "2000-12-22",
    "title": "Cast Away",
    "video": false,
    "vote_average": 7.6,
    "vote_count": 8391
  },
  {
    "adult": false,
    "backdrop_path": null,
    "genre_ids": [
      35
    ],
    "id": 31389,
    "original_language": "en",
    "original_title": "Miss Cast Away",
    "overview": "A plane carrying beauty contestants crash lands on a deserted island. Captain Maximus Powers and co-pilot Mike Saunders have to take care of their passengers, while avoiding the dangers of Jurassic Pork (a giant prehistoric pig) and a group of apes busy trying to relaunch Noah's Ark.",
    "popularity": 8.587,
    "poster_path": "/94TaGwJhO2KaMWXDLgauPH6zZTn.jpg",
    "release_date": "2004-01-01",
    "title": "Miss Cast Away",
    "video": false,
    "vote_average": 2.5,
    "vote_count": 15
  },
  {
    "adult": false,
    "backdrop_path": null,
    "genre_ids": [],
    "id": 56285,
    "original_language": "en",
    "original_title": "Behind the Scenes: Cast Away",
    "overview": "",
    "popularity": 6.754,
    "poster_path": null,
    "release_date": "2000-01-01",
    "title": "Behind the Scenes: Cast Away",
    "video": false,
    "vote_average": 1,
    "vote_count": 1
  },
  {
    "adult": false,
    "backdrop_path": null,
    "genre_ids": [
      12,
      18
    ],
    "id": 534416,
    "original_language": "en",
    "original_title": "Cast Away",
    "overview": "A rich American businessman and the world's top developer, John Smith is on his way to Puerto Rico from New York City to build a new hotel when a big storm hits his plane as he is flying over Bermuda. The plane goes down and crashes somewhere in the ocean, near Gusto island. John Smith survives the crash and is left alone on the island, with God as his only companion...",
    "popularity": 2.117,
    "poster_path": null,
    "release_date": "2017-12-06",
    "title": "Cast Away",
    "video": false,
    "vote_average": 0,
    "vote_count": 0
  }
];

export default function App() {
  const [movieSuggestions, setMoviesSuggestions] = useState(dummyData);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [ignoredMovies, setIgnoredMovies] = useState([]);
  const [query, setQuery] = useState('');

  async function search(movie) {
    const response = await axios.get(`/test-api/search/${movie}`);
    setMoviesSuggestions(response.data);
  }

  async function getSuggestions() {
    const response = await axios.post(`/test-api/suggestions`, { selected: selectedMovies, ignored: ignoredMovies });
    setMoviesSuggestions(response.data);
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex' }}>
        <input
          placeholder="Search for a film"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyUp={e => {
            console.log(event.key === 13)
            if (event.key === 13) {
              setQuery(e.target.value);
            }
          }}
        />
        <button onClick={() => search(query)}>Search!</button>
        <button style={{ marginLeft: '20px' }} onClick={getSuggestions}>Suggestions from {selectedMovies.length} movies</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {movieSuggestions && movieSuggestions.map(movie => (
          <Movie
            key={movie.id}
            movie={movie}
            selected={selectedMovies.includes(movie.id)}
            ignored={ignoredMovies.includes(movie.id)}
            onContextMenu={e => {
              e.preventDefault();
              setIgnoredMovies(prevState => togglePresenceInlist(prevState, movie.id));
              setSelectedMovies(prevState => prevState.filter(id => id !== movie.id));
            }}
            onClick={() => {
              setSelectedMovies(prevState => togglePresenceInlist(prevState, movie.id));
              setIgnoredMovies(prevState => prevState.filter(id => id !== movie.id));
            }}
          />
        ))}
      </div>
    </div>
  );
}

function togglePresenceInlist(list, item) {
  if (list.includes(item)) {
    return list.filter(i => i !== item);
  } else {
    return [...list, item];
  }
}

function Movie(props) {
  const borderColor = props.selected ? 'lightgrey' : 'white';
  return (
    <div onContextMenu={props.onContextMenu} onClick={props.onClick} style={{ position: 'relative', userSelect: 'none', border: '5px dashed', borderColor, margin: '0 10px', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img style={{ display: props.ignored ? 'block' : 'none', width: '100%' }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/1200px-Red_X.svg.png"/>
      </div>
      <Poster path={props.movie.poster_path}/>
      <span style={{ width: '150px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{props.movie.title}</span>
    </div>
  );
}

function Poster(props) {
  if (props.path) {
    return <img style={{ width: '150px', height: '225px' }} src={`https://image.tmdb.org/t/p/original${props.path}`}/>
  } else {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '150px', height: '225px', backgroundColor: '#dbdbdb', alignItems: 'center' }}>
        <img style={{ width: '75px' }} src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"/>
      </div>
    )
  }
}
