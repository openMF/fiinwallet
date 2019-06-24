import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sex',
  templateUrl: 'sex.html',
})
export class SexPage {

  checkedbtn : boolean = true;  
  sex : any;
  public itemChecked;
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
  }={     
    countryofbirthIsMexico: false,
    state: "",
    country: "",
    clientId: "",
    firstname: "",
    middlename: "",
    lastname: "",
    gender: ""
  };


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.data;
    console.log("EL USUARIO EN SEX  ES ", this.user);       
    this.account.clientId = this.user.clientId;
    this.account.state = this.user.state;
    this.account.country = this.user.country;   
    this.account.firstname = this.user.firstname;
    this.account.middlename = this.user.middlename;
    this.account.lastname = this.user.lastname; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountryOfBirthPage');
  }

  select(item) {
    //console.log("VALOR EVENTO SELECT ",item);
    this.sex = item;
    console.log("GENERO ",this.sex);
  }

  doActivateCustomerDateOfBirth(){
    var gender ="";
    if(this.sex === 'male')
      gender = "15";
    if(this.sex === 'female')
      gender = "53";      
    if(this.sex === 'lgbtti')
      gender = "54";
    this.account.gender = gender;
    this.navCtrl.push('DateOfBirthPage',this.account);
  }

  onChange(value: any) {
    this.sex = value;
    if (value ) {      
      //console.log("LOG DE VALORES");
      //console.log("VALOR ON CHANGE ", value);
      this.checkedbtn = false;
    }
  }

  enableButton(event: any){    
    this.checkedbtn = false;
    //console.log("VISIBLE ",this.checkedbtn);
    //console.log("VALOR EVENTO ",event);
    //let val = event.target.value;    
    //console.log("VALOR ",val);    
    
  }

}
