import './login.css';
import { fetchData } from './fetch.js';

// PAGE LOAD
// clear localstorage
window.addEventListener('load', () => {
  clearLocalStorage();
});

// USER CREATION
const createUser = document.querySelector('.createuser');
createUser.addEventListener('click', async (evt) => {
  evt.preventDefault();
  console.log('Nyt luodaan käyttäjä');

  const url = 'http://127.0.0.1:3000/api/users';

  // get form and check if valid
  const form = document.querySelector('.register_form');
  if (!form.checkValidity()) {
    // If the form is not valid, show the validation messages
    form.reportValidity();
    return; // Exit function if form is not valid
  }

  // user data
  const data = {
    username: form.querySelector('input[name=username]').value,
    password: form.querySelector('input[name=password]').value,
    email: form.querySelector('input[name=email]').value,
  };

  console.log(data)

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), 
  };

  // fetchData(url, options).then((data) => {
  //   console.log(data);
  // });

  try {
    const responseData = await fetchData(url, options);
    console.log(responseData);
  } catch (error) {
    console.error(error);
  }
  
});

// LOGIN ja TOKEN
const loginUser = document.querySelector('.loginuser');
loginUser.addEventListener('click', async (evt) => {
  evt.preventDefault();
  console.log('Nyt logataan sisään');

  const url = 'http://127.0.0.1:3000/api/auth/login';

  // get form and it's values
  const form = document.querySelector('.login_form');
  const username = form.querySelector('input[name=username]').value;
  const password = form.querySelector('input[name=password]').value;

  // insert values into data
  const data = {
    username: username,
    password: password,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetchData(url, options).then((data) => {
    console.log(data);
    console.log(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user_id", data.user.user_id);

    if (data.token == undefined) {
      alert('Käyttäjänimi tai salasana väärin')
    } else {
      // alert('Hienosti kirjauduit sisään good job!')
      window.location.href = 'home.html';
    };

    logResponse('loginResponse', `localStorage set with token value: ${data.token}`);
  });
});


// Haetaan nappi josta testataan TOKENIN käyttöä, /auth/me
const meRequest = document.querySelector('#loginbutton');
meRequest.addEventListener('click', async () => {
  console.log('Testataan TOKENIA ja haetaan käyttäjän tiedot');

  const url = 'http://127.0.0.1:3000/api/auth/me';
  const myToken = localStorage.getItem('token');
  console.log(myToken)

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer: ' + myToken,
    },
  };

  console.log(options)
  fetchData(url, options).then((data) => {
    console.log(data);
    logResponse('meResponse', `Authorized user info: ${JSON.stringify(data)}`);
  });
});


// Haetaan nappi josta tyhjennetään localStorage
const clear = document.querySelector('#clearButton');
clear.addEventListener('click', clearLocalStorage);

// Apufunktio, kirjoittaa halutin koodiblokin sisään halutun tekstin
function logResponse(codeblock, text) {
  const element = document.getElementById(codeblock);
  if (element) {
    element.innerText = text;
  } else {
    console.log(`Element with ID '${codeblock}' not found.`);
  }
}

// Apufunktio, Tyhjennä local storage
function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  logResponse('clearResponse', 'localStorage cleared!');
}

// popup handling
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const openPopupBtn = document.querySelector('.openPopup');
const closePopupBtn = document.getElementById('closePopup');
const createAccountBtn = document.getElementById('createAccount');

openPopupBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  popup.style.display = 'block';
  overlay.style.display = 'block';
});

closePopupBtn.addEventListener('click', function() {
  popup.style.display = 'none';
  overlay.style.display = 'none';
});

createAccountBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  popup.style.display = 'none';
  overlay.style.display = 'none';
});