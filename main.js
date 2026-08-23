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
async function displayPopularMovies(endpoint, parentElement, titleKey, dateKey) {
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
  
  div.classList.add('movie-card');
  
  image.src = param.poster_path ? `https://image.tmdb.org/t/p/w342${param.poster_path}` : 'images/screen.jpg';
  image.alt = param[titleKey];
  h3.textContent = param[titleKey];
  p.innerHTML = `Release: ${param[dateKey]}`;
  
  div.appendChild(image);
  div.appendChild(h3);
  div.appendChild(p);
  
  return div;
}

//CREATE FETCH DATA API FUNCTION
async function fetchData(endpoint) {
  const API_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = '2800bf9781420f03f7ab74f60245cbcf';
  
  showLoading();
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  
  const data = await response.json();
  
  hideLoading();
  return data;
}


//PAGE ROUTER
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies('movie/popular', '#popular-movies #movies', 'title', 'release_date');
      break;
    case '/shows.html':
      displayPopularMovies('tv/popular', '#popular-tv #tvshows', 'name', 'first_air_date');
      break;
    case '/show-details.html':
      console.log('Derails')
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
