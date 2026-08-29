const global = {
  currentPage: window.location.pathname
}

//HIGHLIGHT ACTIVE LINKS 
function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.navLink');
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('activeLink');
    }
  })
}
//SHOW AND HIDE LOADING ICON
function showLoading() {
  document.querySelector('#loading').className = 'show';
}
function hideLoading() {
  document.querySelector('#loading').className = 'hide';
}


//DISPLAY POPULAR MOVIES FUNCTION
async function displayMovies(endpoint, parentElement, titleKey, dateKey) {
  const { results } = await fetchData(endpoint);
  results.forEach((movie) => {
    document.querySelector(parentElement).appendChild(createElements(movie, titleKey, dateKey));
  })
}
//CREAT ELEMENTS
function createElements(param, titleKey, dateKey) {
  const div = document.createElement('div');
  const image = document.createElement('img');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  const anchor = document.createElement('a');
  
  div.classList.add('movie-card');
  
  image.src = param.poster_path ? `https://image.tmdb.org/t/p/w342${param.poster_path}` : 'images/screen.jpg';
  image.alt = param[titleKey];
  h3.textContent = param[titleKey];
  p.innerHTML = `Release: ${param[dateKey]}`;
  anchor.href = `show-details.html?id=${param.id}`
  
  
  anchor.appendChild(image);
  anchor.appendChild(h3);
  anchor.appendChild(p);
  div.appendChild(anchor)
  
  return div;
}

//CREATE FETCH DATA API FUNCTION
async function fetchData(endpoint) {
  const API_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = '2800bf9781420f03f7ab74f60245cbcf';
  try {
    showLoading();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    
    if (response.status === 404) throw new Error('404 not found!');
    if (response.status === 500) throw new Error('Internal server error!');
    if (response.status === 0) throw new Error('Failed to fetch! please check your internet connection and try again');
    
    const data = await response.json();
    
    hideLoading();
  return data;
  } catch (e) {
    displayError(e);
    console.log(e)
  }
  
}

//Display Error Message 
function displayError(error) {
  // Tab to edit
}

//GET MOVIE DETAILS
async function getMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  
  const movies = await fetchData(`movie/${movieId}`);
  
  const container = document.createElement('div');
  
  displayMovieBackdrop('movie', movies.backdrop_path);
  
  container.innerHTML = `
    <section id="movie-details">
      <img src = ${
        movies.poster_path ? `https://image.tmdb.org/t/p/w342${movies.poster_path}` : `images/screen.jpg`
      } alt="" />
      <article>
        <h3>${movies.title}</h3>
        <p>${movies.vote_average.toFixed(1)}/10</p>
        <p>Release Date: ${movies.release_date}</p>
        <p>${movies.overview}</p>
        <h4>Gengres</h4>
        ${movies.genres.map(genre => `<ul style="list-style-type: none;")><li>${genre.name}</li></ul>`).join('')}
        
        <button type="button" id="rtnBtn"><a href='${movies.homepage}'>Visit Movie Homepage</a></button>
      </article>
    </section>
    
    <section id="movie-info">
      <h3>MOVIE INFO</h3>
      <ul>
        <li><span>Budget:</span> $${movies.budget.toLocaleString('en-US')}</li>
        <li><span>Revenue:</span> $${movies.revenue.toLocaleString('en-US')}</li>
        <li><span>Runtime:</span> ${movies.runtime} minutes</li>
        <li><span>Status:</span> ${movies.status}</li>
      </ul>
      <div id="companies">
        <h3>Production companies</h3>
        ${movies.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}
      </div>
    </section>
    `
    
    document.querySelector('#movie-details-container').appendChild(container)
    
}

//Overlay Background Image for Movies 
function displayMovieBackdrop(type, backdropPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.opacity = '0.1';
  
  
  if (type === 'movie') {
    document.querySelector('#movie-details-container').appendChild(overlayDiv);
  } else {
    document.querySelector('#tvshows').appendChild(overlayDiv);
  }
}

//PAGE ROUTER
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayMovies('movie/popular', '#popular-movies #movies', 'title', 'release_date');
      break;
    case '/shows.html':
      displayMovies('tv/popular', '#popular-tv #tvshows', 'name', 'first_air_date');
      break;
    case '/show-details.html':
      getMovieDetails();
      break;
    case '/search.html':
      console.log('Search')
      break;
    
    default:
      console.log('No page')
  }
  
  highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init);
