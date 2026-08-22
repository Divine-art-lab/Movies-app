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

//DISPLAY POPULAR MOVIES FUNCTION
async function displayPopularMovies() {
  const { results } = await fetchData('movie/popular');
  results.forEach((movie) => {
    document.querySelector('#popular-movies #movies').appendChild(createElements(movie));
  })
}
//CREAT ELEMENTS
function createElements(param) {
  const div = document.createElement('div');
  const image = document.createElement('img');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  
  div.classList.add('movie-card');
  
  image.src = `https://image.tmdb.org/t/p/w342${param.poster_path}`;
  h3.textContent = param.title;
  p.innerHTML = `Release: ${param.release_date}`;
  
  div.appendChild(image);
  div.appendChild(h3);
  div.appendChild(p);
  
  return div;
}

//CREATE FETCH DATA API FUNCTION
async function fetchData(endpoint) {
  const API_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = '2800bf9781420f03f7ab74f60245cbcf';
  
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  
  const data = await response.json();
  
  return data;
}


//PAGE ROUTER
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows')
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

document.addEventListener('DOMContentLoaded', init());
