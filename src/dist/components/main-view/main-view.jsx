import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

function MainView() {
	const [movies, setMovies] = useState([]);

	const [selectedMovie, setSelectedMovie] = useState(null);

	useEffect(() => {
		const fetchMovieData = async () => {
			const fetchedData = await fetch('https://myflixmantajbains.herokuapp.com/');
			const data = await fetchedData.json();
			const moviesFromAPI = data.map((movie) => {
				return {
					id: movie._id,
					title: movie.Title,
					image: movie.ImagePath,
					description: movie.Description,
					actors: movie.Actors,
					genre: {
						name: movie.Genre.Name,
						description: movie.Genre.Description,
					},
					director: {
						name: movie.Director.Name,
						bio: movie.Director.Bio,
					},
				};
			});

			setMovies(moviesFromAPI);
		};

		fetchMovieData();
	}, []);

	// Display selected movie details and similar movie cards
	function displayMovieView() {
		let similarMovies = movies.filter((movie) => {
			return movie.id !== selectedMovie.id && movie.genre.name == selectedMovie.genre.name;
		});

		return (
			<>
				<MovieView
					movie={selectedMovie}
					onBackClick={() => {
						setSelectedMovie(null);
					}}
				/>
				<br />
				<h2>Similar Movies</h2>
				{similarMovies.map((movie) => (
					<MovieCard
						key={movie.id}
						movie={movie}
						onClick={(newSelectedMovie) => {
							setSelectedMovie(newSelectedMovie);
						}}
					/>
				))}
			</>
		);
	}

	// Display MovieView if there is a selected movie, and display MovieCard list if there is none selected.
	return (
		<div>
			{selectedMovie ? (
				displayMovieView()
			) : movies.length ? (
				movies.map((movie) => (
					<MovieCard
						key={movie.id}
						movie={movie}
						onClick={(newSelectedMovie) => {
							setSelectedMovie(newSelectedMovie);
						}}
					/>
				))
			) : (
				<div>The Movie list is empty!</div>
			)}
		</div>
	);
}

export default MainView;