import {ElasticUser} from "./user";

// Create a new user, possibly parsing a pre-existing one
let user = new ElasticUser(JSON.parse(localStorage.getItem('user')));

// Save the user, the first callback happens as soon as the listener is registered.
user.addListener(u => localStorage.setItem('user', JSON.stringify(u)));

export class UserService {
    static get user() {
        return user
    }
}