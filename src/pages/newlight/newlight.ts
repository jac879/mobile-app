import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { DatabaseService } from "../../services/database";

import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";

import { SetLightLocationPage } from '../set-light-location/set-light-location';
/*
  Generated class for the Newlight page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-newlight',
    templateUrl: 'newlight.html'
})
export class NewlightPage {

    constructor(private databaseService: DatabaseService, private lightService: LightService, private authService: AuthService, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewlightPage');
    }

    onNewLight(form: NgForm) {
        console.log(form.value.light);

        const loading = this.loadingCtrl.create({
            content: "Verifying Light..."
        });

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.getLight(token, form.value.light)
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            if (data == null) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "No light was found.  Please re-enter the light code.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.used == true) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "This light is already in use.  Please re-enter the light code.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            }
                            else if(data.used == false){

                            	if(data.sms != null)
                            	{

                            		this.lightService.newLight(form.value.light, data.sms, this.authService.getActiveUser().uid);
                            		this.navCtrl.push(SetLightLocationPage);
                            	}
                            	else
                            	{

                            	}
                            }

                        },
                        (error) => {
                            console.log(error);
                            loading.dismiss();


                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "There was an error connecting to the database.  Please check your network connection and try again.",
                                    buttons: ['ok']
                                });
                                alert.present();
                        }
                    );

            })
    }

}
