import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries'

const DEBOUNCE_DELAY = 800;
const TOOMANY_MASSAGE = "Too many matches found. Please enter a more specific name.";
const OOPS_MASSAGE = "Oops, there is no country with that name";
function CLEANER() {
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
    console.log('в инпуте пустая строка, запускаю очистку');
    Notiflix.Notify.info('Вы ничего не ввели. Введите в поиск страну');
    CLEANER()
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
          Notiflix.Notify.info(TOOMANY_MASSAGE);
          return
        }
        
        if (countOfCountries >= 2 && countOfCountries <= 10) {
          console.log(data)
          renderUlCountryList(data);

        }
        
        if (countOfCountries === 1) {
          
            console.log(data)
            
          renderToDivCountryInfo(data);
          
        }
        
      }).catch(error => {
        // console.log(error);
        Notiflix.Notify.failure(OOPS_MASSAGE);
        });
  }
 
}



function renderUlCountryList(arr) {
  CLEANER()
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
  CLEANER()
  let marckup = '';

  for (let {name,capital,population,flags,languages} of arr) {
    marckup +=
    `
     <div class="wrap">
      <img src="${flags.svg}" alt="${name.official}" width="60" height="60" class="country-flag">
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
    </div>
    `
  }
  // console.log(marckup);
  countryInfo.innerHTML = marckup;

  console.log("Результат работы функции renderToDivCountryInfo()");
}




// name.official - полное имя страны
// capital - столица
// population - население
// flags.svg - ссылка на изображение флага
// languages - массив языков

// ********************************
// e.g. Only message
// Notiflix.Notify.success('Sol lucet omnibus');

// Notiflix.Notify.failure('Qui timide rogat docet negare');

// Notiflix.Notify.warning('Memento te hominem esse');

// Notiflix.Notify.info('Cogito ergo sum');

// // e.g. Message with a callback
// Notiflix.Notify.success(
//   'Click Me',
//   function cb() {
//     // callback
//   },
// );