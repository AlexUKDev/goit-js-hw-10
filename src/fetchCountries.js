
// https://restcountries.com/v2/all?fields=name,capital,currencies

export function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`); 
}