'use strict';

//QUERY SELECTORS
const characterListUl = document.querySelector('.js__list_all');
const favouriteListUl = document.querySelector('.js__list_favourites');
const inputBox = document.querySelector('.js__input_search');
const searchButton = document.querySelector('.js__button_search');
const resetButton = document.querySelector('.js__reset');

//OTHER GLOBAL VARIABLES
let allCharactersArray = [];
let favouriteCharactersArray = [];
let searchedCharactersArray = [];
const savedFavouritesLS = JSON.parse(localStorage.getItem('favourites'));

//ON PAGE LOAD
showFavourites();
showCharacters();
searchButton.addEventListener('click', handleSearch);
resetButton.addEventListener('click', handleReset);

//EVENT HANDLING FUNCTIONS

/**
 * function that allows to search a character by its name
 * @param event
 */
function handleSearch(event) {
    event.preventDefault();

    //obtain text typed by the user
    let searchedText = inputBox.value;

    //fetch data from the server
    fetch(`//api.disneyapi.dev/character?name=${searchedText}`)
        .then(response => response.json())
        .then(data => {
            characterListUl.innerHTML = '';

            //check if the result is an array or an object and render matching character(s) accordingly
            if (Array.isArray(data.data)) {
                searchedCharactersArray = data.data;
                for (const characterObject of searchedCharactersArray) {
                    renderCharacters(characterObject);
                    checkFavourite(characterObject);
                }
            } else {
                renderCharacters(data.data);
                checkFavourite(data.data);
            }
        });
}

/**
 * function that handles click events for all li elements
 * @param event
 */
function handleClick(event) {

    //identify the character
    const clickedCharacterLi = event.currentTarget;
    identifyCharacter(clickedCharacterLi);
}

/**
 * function that handles the close button on favourite cards
 * @param event
 */
function handleClose(event) {

    //identify the character
    const clickedCharacterLi = event.currentTarget.parentNode.parentNode;
    identifyCharacter(clickedCharacterLi);
    const clickedId = parseInt(clickedCharacterLi.dataset.id);

    //find the character on the main list to remove favourite
    const identifiedCharacterLi = characterListUl.querySelector(`[data-id="${clickedId}"]`);
    const identifiedCharacterDiv = identifiedCharacterLi.querySelector('.characters__card');
    identifiedCharacterDiv.classList.remove('favourite');
}

/**
 * function that resets favourite characters
 */
function handleReset() {
    favouriteListUl.innerHTML = '';
    favouriteCharactersArray = [];
    localStorage.setItem('favourites', JSON.stringify(favouriteCharactersArray));

    const allCardsDiv = document.querySelectorAll('.characters__card');
    for (const cardDiv of allCardsDiv) {
        cardDiv.classList.remove('favourite');
    }
}


//OTHER FUNCTIONS

/**
 * function that identifies the character by its id
 * @param clickedCharacterLi
 */
function identifyCharacter(clickedCharacterLi) {

    //obtain the clicked card's id
    const clickedId = parseInt(clickedCharacterLi.dataset.id);
    const characterDiv = clickedCharacterLi.querySelector('.characters__card');
    let selectedCharacterObject;

    //fetch data from the server to retrieve the search result
    fetch(`//api.disneyapi.dev/character/${clickedId}`)
        .then(response => response.json())
        .then(data => {

            selectedCharacterObject = data.data;

            //call the function that manages favourite cards
            manageFavourites(characterDiv, selectedCharacterObject);
        });
}

/**
 * function that shows Disney characters on page load
 */
function showCharacters() {

    //retrieve data from the server to show first 50 characters
    fetch('//api.disneyapi.dev/character?pageSize=50')
        .then(response => response.json())
        .then(data => {
            allCharactersArray = data.data;

            for (const characterObject of allCharactersArray) {
                //render all characters
                renderCharacters(characterObject);
                //check if any character is a current favourite to mark it
                checkFavourite(characterObject);
            }
        });
}

/**
 * function that renders all characters one by one
 * @param characterObject
 */
