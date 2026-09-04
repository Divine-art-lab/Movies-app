const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: ''
  },
  api: {
    apiKey: '2800bf9781420f03f7ab74f60245cbcf',
    apiUrl: 'https://api.themoviedb.org/3/'
  }
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
async function displayMovies(endpoint, parentElement, titleKey, dateKey, location) {
  const { results } = await fetchData(endpoint);
  results.forEach((movie) => {
    document.querySelector(parentElement).appendChild(createElements(movie, titleKey, dateKey, location));
  })
}
//CREAT ELEMENTS
function createElements(param, titleKey, dateKey, location) {
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
  anchor.href = `${location}.html?id=${param.id}`;
  
  anchor.appendChild(image);
  anchor.appendChild(h3);
  anchor.appendChild(p);
  div.appendChild(anchor)
  
  return div;
}

//CREATE FETCH DATA API FUNCTION
async function fetchData(endpoint) {
  const API_URL = global.api.apiUrl;
  const API_KEY = global.api.apiKey;
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

//NOW PLAYING MOVIES. SLIDE.
async function nowPlayingSlide() {
  const { results } = await fetchData('movie/now_playing');
  
  
  
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    
    div.innerHTML = `
        <a href='/show-details.html?id=${movie.id}'>
          <img src='https://image.tmdb.org/t/p/w500${movie.poster_path}'>
          <h3>${movie.vote_average.toFixed(1)}/10</h3>
        </a>
    `;
    
    document.querySelector('.swiper-wrapper').appendChild(div);
    
    initSwiper();
  })
  
}
//INITIALIZE THE SWIPER FOR FUNCTIONALITY
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    freeMode: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  })
}

//GET MOVIE DETAILS
async function getMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  
  const movies = await fetchData(`movie/${movieId}`);
  
  const container = document.createElement('div');
  
  displayMovieBackdrop('movie', movies.backdrop_path);
  
  container.innerHTML = `
    <section id="movie-details" class="movie-details">
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
//GET TV SHOW DETAILS
async function getTVshowDetails() {
  const movieId = window.location.search.split('=')[1];
  
  const tvshows = await fetchData(`tv/${movieId}`);
  
  const container = document.createElement('div');
  
  displayMovieBackdrop('tv', tvshows.backdrop_path);
  
  console.log(tvshows)
  
  container.innerHTML = `
    <section id="tv-details" class="movie-details">
      <img src = ${
        tvshows.poster_path ? `https://image.tmdb.org/t/p/w342${tvshows.poster_path}` : `images/screen.jpg`
      } alt="" />
      <article>
        <h3>${tvshows.name}</h3>
        <p>${tvshows.vote_average.toFixed(1)}/10</p>
        <p>First Air Date: ${tvshows.first_air_date}</p>
        <p>${tvshows.overview}</p>
        <h4>Gengres</h4>
        ${tvshows.genres.map(genre => `<ul style="list-style-type: none;")><li>${genre.name}</li></ul>`).join('')}
        
        <button type="button" id="rtnBtn"><a href='${tvshows.homepage}'>Visit Movie Homepage</a></button>
      </article>
    </section>
    
    <section id="movie-info">
      <h3>MOVIE INFO</h3>
      <ul>
      <li><span>Number of Episodes:</span> ${tvshows.number_of_episodes}</li>
    <li><span>Last Episode To Air:</span> ${tvshows.last_episode_to_air.name}</li>
        <li><span>Status:</span> ${tvshows.status}</li>
      </ul>
      <div id="companies">
        <h3>Production companies</h3>
        ${tvshows.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}
      </div>
    </section>
    `
    
    document.querySelector('#tv-details-container').appendChild(container)
    
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
    document.querySelector('#tv-details-container').appendChild(overlayDiv);
  }
}

//SEARCH FUNCTIONALITY
async function search() {
  const queryString = window.location.search;
  
  const urlParam = new URLSearchParams(queryString);
  
  global.search.term = urlParam.get('search');
  global.search.type = urlParam.get('type');
  
  if (global.search.term !== '' && global.search.term !== null) {
    const {results} = await fetchSearchData();
    
    if (results.length === 0) {
      showAlert('no search result found', 'warning');
      return
    };
    
    results.forEach((movie) => {
      document.querySelector('#searchResults').appendChild(createElements(movie, global.search.type === 'movie' ? 'title' : 'name', global.search.type === 'movie' ? 'release_date' : 'first_air_date', `/${global.search.type}-details`));
    })
    
  } else {
    showAlert('please search for a term', 'alert')
    //alert('please search for a term');
  }
}
//Fetch Search Data
async function fetchSearchData() {
  const API_URL = global.api.apiUrl;
  const API_KEY = global.api.apiKey;
  try {
    showLoading();
    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`);
    
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

//show alert
function showAlert(message, className) {
  const alertEl = document.createElement('p');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  
  document.querySelector('#msgBox').appendChild(alertEl);
  
  setTimeout(() => alertEl.remove(), 3000);
}

//PAGE ROUTER
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      nowPlayingSlide();
      displayMovies('movie/popular', '#popular-movies #movies', 'title', 'release_date', 'movie-details');
      break;
    case '/shows.html':
      displayMovies('tv/popular', '#popular-tv #tvshows', 'name', 'first_air_date', 'tv-details');
      break;
    case '/movie-details.html':
      getMovieDetails();
      break;
    case '/tv-details.html':
      getTVshowDetails();
      break;
    
    case '/search.html':
      search();
      break;
    
    default:
      console.log('No page')
  }
  
  highlightActiveLink()
}



document.addEventListener('DOMContentLoaded', init);