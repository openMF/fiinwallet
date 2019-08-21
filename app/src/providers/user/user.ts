import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;
  _beneficiaries: any;

  constructor(public api: Api) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /*getTptBeneficiary(userinfo: any){
    console.log('Trying to get the list of third party beneficiaries');
    let seq = this.api.post('getptbeneficiary', userinfo).share();


    seq.subscribe((res: any) => {
      if (res.data) {
        console.log('Fetched the list of beneficiaries', res.data);
        this._beneficiaries = res.data;
      } else {}
    }, err=> {
      console.log(' The Error is ', err);
    });
    return seq;
  }*/

  applySavingsAccount(userinfo: any) {
    let seq = this.api.post('savingsaccounts', userinfo).share();

    seq.subscribe((res: any) => {
    if (res.status == 'success') {
      console.log('Okay, your savings account is applied');
    } else {
    }}, err =>{
        console.log('ERROR', err)
    });
    return seq;
  }

  /**
   * Send a POST request to our create endpoint with the data
   * the user entered on the form.
   */
  create(accountInfo: any) {
    let seq = this.api.post('create', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(res.status);
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our activate endpoint with the data
   * the user entered on the form.
   */
  activate(accountInfo: any) {
    console.log("SE ENVIA AL API ",accountInfo);
    let seq = this.api.post('activate', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(res.status);
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

/**
   * Send a POST request to our activate endpoint with the data
   * the user entered on the form.
   */
  activateLevel1(accountInfo: any) {
    console.log("SE ENVIA AL API ",accountInfo);
    let seq = this.api.post('activateLevel1', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(res.status);
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(res.status);
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  userinfo(){
    return this._user;
  }

  /*listBeneficiaries(){
    return this._beneficiaries;
  }
*/
  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
