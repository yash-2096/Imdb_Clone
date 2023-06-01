"use strict";
(function () {
  const searchTerm = document.getElementById("searchBar");
  const movieslideContainer = document.getElementById("movieslide-box");
  const likedboxContainer = document.getElementById("favlistbox-container");
  const movieboxtext = document.getElementById("moviebox-empty");
  const showfavcontainer = document.getElementById("favbox-section");
  const swapEmptyText = document.getElementById("empty-fav-text");

  addToFavDOM();
  viewVoidText();
  let movieSearchList = [];
  let likedMovieArray = [];

  searchTerm.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

  function viewVoidText() {
    if (likedboxContainer.innerHTML == "") {
      swapEmptyText.style.display = "block";
    } else {
      swapEmptyText.style.display = "none";
    }
  }

  // Event listner on search
  searchTerm.addEventListener("keyup", function () {
    let search = searchTerm.value;
    if (search === "") {
      movieboxtext.style.display = "block";
      movieslideContainer.innerHTML = "";
      // clears the previous movies from array
      movieSearchList = [];
    } else {
      movieboxtext.style.display = "none";
      (async () => {
        let data = await callMovieName(search);
        searchedMovieBoxStr(data);
      })();

      movieslideContainer.style.display = "grid";
    }
  });

  // Fetches data from api and calls function to add it in
  async function callMovieName(search) {
    const url = `https://www.omdbapi.com/?t=${search}&apikey=d19cd846`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Shows in searched movie container DOM
  function searchedMovieBoxStr(data) {
    document.getElementById("empty-fav-text").style.display = "none";
    let isPresent = false;

    // to check if the movie is already present in the movieSearchList array
    movieSearchList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    if (!isPresent && data.Title != undefined) {
      if (data.Poster == "N/A") {
        data.Poster = "./images/not-found.png";
      }
      movieSearchList.push(data);
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");
      
// Movie Card Details starts from here 
      movieCard.innerHTML = `
        <div class="card my-2" data-id = " ${data.Title} ">
        <a href="about.html" >
          <img
            src="${data.Poster} "
            class="card-img-top"
            alt="..."
            data-id = "${data.Title} "
          />
          <div class="card-body text-start">
            <h5 class="card-title" >
              <a href="about.html" data-id = "${data.Title} "> ${data.Title}  </a>
            </h5>

            <p class="card-text">
              <i class="fa-solid fa-star">
                <span id="rating">&nbsp;${data.imdbRating}</span>
              </i>

              <button class="fav-btn">
                <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
              </button>
            </p>
          </div>
        </a>
      </div>
    `;
      movieslideContainer.prepend(movieCard);
    }
  }

  // Add to favourite of localStorage
  async function favBtnWorking(e) {
    const target = e.target;

    let data = await callMovieName(target.dataset.id);

    let favMoviesLocal = localStorage.getItem("favMoviesList");

    if (favMoviesLocal) {
      likedMovieArray = Array.from(JSON.parse(favMoviesLocal));
    } else {
      localStorage.setItem("favMoviesList", JSON.stringify(data));
    }

    // to check if movie is already present in the fav list
    let isPresent = false;
    likedMovieArray.forEach((movie) => {
      if (data.Title == movie.Title) {
        notify("Duplicate Entry");
        isPresent = true;
      }
    });

    if (!isPresent) {
      likedMovieArray.push(data);
    }

    localStorage.setItem("favMoviesList", JSON.stringify(likedMovieArray));
    isPresent = !isPresent;
    addToFavDOM();
  }

  // Add to favourite list DOM
  function addToFavDOM() {
    likedboxContainer.innerHTML = "";

    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    if (favList) {
      favList.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add(
          "fav-movie-card",
          "d-flex",
          "justify-content-between",
          "align-content-center",
          "my-2"
        );
// Favourite (FAV LIST) movie card starts here 
    div.innerHTML = ` 
    <img
      src="${movie.Poster}"
      alt=""
      class="fav-movie-poster"
    />
    <div class="movie-card-details">
      <p class="movie-name mt-3 mb-0">
       <a href = "about.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}<a> 
      </p>
      <small class="text-muted">${movie.Year}</small>
    </div>

    <div class="delete-btn my-4">
        <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
    </div>
    `;

        likedboxContainer.prepend(div);
      });
    }
  }

  // To notify
  function notify(text) {
    window.alert(text);
  }

  // Delete from favourite list
  function removeMovie(name) {
    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    let updatedList = Array.from(favList).filter((movie) => {
      return movie.Title != name;
    });

    localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

    addToFavDOM();
    viewVoidText();
  }

  // Handles click events
  async function handleClickListner(e) {
    const target = e.target;

    if (target.classList.contains("add-fav")) {
      e.preventDefault();
      favBtnWorking(e);
    } else if (target.classList.contains("fa-trash-can")) {
      removeMovie(target.dataset.id);
    } else if (target.classList.contains("fa-bars")) {
      if (showfavcontainer.style.display == "flex") {
        document.getElementById("favlist-section").style.color = "white";
        showfavcontainer.style.display = "none";
      } else {
        document.getElementById("favlist-section").style.color = "goldenrod";
        showfavcontainer.style.display = "flex";
      }
    }

    localStorage.setItem("movieName", target.dataset.id);
  }

  // Event listner on whole document
  document.addEventListener("click", handleClickListner);
})();