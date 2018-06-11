import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";

// third-party modules
import {AngularFireModule, FirebaseAppConfig} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";

// shared modules
import {SharedModule} from "./shared/shared.module";

export const ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'login'},
      {path: 'login', loadChildren: './login/login.module#LoginModule'},
      {path: 'register', loadChildren: './register/register.module#RegisterModule'}
    ]
  }
];

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyA4gMu202CT738OzCECOsOJ2QWUqRF09iY",
  authDomain: "e-learning-app-46c4b.firebaseapp.com",
  databaseURL: "https://e-learning-app-46c4b.firebaseio.com",
  projectId: "e-learning-app-46c4b",
  storageBucket: "e-learning-app-46c4b.appspot.com",
  messagingSenderId: "75739444383"
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SharedModule.forRoot()
  ]
})

export class AuthModule {

}