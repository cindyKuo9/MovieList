const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"

const dataPanel = document.querySelector("#data-panel")
const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || []
const searchForm = document.querySelector("#search-form")
const searhInput = document.querySelector("#search-input")

function renderMovieList(data) {
  let rawHTML = ""
  data.forEach(item => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}" >More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}" >X</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  axios.get(INDEX_URL + id).then(function (response) {
    const movieTitle = document.querySelector("#movie-modal-title")
    const movieDescription = document.querySelector("#movie-modal-description")
    const movieDate = document.querySelector("#movie-modal-date")
    const movieImage = document.querySelector("#movie-modal-image")
    const item = response.data.results

    movieTitle.innerText = item.title
    movieDescription.innerText = item.release_date
    movieDescription.innerText = item.description
    movieImage.innerHTML = `<img src="${POSTER_URL + item.image}" alt="movie-poster" class="img-fluid">`
  })
    .catch(function (err) {
      console.log(err)
    })
}

function removeFavorite(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex < 0) {
    return;
  }

  movies.splice(movieIndex, 1)
  localStorage.setItem("favoriteMovies", JSON.stringify(movies))
  renderMovieList(movies)  
}


renderMovieList(movies)
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFavorite(Number(event.target.dataset.id))
  }
})






