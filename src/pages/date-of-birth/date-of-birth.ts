import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
/**
 * Generated class for the DateOfBirthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-date-of-birth',
  templateUrl: 'date-of-birth.html',
})
export class DateOfBirthPage {

  checkedbtn : boolean = true; 
  date : any;
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
    dateofbirth: string
  }={     
    countryofbirthIsMexico: false,
    state: "",
    country: "",
    clientId: "",
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    dateofbirth: ""
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
    this.account.gender = this.user.gender; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DateOfBirthPage');
  }

  onChange(value: any) {
    this.date = value;
    if (value ) {      
      console.log("LOG DE VALORES");
      console.log("VALOR ", value);
      this.checkedbtn = false;
    }
  }

  minDateOfBirth(): string {
    var startdate = moment().subtract(12, "years").format('YYYY-MM-DD');
    //console.log("FECHA ",moment().subtract(12, "years").format('YYYY-MM-DD'));
    return moment().subtract(12, "years").format('YYYY-MM-DD');
    //return moment().format('YYYY-MM-DD');
  }

  maxDateOfBirth(): string {
    var startdate = moment().subtract(120, "years").format('YYYY-MM-DD');
    //console.log("FECHA ",moment().subtract(12, "years").format('YYYY-MM-DD'));
    return moment().subtract(120, "years").format('YYYY-MM-DD');
  }

  doActivateCustomerOccupation(){
    var myDateVar = moment(this.date).format('DD MMMM YYYY');     
    console.log("EL DATE OF BIRTH  ES ", myDateVar);  
    this.account.dateofbirth = myDateVar;
    this.navCtrl.push('OccupationPage',this.account);
  }  

}
