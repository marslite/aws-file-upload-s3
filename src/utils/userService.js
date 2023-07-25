import tokenService from './tokenService';



const BASE_URL = '/api/users/';


// this fetch request is making an http POST request to our server
// POST /api/users/signup

// to run the controller function in our routes//users file
// router.post("/signup",  usersCtrl.signup);

function signup(user) {
  return fetch(BASE_URL + 'signup', {
    method: 'POST',
    // headers: new Headers({'Content-Type': 'application/json'}),  // If you are sending a file/photo over
    // what do datatype do you need to change this too?
    // this is the contents of the form that you want to send to the server
    // user must be an object in order JSONIFY
    // body: JSON.stringify(user)
    body: user //Since we are not sending JSON we don't need to stringify this.
    
  })
  // the .thens occur when we get a response from the server!
  .then(res => {
    if (res.ok) return res.json();
    // Probably a duplicate email
    throw new Error('Email already taken!');
  })
  // Parameter destructuring!
  .then(({token}) => tokenService.setToken(token));
  // The above could have been written as
  //.then((token) => token.token);
}



function getUser() {
  return tokenService.getUserFromToken();
}

function logout() {
  tokenService.removeToken();
}

function login(creds) {
  return fetch(BASE_URL + 'login', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(creds)
  })
  .then(res => {
    // Valid login if we have a status of 2xx (res.ok)
    if (res.ok) return res.json();
    throw new Error('Bad Credentials!');
  })
  .then(({token}) => tokenService.setToken(token));
}

export default {
  signup,
  getUser,
  logout,
  login
};