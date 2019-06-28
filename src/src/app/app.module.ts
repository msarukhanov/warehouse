import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list.component';
import { Editor } from '../pages/editor/editor.component';
import { Search } from '../pages/search/search.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { ApiService } from '../services/api/api.service'
import { EventsService } from  '../services/events.service'
import { LoaderService } from '../services/app/loader.service'


@NgModule({
  declarations: [
    MyApp,
    ListPage,
    Editor,
    Search
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    EventsService,
    LoaderService
  ]
})
export class AppModule {}
