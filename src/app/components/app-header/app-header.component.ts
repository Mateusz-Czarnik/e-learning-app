import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {User} from "../../../auth/shared/service/auth/auth.service";

@Component({
  selector: 'app-header',
  styleUrls: ['app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="app-header">
          <div class="wrapper">
              <div
                class="app-header__user-info"
                *ngIf="user?.authenticated"
              >
                  <h1>E-learning app</h1>
                  <span (click)="logoutUser()"></span>
              </div>
          </div>
      </div>
  `
})

export class AppHeaderComponent {
  @Input()
  user: User

  @Output()
  logout = new EventEmitter<any>();

  logoutUser() {
    this.logout.emit()
  }
}