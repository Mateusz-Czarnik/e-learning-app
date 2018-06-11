import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'list-item',
  styleUrls: ['list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="list-item">
          <div class="list-item__details">
              <div class="list-item__image-wrapper">
                  <img src="{{item.image}}" class="list-item__image">
              </div>
              <p class="list-item__name">{{item.question.question}}</p>
          </div>
          <a
            [routerLink]="getRoute(item)"
            type="button"
            class="edit"
          ><img src="/img/settings.svg" alt=""></a>
      </div>
  `
})

export class ListItemComponent {

  @Input()
  item: any;

  @Output()
  remove = new EventEmitter<any>();

  constructor() {

  }

  getRoute(item: any) {
    return ['../slides', item.$key]
  }
}