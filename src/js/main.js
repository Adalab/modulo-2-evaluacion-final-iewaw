'use strict';

const characterList = document.querySelector('.js_list_all');
const favouriteList = document.querySelector('.js_list_favourites');

let allCharacters = [];
let favouriteCharacters = [];
let filteredCharacters = [];

fetch('//api.disneyapi.dev/character?pageSize=50')
  .then( response => response.json() )
  .then( data => {
 
    allCharacters = data.data;

    for(let character of allCharacters) {
      renderCharacters(character);
    }

  });

function renderCharacters(character) {

  const newCharacter = document.createElement('li');

  newCharacter.insertAdjacentHTML('afterbegin', `<div class="characters__card"><img class="characters__card__img" src="${character.imageUrl ? character.imageUrl : 'https://via.placeholder.com/160x200/cfe2f3/351c75/?text=Disney'}" alt="Picture of ${character.name}"><h3 class="characters__card__name">${character.name}</h3></div>`);


  characterList.appendChild(newCharacter);
}
