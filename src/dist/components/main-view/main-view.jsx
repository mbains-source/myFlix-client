import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: "The Shawshank Redemption",
            image: "https://en.wikipedia.org/wiki/The_Shawshank_Redemption#/media/File:ShawshankRedemptionMoviePoster.jpg",
            description: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
            director: "Frank Darabont",
            genre: "Drama"
        },
        {
            id: 2,
            title: "The Godfather",
            image: "https://en.wikipedia.org/wiki/The_Godfather#/media/File:Godfather_ver1.jpg",
            description: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
            director: "Francis Ford Coppola",
            genre: "Gangster"
        },
        {
            id: 3,
            title: "The Dark Knight",
            image: "https://en.wikipedia.org/wiki/The_Dark_Knight#/media/File:The_Dark_Knight_(2008_film).jpg",
            description: "Michael, Vito Corleone's son, attempts to expand his family's criminal empire. While he strikes a business deal with gangster Hyman Roth, he remains unaware of the lurking danger.",
            director: "Christopher Nolan",
            genre: "Superhero"
        },
        {
          id: 4,
          title: "The Godfather Part II",
          image: "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
          description: "Michael, Vito Corleone's son, attempts to expand his family's criminal empire. While he strikes a business deal with gangster Hyman Roth, he remains unaware of the lurking danger.",
          director: "Francis Ford Coppola",
          genre: "Gangster"
        },
        {
          id: 5,
          title: "12 Angry Men",
          image: "https://en.wikipedia.org/wiki/12_Angry_Men_(1957_film)#/media/File:12_Angry_Men_(1957_film_poster).jpg",
          description: "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.",
          director: "Sidney Lumet",
          genre: "Drama"
        },
        {
          id: 6,
          title: "Schindlers List",
          image: "https://www.imdb.com/title/tt0108052/mediaviewer/rm1610023168/?ref_=tt_ov_i",
          description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
          director: "Steven Spielberg",
          genre: "Historical Drama"
        },        
        {
        id: 7,
        title: "The Lord of the Rings: The Return of the King",
        image: "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings:_The_Return_of_the_King#/media/File:The_Lord_of_the_Rings_-_The_Return_of_the_King_(2003).jpg",
        description: "Gandalf and Aragorn lead the World of Men against Saurons army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        director: "Peter Jackson",
        genre: "Fantasy"
       },
       {
        id: 8,
        title: "Pulp Fiction",
        image: "https://en.wikipedia.org/wiki/Pulp_Fiction#/media/File:Pulp_Fiction_(1994)_poster.jpg",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        director: "Quentin Tarantino",
        genre: "Crime"
       },
       {
        id: 9,
        title: "The Lord of the Rings: The Fellowship of the Ring",
        image: "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring#/media/File:The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_(2001).jpg",
        description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        director: "Peter Jackson",
        genre: "Fantasy"
      },        
      {
      id: 10,
      title: "The Good, The Bad, and The Ugly",
      image: "https://en.wikipedia.org/wiki/The_Good,_the_Bad_and_the_Ugly#/media/File:Good_the_bad_and_the_ugly_poster.jpg",
      description: "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
      director: "Clint Eastwood",
      genre: "Western"
     },

    ]);

    const [selctedMovie, setSelectedMovie] = useState(null);

    if (selctedMovie) {
        return (
            <MovieView movie={selctedMovie} onBackClick={() => setSelectedMovie(null)} />
        ); 
    }

    if (movies.length === 0) {
        return <div>This list is empty!</div>;
    }

    return (
        <div>
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onMovieClick={(newSelectedMovie) => {
                        setSelectedMovie(newSelectedMovie);
                    }}
                />
            ))
            }
        </div>
    );
};