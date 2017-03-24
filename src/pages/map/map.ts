import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { DatabaseService } from "../../services/database";

import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";

import { SpecificLightPage } from "../specific-light/specific-light";

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    private location: any = {
        lat: 33.458772,
        lng: -88.832629
    }

    public toggleView: boolean = true;

    constructor(private modalCtrl: ModalController, private databaseService: DatabaseService, private authService: AuthService, private lightService: LightService, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

    openLight(lightId, type) {

        this.lightService.setSpecificLight(lightId, type);
        const modal = this.modalCtrl.create(SpecificLightPage);
        modal.present();
    }

    dismiss() {
        console.log("TEST)");
    }

    toggleMapView() {

        this.toggleView = !this.toggleView;

        console.log(this.toggleView);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MapPage');

        const loading = this.loadingCtrl.create({
            content: "Verifying Light..."
        });

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.getLights(token, 'master')
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            if (data == null) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "Fatal Error, please start over.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else {

                                this.lightService.userMasterLights = [];

                                for (var j in data) {
                                    data[j]['lightId'] = j;
                                    if (data[j].sms == null) {

                                        this.lightService.userSlaveLights.push(data[j]);
                                    } else {

                                        this.lightService.userMasterLights.push(data[j]);
                                    }
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
