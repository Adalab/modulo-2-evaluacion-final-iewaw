'use strict';

console.log('Hello, world!');

const characterList = document.querySelector('.js_list_all');
const favouriteList = document.querySelector('.js_list_favourites');

let allCharacters = [];
let favouriteCharacters = [];
let filteredCharacters = [];

fetch('//api.disneyapi.dev/character?pageSize=50')
  .then( response => response.json() )
  .then( data => {
 
    console.log(data);

  });