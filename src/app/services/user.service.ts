import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs-compat/add/observable/of';
import {HttpService} from './http.service';
import {User} from '../../shared/users/User';
import {UserCredentials} from '../../shared/users/UserCredentials';
import {ClientCredentials} from '../../shared/users/ClientCredentials';
import {flatMap} from 'rxjs/internal/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpService,
                private router: Router,
                private cookieService: CookieService) {
    }

    /**
     * Method that logs in a client based on the given client credentials.
     * Returns true if client is correctly logged in.
     *
     * @param {ClientCredentials} clientCredentials
     * @returns {Observable<boolean>}
     */
    login(clientCredentials: ClientCredentials): Observable<boolean> {
        const json = clientCredentials.asJson();
        console.log(json);
        return this.http.post('/auth', json)
            .pipe(
                flatMap((response) => {
                    this.cookieService.set('token', response.body.token);
                    return this.getLoggedUser();
                }),
                map((response) => {
                    console.log(response);
                    this.cookieService.set('UserType', response.type);
                    return true;
                }),
                catchError(err => {
                    console.log(err);
                    return Observable.of(false);
                })
            );
    }

    /**
     * Method that returns a list of all the users.
     *
     * @returns {Observable<User[]>}
     */
    fetchUsers(): Observable<User[]> {
        return this.http.get('/user')
            .pipe(
                map((response) => {
                    return response.body.map(a => Object.assign(User.empty(), a));
                }),
                catchError(err => {
                    console.log(err);
                    return Observable.of([]);
                })
            );
    }

    /**
     * Method that adds a new user to the platform based on the given user credentials.
     * Returns true if user is correctly added.
     *
     * @param {UserCredentials} userCredentials
     * @returns {Observable<boolean>}
     */
    addUser(userCredentials: UserCredentials): Observable<boolean> {
        const json = userCredentials.asJson();
        console.log(json);
        return this.http.post('/user', json)
            .pipe(
                map(() => true),
                catchError(err => {
                    console.log(err);
                    return Observable.of(false);
                })
            );
    }

    /**
     * Method that returns a specific user based on the given user id.
     *
     * @param {string} userId
     * @returns {Observable<User>}
     */
    getUser(userId: string): Observable<User> {
        return this.http.get('/user/' + userId)
            .pipe(
                map((response) => {
                    return Object.assign(User.empty(), response.body);
                }),
                catchError(err => {
                    console.log(err);
                    return Observable.of(null);
                })
            );
    }

    /**
     * Method that returns the logged in user
     *
     * @returns {Observable<User>}
     */
    getLoggedUser(): Observable<User> {
        return this.http.get('/user/me')
            .pipe(
                map((response) => {
                    return Object.assign(User.empty(), response.body);
                }),
                catchError(err => {
                    console.log(err);
                    return null;
                })
            );
    }

    /**
     * Method that deletes a specific user based on the given user id.
     * Returns true if user is correctly deleted.
     *
     * @param {string} userId
     * @returns {Observable<boolean>}
     */
    deleteUser(userId: string): Observable<boolean> {
        return this.http.delete('/user/' + userId)
            .pipe(
                map(() => true),
                catchError(err => {
                    console.log(err);
                    return Observable.of(false);
                })
            );
    }

}
