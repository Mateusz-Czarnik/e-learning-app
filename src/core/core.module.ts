import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
// shared modules
import {SharedModule} from "./shared/shared.module";
//guards
import {AuthGuard} from "../auth/shared/guards/auth.guard";

export const ROUTES: Routes = [
    {path: 'quiz', canActivate: [AuthGuard], loadChildren: './quiz/quiz.module#QuizModule'},
    {path: 'slides', canActivate: [AuthGuard], loadChildren: './slides/slides.module#SlidesModule'},
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule.forRoot()
    ]
})

export class CoreModule {

}