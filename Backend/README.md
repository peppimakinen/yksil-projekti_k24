# Hyte web dev example back-end server

**Node.js + Express**

(Check weekly branches too.)

## Usage

Installation: clone/download code & `npm i`

Start the dev server: `npm run dev` / `npm start`

Test with browser/Postman/etc:

 - GET <http://127.0.0.1:3000/items>
   - GET <http://127.0.0.1:3000/items/<id>>
 - GET <http://127.0.0.1:3000/users>
 - GET <http://127.0.0.1:3000/entries>


## Authorization rules

### Entry routes

#### PUT

- Only the entry owner can update the entry.

#### DELETE

- Only the entry owner can delete the entry.

### User routes

#### PUT

- Only the user owner can update the entry.

#### DELETE

- Only the user owner can delete the entry.
