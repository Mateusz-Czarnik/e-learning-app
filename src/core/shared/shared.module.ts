import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
// third-party modules
import {AngularFireDatabaseModule} from "angularfire2/database";
// components
import {ListItemComponent} from './components/list-item/list-item.component'
import {SlidesService} from "./services/slides/slides.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularFireDatabaseModule
  ],
  declarations: [
    ListItemComponent,
  ],
  exports: [
    ListItemComponent,
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        SlidesService
      ]
    }
  }
}