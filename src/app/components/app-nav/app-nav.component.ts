import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'app-nav',
  styleUrls: ['app-nav.component.scss'],
  // Prevent component change
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="app-nav">
          <div class="wrapper">
              <a routerLink="quiz" routerLinkActive="active">Quiz</a>
              <a routerLink="slides" routerLinkActive="active">Slides</a>
          </div>
      </div>
  `
})

export class AppNavComponent {

}