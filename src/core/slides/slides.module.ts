import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {SlideFormComponent} from "./components/slide-form/slide-form.component";
import {SlidesComponent} from "./containers/slides/slides.component";
import {SlideComponent} from "./containers/slide/slide.component";

export const ROUTES: Routes = [
  {path: '', component: SlidesComponent},
  {path: 'new', component: SlideComponent},
  {path: ':id', component: SlideComponent}
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule
  ],
  declarations: [
    SlidesComponent,
    SlideComponent,
    SlideFormComponent
  ],
})

export class SlidesModule {

}