function renderCharacters(characterObject) {

    //create characters
    characterListUl.appendChild(createCharacter(characterObject));

    //select all li elements
    const allCardsLi = document.querySelectorAll('.js__character__card');

    //add event listeners to all li elements
    for (const cardLi of allCardsLi) {
        if (!cardLi.closest('.js__list_favourites')) {
            cardLi.addEventListener('click', handleClick);
            cardLi.classList.add('clickable');
        }
    }
}

/**
 * function that creates a new li element
 * @param characterObject
 * @returns li
 */
function createCharacter(characterObject) {

    //create new li element and set its attributes
    const newCharacterLi = document.createElement('li');
    newCharacterLi.setAttribute('data-id', characterObject._id);
    newCharacterLi.setAttribute('data-name', characterObject.name);
    newCharacterLi.classList.add('js__character__card');

    //create inner HTML content
    newCharacterLi.insertAdjacentHTML('afterbegin', `<div class="characters__card"><h3 class="characters__card__close js__card__close"></h3><img class="characters__card__img" src="${characterObject.imageUrl ? characterObject.imageUrl : 'https://via.placeholder.com/120x120/cfe2f3/351c75/?text=Disney'}" alt="Picture of ${characterObject.name}"><h3 class="characters__card__name js__card__name">${characterObject.name}</h3></div>`);

    return newCharacterLi;
}

/**
 * function that shows favourite characters from the local storage on page load
 */
function showFavourites() {
    if (savedFavouritesLS !== null) {
        for (const favouriteObject of savedFavouritesLS) {
            markFavourite(favouriteObject);
        }
    }
}

/**
 * function that handles the favourite characters logic
 * @param characterDiv
 * @param selectedCharacterObject
 */
function manageFavourites(characterDiv, selectedCharacterObject) {

    //check if the character is already a favourite
    const currentFavourite = favouriteListUl.querySelector(`[data-id="${selectedCharacterObject._id}"]`);

    //check conditions to apply the logic
    if (!characterDiv.classList.contains('favourite') && !currentFavourite && characterDiv.closest('.js__list_all')) {
        characterDiv.classList.add('favourite');
        markFavourite(selectedCharacterObject);
    } else if (!characterDiv.classList.contains('favourite') && currentFavourite && characterDiv.closest('.js__list_all')) {
        characterDiv.classList.add('favourite');
    } else {
        characterDiv.classList.remove('favourite');
        if (currentFavourite) {
            favouriteListUl.removeChild(currentFavourite);
            favouriteCharactersArray = favouriteCharactersArray.filter(character => character._id !== selectedCharacterObject._id);
        }
    }
    //save the favourites to the local storage
    localStorage.setItem('favourites', JSON.stringify(favouriteCharactersArray));
}

/**
 * function that marks and saves favourite cards
 * @param favourite JS object
 */
function markFavourite(favourite) {

    //create new li element in favourites
    const newFavouriteLi = createCharacter(favourite);

    //add a cat icon to mark favourites
    const newFavouriteName = newFavouriteLi.querySelector('.js__card__name');
    const favouriteMark = document.createTextNode('😻');
    newFavouriteName.appendChild(favouriteMark);

    //add a close button to the favourite card
    const newFavouriteClose = newFavouriteLi.querySelector('.js__card__close');
    const closeButton = document.createTextNode('❌');
    newFavouriteClose.appendChild(closeButton);
    newFavouriteClose.classList.add('clickable');

    //add an event listener to the close button
    newFavouriteClose.addEventListener('click', handleClose);
    favouriteListUl.appendChild(newFavouriteLi);

    //save the favourite character to the favourite list
    favouriteCharactersArray.push(favourite);
}

/**
 * function that checks if a character is a favourite
 * @param  character JS object
 */
function checkFavourite(characterObject) {

    const currentFavourite = favouriteListUl.querySelector(`[data-id="${characterObject._id}"]`);

    if (currentFavourite) {
        // add the 'favourite' class to the corresponding character element
        const characterDiv = document.querySelector(`[data-id="${characterObject._id}"]`);
        if (characterDiv) {
            const currentLi = characterDiv.querySelector('.characters__card');
            currentLi.classList.add('favourite');
        }
    }
}