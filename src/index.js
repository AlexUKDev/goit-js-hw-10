import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries'

const DEBOUNCE_DELAY = 300;
const TOOMANY_MASSAGE = "Too many matches found. Please enter a more specific name.";
const OOPS_MASSAGE = "Oops, there is no country with that name";
const SET_OPTIONS_NOTIFLIX = {
  width: "430px",
  fontSize: "25px",
  timeout: "3000",
  distance:"20px",
  cssAnimationDuration:"500",
  borderRadius: "20px",
  fontAwesomeIconStyle: "shadow",
  cssAnimationStyle: "zoom",
};

function cleanCountryList() {
  countryList.innerHTML = '';
  
};

function cleanCountryInfo() {
  countryInfo.innerHTML = '';
}

const refs = {
  input: document.querySelector("input#search-box"),
  countryList: document.querySelector("ul.country-list"),
  countryInfo: document.querySelector("div.country-info")
}
const { input, countryList, countryInfo } = refs;


input.addEventListener("input", debounce(onInputChange, DEBOUNCE_DELAY))


function onInputChange() {

  let inputValue = input.value.toLowerCase().trim();
  
  if (!inputValue) {
    Notiflix.Notify.info("You didn't enter anything", SET_OPTIONS_NOTIFLIX);
    
    cleanCountryList();
    cleanCountryInfo();
    
    return
  }

  if (inputValue !== ' ') {
    
    fetchCountries(inputValue)
     .then((response) => {
       if (!response.ok || response.status === 404) {
          throw new Error(response.status);
        }
       
        return response.json();
     })
      .then((data) => {
        let countOfCountries = data.length;

        if(countOfCountries > 10) {
          Notiflix.Notify.info(TOOMANY_MASSAGE, SET_OPTIONS_NOTIFLIX);
          return
        }
        
        if (countOfCountries >= 2 && countOfCountries <= 10) {
          Notiflix.Notify.success("Successful request to the server", SET_OPTIONS_NOTIFLIX);
          
          cleanCountryInfo();
          renderUlCountryList(data);
        }
        
        if (countOfCountries === 1) {
           Notiflix.Notify.success("Successful request to the server", SET_OPTIONS_NOTIFLIX);
          
          cleanCountryList();
          renderToDivCountryInfo(data);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure(OOPS_MASSAGE, SET_OPTIONS_NOTIFLIX);
       
        cleanCountryList();
        cleanCountryInfo();
        });
  }
 
}


function renderUlCountryList(arr) {
  countryList.innerHTML = arr.map(({ flags, name }) =>
    `
      <li class="item"><img
      src="${flags.svg}"
      alt="${name.official}"
      width="60"
      height="40"
      class="country-flag">
      <p class="item-info">${name.official}</p>
      </li>
      `
  ).join('');
}

function renderToDivCountryInfo(arr) {
  
  countryInfo.innerHTML = arr.map(({flags, name, capital, population, languages}) =>
  `
      <img src="${flags.svg}" alt="${name.official}" width="60" height="40" class="country-flag">
      <h1 class="country-name">${name.official}</h1>
      <p class="info-item">
      <span class="accent">Capital:</span>${capital}
      </p>
      <p class="info-item">
      <span class="accent">Population:</span>${population} humans
      </p>
      <p class="info-item">
      <span class="accent">Languages:</span>${Object.values(languages).join(", ")}
      </p>
    `
  ).join("")
}
