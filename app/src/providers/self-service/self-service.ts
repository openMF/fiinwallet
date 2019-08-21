import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Api } from '../api/api';

/*
  Generated class for the SelfServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SelfServiceProvider {

  _beneficiaries: any;

  constructor(public api: Api) { }


  getTptBeneficiary(userinfo: any){
    console.log('Trying to get the list of third party beneficiaries');
    let seq = this.api.post('getptbeneficiary', userinfo).share();


    seq.subscribe((res: any) => {
      if (res.data) {
        console.log('Fetched the list of beneficiaries from self provider', res.data);
        this._beneficiaries = res.data;
      } else {}
    }, err=> {
      console.log(' The Error is ', err);
    });
    return seq;
  }

  getSAChanges(){

  }









  listBeneficiaries(){
    return this._beneficiaries;
  }


}
