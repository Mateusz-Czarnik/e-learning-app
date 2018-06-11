import {Component, OnDestroy, OnInit} from "@angular/core";

import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Store} from "store";
import {Slide, SlidesService} from "../../../shared/services/slides/slides.service";

@Component({
  selector: 'slides',
  styleUrls: ['slides.component.scss'],
  template: `
      <div class="slides">
          <div class="slides__title">
              <h1>
                  <img src="/img/heart.svg" alt="">
                  Your slides
              </h1>
              <a
                class="btn__add"
                [routerLink]="['../slides/new']"
              >
                  <img src="./img/add-white.svg" alt="">
                  New slide
              </a>
          </div>
          <div *ngIf="slides$ | async as slides; else loading;">
              <div class="message" *ngIf="!slides.length">
                  <img src="./img/face.svg" alt="">
                  No slides, add a new slide to start
              </div>
              <list-item
                *ngFor="let slide of slides"
                [item]="slide"
              >
              </list-item>
          </div>
          <ng-template #loading>
              <div class="message">
                  <img src="/img/loading.svg" alt="">
                  Fetching slides...
              </div>
          </ng-template>
      </div>
  `
})

export class SlidesComponent implements OnInit, OnDestroy {
  slides$: Observable<Slide[]>;
  subscription: Subscription;

  constructor(
    private slidesService: SlidesService,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.slides$ = this.store.select<Slide[]>('slides');
    this.subscription = this.slidesService.slides$.subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}