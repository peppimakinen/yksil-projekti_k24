import './home.css';
import { fetchData } from './fetch.js';

// LOGOUT 
const logout = document.querySelector('.activelogout');
const noNewEntry = document.querySelector('.no');

const handleLogout = function(evt) {
  evt.preventDefault();
  window.location.href = 'login.html';
};

logout.addEventListener('click', handleLogout);
noNewEntry.addEventListener('click', handleLogout);

// GO TO ENTRIES
const pastBtn = document.querySelector('.pastBtn');
const pastNav = document.querySelector('.pastNav');

const goToPastEntries = function(evt) {
  evt.preventDefault();
  window.location.href = 'entries.html';
};

pastBtn.addEventListener('click', goToPastEntries);
pastNav.addEventListener('click', goToPastEntries);

// NEW DIARY ENTRY
// haetaan nappi josta lähetetään formi ja luodaan käyttäjä
const url = 'http://127.0.0.1:3000/api/entries';

const createEntry = document.querySelector('.createEntry');
createEntry.addEventListener('click', async (evt) => {
  evt.preventDefault();
  console.log('Lets create a new diary entry');

  // get form and check validity
  const form = document.querySelector('.entry_form');
  if (!createEntry.checkValidity()){
    // Input didnt pass validation
    createEntry.reportValidity()
    return;
  // Check if user has changed input in dropdown menu from the placeholder
  } else {
    // Form passed all validation continue to send request
    gatherNewEntryData();
  }
});

// Function to gather data from the form
async function gatherNewEntryData() {
  // Get form values
  const user_id = localStorage.getItem('user_id');
  const entry_date = document.getElementById("entry_date").value;
  const severity = document.getElementById("severity").value;
  const triggers = document.getElementById("triggers").value;
  const duration_hours = document.getElementById("duration_hours").value;
  const other_symptoms = document.getElementById("other_symptoms").value;

  // Get token from localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("Token not found in local storage");
    return;
  }

  // insert entry form values into data
  const newEntrydata = {
    user_id: user_id,
    entry_date: entry_date,
    severity: severity,
    triggers: triggers,
    duration_hours: duration_hours,
    other_symptoms: other_symptoms,
  };
  
  console.log(newEntrydata)

  // Define POST request options
  const options = {
    method: 'POST', // Method is POST
    headers: {
      'Content-Type': 'application/json', // Send data in JSON format
      'Authorization': 'Bearer ' + token, // Include authorization token
    },
    body: JSON.stringify(newEntrydata) // Convert data to JSON format and send it
  };
  
  // Send POST request
  postNewEntry(options);
};

// Function to send POST request
async function postNewEntry(options) {
  // Define POST request and send it
  postData('http://localhost:3000/api/entries', options) 
    .then(data => {
      console.log('Response data:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Function to send POST request using fetch
async function postData(url, options = {}) {
  // Define request settings
  const response = await fetch(url, options);
  console.log(response)
  
  // Return response in JSON format
  return response.json();
}

// POPUP HANDLING
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const openPopupBtn = document.querySelector('.yes');
const closePopupBtn = document.getElementById('closePopup');
const createEntryBtn = document.querySelector('.createEntry');

openPopupBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  popup.style.display = 'block';
  overlay.style.display = 'block';
});

closePopupBtn.addEventListener('click', function() {
  popup.style.display = 'none';
  overlay.style.display = 'none';
});

createEntryBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  popup.style.display = 'none';
  overlay.style.display = 'none';
});


