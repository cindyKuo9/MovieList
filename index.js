const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"

const dataPanel = document.querySelector("#data-panel")
const movies = []
let filterMovies = []
const searchForm = document.querySelector("#search-form")
const searhInput = document.querySelector("#search-input")
const MOVIE_PER_PAGE = 12
const paginator = document.querySelector("#paginator")

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}" >+</button>
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert("This movie is already added in favorite list.")
  }
  list.push(movie)
  localStorage.setItem("favoriteMovies", JSON.stringify(list))
}

function getMoviesByPage(page) {
  const data = filterMovies.length > 0 ? filterMovies : movies
  let startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}

function renderPagenator(amount) {
  let rawHTML = ''
  pageAmount = Math.ceil(amount / MOVIE_PER_PAGE)
  console.log(pageAmount)
  for (let page = 1; page <= pageAmount; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page} >${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

axios.get(INDEX_URL).then(function (response) {
  movies.push(...response.data.results)
  renderPagenator(movies.length)
  renderMovieList(getMoviesByPage(1))
  dataPanel.addEventListener("click", function onPanelClicked(event) {
    if (event.target.matches(".btn-show-movie")) {
      showMovieModal(event.target.dataset.id)
    } else if (event.target.matches(".btn-add-favorite")) {
      addToFavorite(Number(event.target.dataset.id))
    }
  })
})
  .catch(function (err) {
    console.log(err)
  })

paginator.addEventListener("click", function pagenatorOnClick(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

searchForm.addEventListener("submit", function submitOnSearchForm(event) {
  event.preventDefault();
  let keyword = searhInput.value.trim().toLowerCase()

  filterMovies = movies.filter(item => {
    return item.title.toLowerCase().includes(keyword)
  })

  if (filterMovies.length === 0) {
    return alert("Cannot find movies with keyword: " + keyword)
  }

  renderPagenator(filterMovies.length)
  renderMovieList(getMoviesByPage(1))
})





