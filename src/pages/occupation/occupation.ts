import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OccupationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-occupation',
  templateUrl: 'occupation.html',
})
export class OccupationPage {

  checkedbtn : boolean = true;  
  occupation : any;
  user: any;  

  account: {     
    countryofbirthIsMexico: boolean,
    state: string,
    country: string,
    clientId: string,
    firstname: string,
    middlename: string,
    lastname: string,
    gender: string,
    dateofbirth: string,
    occupation: string
  }={     
    countryofbirthIsMexico: false,
    state: "",
    country: "",
    clientId: "",
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    dateofbirth: "",
    occupation: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.data;
    console.log("EL USUARIO EN DATE OF BIRTH  ES ", this.user);       
    this.account.clientId = this.user.clientId;
    this.account.state = this.user.state;
    this.account.country = this.user.country;   
    this.account.firstname = this.user.firstname;
    this.account.middlename = this.user.middlename;
    this.account.lastname = this.user.lastname;
    this.account.dateofbirth = this.user.dateofbirth;
    this.account.gender = this.user.gender;
  }

  select(item) {
    //console.log("VALOR EVENTO SELECT ",item);
    this.occupation = item;
    console.log("Occupation ",this.occupation);
    this.checkedbtn = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OccupationPage');
  }

  doActivateCustomerMobilePhone(){
    var occupation ="";
    if(this.occupation === 'wageearner')
      occupation = "55";
    if(this.occupation === 'publicservant')
      occupation = "56";      
    if(this.occupation === 'enterpreneur')
      occupation = "57";
    if(this.occupation === 'independent')
      occupation = "58";      
    if(this.occupation === 'association')
      occupation = "59";            
    if(this.occupation === 'student')
      occupation = "60";   
    if(this.occupation === 'other')
      occupation = "61";            
    console.log("Occupation ",occupation);
    this.account.occupation = occupation;
    this.navCtrl.push('CellPhoneNumberPage', this.account);
  }

}
