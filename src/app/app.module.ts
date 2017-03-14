import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { NewlightPage } from '../pages/newlight/newlight';
import { MapPage } from '../pages/map/map';



import {AuthService } from '../services/auth';
import {DatabaseService } from '../services/database';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SigninPage,
    SignupPage,
    NewlightPage,
    MapPage

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninPage,
    SignupPage,
    NewlightPage,
    MapPage
    
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService, DatabaseService]
})
export class AppModule {}
