import "./entries.css";
import { fetchData } from "./fetch.js";

// DATE FORMAT
// Reformat from yyyy-mm-dd to dd.mm.yyyy
function formatDate(dateString) {
  // Parse the input date string
  const date = new Date(dateString);
  // Adjust the date to GMT+2 time zone
  const gmtPlus2Date = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  // Extract day, month, and year
  const day = gmtPlus2Date.getDate();
  const month = gmtPlus2Date.getMonth() + 1; // Month is zero-based, so add 1
  const year = gmtPlus2Date.getFullYear();
  // Format the date as "dd-mm-yyyy"
  const formattedDate = `${day < 10 ? "0" : ""}${day}.${
    month < 10 ? "0" : ""
  }${month}.${year}`;
  return formattedDate;
}

// LOGOUT
const logout = document.querySelector(".activelogout");

const handleLogout = function (evt) {
  evt.preventDefault();
  window.location.href = "login.html";
};

logout.addEventListener("click", handleLogout);

// GO TO HOME
const homeBtn = document.querySelector(".home");

const goHome = function (evt) {
  //   evt.preventDefault();
  window.location.href = "home.html";
};

homeBtn.addEventListener("click", goHome);

// GET USERNAME
document.addEventListener("DOMContentLoaded", showUserName);

async function showUserName() {
  console.log("Hei täällä ollaan! Nyt pitäisi hakea käyttäjän tiedot");

  const url = "http://localhost:3000/api/auth/me";
  let token = localStorage.getItem("token");
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer: " + token,
    },
  };
  fetchData(url, options).then((data) => {
    console.log(data);
    console.log(data.user.username);
    document.getElementById("username").innerHTML = data.user.username;
    // muita hakuja ja tietoja sivulle, kuten email ym. mitä halutaan näyttää
  });
}

// GET ENTRIES
document.addEventListener("DOMContentLoaded", getEntries);

async function getEntries() {
  console.log("Haetaa kaikki käyttäjät");
  const url = "http://127.0.0.1:3000/api/entries";
  let token = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer: " + token,
    },
  };

  try {
    const responseData = await fetchData(url, options);
    console.log(responseData);
    createTable(responseData);
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
}

// create a table for entries
function createTable(data) {
  console.log(data);

  // etitään tbody elementti
  const tbody = document.querySelector(".tableBody");
  tbody.innerHTML = "";

  // loopissa luodaan jokaiselle tietoriville oikeat elementit
  // elementtien sisään pistetään oikeat tiedot

  data.forEach((entry) => {
    console.log(
      entry.entry_date,
      entry.severity,
      entry.triggers,
      entry.duration_hours,
      entry.other_symptoms,
      entry.entry_id
    );

    // Luodaan ensin TR elementti alkuun
    const tr = document.createElement("tr");

    // Luodaan soluja mihihin tiedot
    const td1 = document.createElement("td");
    td1.innerText = formatDate(entry.entry_date);

    const td2 = document.createElement("td");
    td2.innerText = entry.severity;

    const td3 = document.createElement("td");
    td3.innerText = entry.triggers;

    const td4 = document.createElement("td");
    td4.innerText = entry.duration_hours + " hours";

    const td5 = document.createElement("td");
    td5.innerText = entry.other_symptoms;

    const td6 = document.createElement("td");
    td6.innerText = entry.entry_id;

    // lisätään solut
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    // lisätään rivi tbodyihin
    tbody.appendChild(tr);
  });
}

// EDIT AN ENTRY
// get specific entry by id
async function specificEntry(evt) {
  console.log("Muokataan tietoa");
  console.log(evt);

  // Haetaan merkinnän tunniste eventistä
  const id = document.querySelector("#editId").value;
  console.log(id);

  // Määritellään URL merkinnän hakemiseksi
  const url = `http://127.0.0.1:3000/api/entries/${id}`;
  let token = localStorage.getItem("token");
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer: " + token,
    },
  };

  try {
    const response = await fetchData(url, options);
    return response;
  } catch (error) {
    console.error("Error fetching entry data:", error);
    throw error;
  }
}

// show popup for editing
function showPrevData(data) {
  // Show the edit popup
  editPopup.style.display = "block";
  editOverlay.style.display = "block";

  // Set the values of the input fields in the modal
  document.getElementById("editSeverity").value = data.severity;
  document.getElementById("editTriggers").value = data.triggers;
  document.getElementById("editDuration_hours").value = data.duration_hours;
  document.getElementById("editOther_symptoms").value = data.other_symptoms;
}

