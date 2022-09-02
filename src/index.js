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

function cleanMarckup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

const refs = {
  input: document.querySelector("input#search-box"),
  countryList: document.querySelector("ul.country-list"),
  countryInfo: document.querySelector("div.country-info")
}
const { input, countryList, countryInfo } = refs;


input.addEventListener("input", debounce(onInputChange, DEBOUNCE_DELAY))


function onInputChange() {

  let inputValue = input.value.toLowerCase().trim();
  
  if (inputValue === "" || inputValue === ' ') {
    Notiflix.Notify.info("You didn't enter anything", SET_OPTIONS_NOTIFLIX);
    cleanMarckup()
    return
  }

  if (inputValue !== ' ') {
    
    fetchCountries(inputValue)
     .then((response) => {
        if (!response.ok) {
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
          renderUlCountryList(data);

        }
        
        if (countOfCountries === 1) {
            Notiflix.Notify.success("Successful request to the server", SET_OPTIONS_NOTIFLIX);
            console.log(data)
            
          renderToDivCountryInfo(data);
          
        }
        
      }).catch(error => {
        cleanMarckup()
        // console.log(error);
        Notiflix.Notify.failure(OOPS_MASSAGE, SET_OPTIONS_NOTIFLIX);
        });
  }
 
}



function renderUlCountryList(arr) {
  cleanMarckup()
  let marckup = '';

  for (let country of arr) {
    marckup +=
      `
      <li class="item"><img
      src="${country.flags.svg}"
      alt="${country.name.official}"
      width="60"
      height="40"
      class="country-flag">
      <p class="item-info">${country.name.official}</p>
      </li>
      `
    
  }
  // console.log(marckup);
  countryList.innerHTML = marckup;
  console.log("Результат работы функции renderUlCountryList()");

}

function renderToDivCountryInfo(arr) {
  cleanMarckup()
  let marckup = '';

  for (let {name,capital,population,flags,languages} of arr) {
    marckup +=
    `
      <img src="${flags.svg}" alt="${name.official}" width="60" height="40" class="country-flag">
      <h1 class="country-name">${name.official}</h1>
      <p class="info-item">
      <span class="accent">Capital:</span>${capital}
      </p>
      <p class="info-item">
      <span class="accent">Population:</span>${population}
      </p>
      <p class="info-item">
      <span class="accent">Languages:</span>${Object.values(languages)}
      </p>
    `
  }
  // console.log(marckup);
  countryInfo.innerHTML = marckup;

  console.log("Результат работы функции renderToDivCountryInfo()");
}
