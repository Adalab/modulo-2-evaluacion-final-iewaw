'use strict';

//QUERY SELECTORS
const characterList = document.querySelector('.js_list_all');
const favouriteList = document.querySelector('.js_list_favourites');
const searchedList = document.querySelector('.js_list_search');
const inputBox = document.querySelector('.js_input_search');
const searchButton = document.querySelector('.js_button_search');

//OTHER GLOBAL VARIABLES
let allCharacters = [];
let favouriteCharacters = [];
let searchedCharacters = [];


//ON PAGE LOAD
characterList.classList.remove('hidden');
searchedList.classList.add('hidden');

fetch('//api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => {
        allCharacters = data.data;

        for (const character of allCharacters) {
            renderCharacters(character, characterList);
        }
    });

searchButton.addEventListener('click', handleSearch);

//FUNCTIONS

/**
 * function that allows to search a character by its name
 * @param event 
 */
function handleSearch(event) {
    event.preventDefault();
    let searchText = inputBox.value;

    fetch(`//api.disneyapi.dev/character?name=${searchText}`)
        .then(response => response.json())
        .then(data => {
            searchedCharacters = data.data;

            characterList.classList.add('hidden');
            searchedList.classList.remove('hidden');
            searchedList.innerHTML = '';

            for (const character of searchedCharacters) {
                renderCharacters(character, searchedList);
            }
        });
}

/**
 * function that renders all characters one by one
 * @param character
 */
function renderCharacters(character, list) {
    //create characters
    list.appendChild(createCharacter(character));

    //add event listeners to all li elements
    const allCards = document.querySelectorAll('.js__character__card');

    for (const card of allCards) {
        card.addEventListener('click', handleClick);
    }
}

/**
 * function that creates and shows a new li element
 * @param character
 * @returns the created li element
 */
function createCharacter(character) {
    const newCharacter = document.createElement('li');
    newCharacter.setAttribute('data-id', character._id);
    newCharacter.setAttribute('data-name', character.name);
    newCharacter.classList.add('js__character__card');

    newCharacter.insertAdjacentHTML('afterbegin', `<div class="characters__card"><img class="characters__card__img" src="${character.imageUrl ? character.imageUrl : 'https://via.placeholder.com/120x120/cfe2f3/351c75/?text=Disney'}" alt="Picture of ${character.name}"><h3 class="characters__card__name">${character.name}</h3></div>`);

    return newCharacter;
}

/**
 * function that handles click events for all li elements
 * @param event
 */
function handleClick(event) {
    //identifying the character
    const clickedCharacter = event.currentTarget;
    const clickedId = parseInt(clickedCharacter.dataset.id);
    const characterDiv = clickedCharacter.querySelector('.characters__card');
    let selectedCharacter;

    fetch(`//api.disneyapi.dev/character/${clickedId}`)
        .then(response => response.json())
        .then(data => {

            selectedCharacter = data.data;

            manageFavourites(characterDiv, selectedCharacter);
        });
}

/**
 * function that handles the favourite characters logic
 * @param characterDiv, the html element to which css changes will be applied when marked as favourite
 * @param selectedCharacter, Disney character identified by id
 */
function manageFavourites(characterDiv, selectedCharacter) {
    if (!characterDiv.classList.contains('favourite')) {
        characterDiv.classList.add('favourite');
        favouriteList.appendChild(createCharacter(selectedCharacter));
        favouriteCharacters.push(selectedCharacter);
    } else {
        characterDiv.classList.remove('favourite');
        const existingCharacter = favouriteList.querySelector(`[data-id="${selectedCharacter._id}"]`);
        if (existingCharacter) {
            favouriteList.removeChild(existingCharacter);
            favouriteCharacters = favouriteCharacters.filter(character => character._id !== selectedCharacter._id);
        }
    }
}