// edit specific entry
async function editEntry(evt) {
  const editId = document.querySelector("#editId").value;
  console.log("Saving changes for entry ID: ", editId);

  // Get the updated values from the input fields
  const updatedEntry = {
    severity: document.getElementById("editSeverity").value,
    triggers: document.getElementById("editTriggers").value,
    duration_hours: document.getElementById("editDuration_hours").value,
    other_symptoms: document.getElementById("editOther_symptoms").value,
  };

  // Construct the URL for updating the entry
  const url = `http://127.0.0.1:3000/api/entries/${editId}`;

  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Set up the options for the PUT request
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(updatedEntry),
  };

  // Send the PUT request to update the entry
  fetchData(url, options)
    .then((data) => {
      console.log("Entry updated successfully:", data);
      // Optionally, you can reload the entries after updating
      //   getEntries();
    })
    .catch((error) => {
      console.error("Error updating workout:", error);
    });
}

// edit entry popup
const editPopup = document.getElementById("editPopup");
const editOverlay = document.getElementById("editOverlay");
const openEditBtn = document.querySelector(".editBtn");
const closeEditBtn = document.getElementById("closeEdit");
const editForm = document.querySelector(".submitEdit");
// const editEntryBtn = document.querySelector(".submitEdit");

openEditBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  editPopup.style.display = "block";
  editOverlay.style.display = "block";
});

closeEditBtn.addEventListener("click", function () {
  editPopup.style.display = "none";
  editOverlay.style.display = "none";
});

editForm.addEventListener("click", function (evt) {
  evt.preventDefault();
  console.log("klikattu");
  const editId = document.getElementById("editId").value;
  editPopup.style.display = "none";
  openEditModal(editId);
});

// edit modal
const editModal = document.getElementById("editModal");
const closeModalBtn = document.querySelector(".closeModal");
const editEntryForm = document.getElementById("editEntryForm");

function openEditModal(editId) {
  console.log("Opening edit modal for entry ID:", editId);

  // Call specificEntry function to fetch the data of the entry
  specificEntry(editId)
    .then((data) => {
      // Populate input fields with entry data
      document.getElementById("editSeverity").value = data.severity;
      document.getElementById("editTriggers").value = data.triggers;
      document.getElementById("editDuration_hours").value = data.duration_hours;
      document.getElementById("editOther_symptoms").value = data.other_symptoms;

      // Show the edit modal
      editModal.style.display = "block";
      editOverlay.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching entry data:", error);
    });
  editModal.style.display = "block";
}

closeModalBtn.addEventListener("click", function () {
  editModal.style.display = "none";
  editOverlay.style.display = "none";
});

editEntryForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  editEntry();
  editModal.style.display = "none";
});

// event listener for editing an entry
// openEditBtn.addEventListener("click", showEntry, specificEntry);

// DELETE AN ENTRY
async function deleteEntry(evt) {
  console.log("Deleting entry");

  // Get the entry ID from the clicked button's data-id attribute
  const deleteId = document.querySelector("#deleteId").value;
  console.log("Entry ID to delete:", deleteId);

  // Confirm with the user before proceeding with deletion
  const answer = confirm(
    `Are you sure you want to delete entry with ID: ${deleteId}?`
  );
  if (!answer) {
    // If the user cancels deletion, do nothing
    return;
  }

  // Construct the URL for deleting the entry
  const url = `http://127.0.0.1:3000/api/entries/${deleteId}`;

  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Set up the options for the DELETE request
  const options = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  // Send the DELETE request to delete the entry
  fetchData(url, options)
    .then((data) => {
      console.log("Entry deleted successfully:", data);
      // Optionally, you can reload the entries after deletion
      getEntries();
    })
    .catch((error) => {
      console.error("Failed to delete entry:", error);
    });
}

// delete entry popup
const deletePopup = document.getElementById("deletePopup");
const deleteOverlay = document.getElementById("deleteOverlay");
const openDeleteBtn = document.querySelector(".deleteBtn");
const closeDeleteBtn = document.getElementById("closeDelete");
const deleteEntryBtn = document.querySelector(".submitDelete");

openDeleteBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  console.log("klikkaus wow");
  deletePopup.style.display = "block";
  deleteOverlay.style.display = "block";
});

closeDeleteBtn.addEventListener("click", function () {
  deletePopup.style.display = "none";
  deleteOverlay.style.display = "none";
});

deleteEntryBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  deletePopup.style.display = "none";
  deleteOverlay.style.display = "none";

  deleteEntry();
});

// event listener for entry deletion
// deleteEntryBtn.addEventListener("click", deleteEntry);
