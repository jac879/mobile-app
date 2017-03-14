import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AuthService } from "../../services/auth";
import { DatabaseService } from "../../services/database";

import { NewlightPage } from '../newlight/newlight';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private authService: AuthService, private databaseService: DatabaseService) {
    
  }

  test(){

  	this.authService.getToken()
  	.then((token) => {
  		this.databaseService.putData(token)
  		.subscribe(
  			() => { console.log("SUSSSESS"); },
  			error => { console.log(error) }
  			);

  	})

  }

  map()
  {
  	this.navCtrl.push(MapPage);
  }

  newLight()
  {
  	this.navCtrl.push(NewlightPage);
  }

}
