'use strict';

//QUERY SELECTORS
const characterList = document.querySelector('.js_list_all');
const favouriteList = document.querySelector('.js_list_favourites');
const inputBox = document.querySelector('.js_input_search');
const searchButton = document.querySelector('.js_button_search');

//OTHER GLOBAL VARIABLES
let allCharacters = [];
let favouriteCharacters = [];
let searchedCharacters = [];
const savedFavourites = JSON.parse(localStorage.getItem('favourites'));

//ON PAGE LOAD
showCharacters();
showFavourites();
searchButton.addEventListener('click', handleSearch);


//EVENT HANDLING FUNCTIONS

/**
 * function that allows to search a character by its name
 * @param event 
 */
function handleSearch(event) {
    event.preventDefault();

    //obtain text typed by the user
    let searchText = inputBox.value;

    //fetch data from the server
    fetch(`//api.disneyapi.dev/character?name=${searchText}`)
        .then(response => response.json())
        .then(data => {
            characterList.innerHTML = '';

            //check if the result is an array or an object and render matching charascter(s) accordingly
            if (Array.isArray(data.data)) {
                searchedCharacters = data.data;

                for (const character of searchedCharacters) {
                    renderCharacters(character);
                }
            } else {
                renderCharacters(data.data);
            }
        });
}

/**
 * function that handles click events for all li elements
 * @param event
 */
function handleClick(event) {

    //identify the character
    const clickedCharacter = event.currentTarget;
    const clickedId = parseInt(clickedCharacter.dataset.id);
    const characterDiv = clickedCharacter.querySelector('.characters__card');
    let selectedCharacter;

    //fetch data from the server to retrieve the search result
    fetch(`//api.disneyapi.dev/character/${clickedId}`)
        .then(response => response.json())
        .then(data => {

            selectedCharacter = data.data;

            manageFavourites(characterDiv, selectedCharacter);
        });
}


//OTHER FUNCTIONS

/**
 * function that shows Disney characters on page load
 */
function showCharacters() {

    //retrieve data from the server to show first 50 characters
    fetch('//api.disneyapi.dev/character?pageSize=50')
        .then(response => response.json())
        .then(data => {
            allCharacters = data.data;

            for (const character of allCharacters) {
                renderCharacters(character, characterList);
            }
        });
}

/**
 * function that renders all characters one by one
 * @param character
 */
function renderCharacters(character) {

    //create characters
    characterList.appendChild(createCharacter(character));

    //select all li elements
    const allCards = document.querySelectorAll('.js__character__card');

    //add event listeners to all li elements
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

    //create new li element and set its attributes
    const newCharacter = document.createElement('li');
    newCharacter.setAttribute('data-id', character._id);
    newCharacter.setAttribute('data-name', character.name);
    newCharacter.classList.add('js__character__card');

    //create inner HTML content
    newCharacter.insertAdjacentHTML('afterbegin', `<div class="characters__card"><img class="characters__card__img" src="${character.imageUrl ? character.imageUrl : 'https://via.placeholder.com/120x120/cfe2f3/351c75/?text=Disney'}" alt="Picture of ${character.name}"><h3 class="characters__card__name js__card_name">${character.name}</h3></div>`);

    return newCharacter;
}

/**
 * function that shows favourite characters from local storage on page load
 */
function showFavourites() {
    if (savedFavourites !== null) {
        for (const favourite of savedFavourites) {
            markFavourite(favourite);
        }
    }
}

/**
 * function that handles the favourite characters logic
 * @param characterDiv, the html element to which css changes will be applied when marked as favourite
 * @param selectedCharacter, Disney character identified by id
 */
function manageFavourites(characterDiv, selectedCharacter) {

    //check if the character is already a favourite
    const existingCharacter = favouriteList.querySelector(`[data-id="${selectedCharacter._id}"]`);

    //check conditions to apply the logic
    if (!characterDiv.classList.contains('favourite') && !existingCharacter) {
        characterDiv.classList.add('favourite');
        markFavourite(selectedCharacter);
        favouriteCharacters.push(selectedCharacter);
    } else if (!characterDiv.classList.contains('favourite') && existingCharacter) {
        characterDiv.classList.add('favourite');
    } else {
        characterDiv.classList.remove('favourite');
        if (existingCharacter) {
            favouriteList.removeChild(existingCharacter);
            favouriteCharacters = favouriteCharacters.filter(character => character._id !== selectedCharacter._id);
        }
    }
    //save the favourites to the local storage
    localStorage.setItem('favourites', JSON.stringify(favouriteCharacters));
}

/**
 * function that marks favourite characters with a cat icon 😻
 * @param favourite
 */
function markFavourite(favourite) {
    const newFavourite = createCharacter(favourite);
    const newFavouriteName = newFavourite.querySelector('.js__card_name');
    const favouriteMark = document.createTextNode('😻');
    newFavouriteName.appendChild(favouriteMark);
    favouriteList.appendChild(newFavourite);
}