import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
// containers
import {QuizComponent} from "./containers/quiz/quiz.component";
// components
import {QuizSectionComponent} from "./components/quiz-section/quiz-section.component";
import {SharedModule} from "../shared/shared.module";


export const ROUTES: Routes = [
  {path: '', component: QuizComponent}
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule
  ],
  declarations: [
    QuizComponent,
    QuizSectionComponent
  ]
})

export class QuizModule {

}