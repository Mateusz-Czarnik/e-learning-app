import {Component, OnDestroy, OnInit} from "@angular/core";
import {Slide, SlidesService} from "../../../shared/services/slides/slides.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/operator/switchMap'

@Component({
  selector: 'slide',
  styleUrls: ['slide.component.scss'],
  template: `
      <div class="slide">
          <div class="slide__title">
              <h1>
                  <img src="./img/heart.svg" alt="">
                  <span *ngIf="slide$ | async as slide; else title">
                      {{ slide.name ? 'Edit' : 'Create'}} slide
                  </span>
                  <ng-template #title>
                      Loading
                  </ng-template>
              </h1>
          </div>
          <div *ngIf="slide$ | async as slide; else loading;">
              <slide-form
                [slide]="slide"
                (create)="addSlide($event)"
                (update)="updateSlide($event)"
                (remove)="removeSlide($event)"
              ></slide-form>
          </div>
          <ng-template #loading>
              <div class="message">
                  <img src="/img/loading.svg" alt="">
                  Fetching slide...
              </div>
          </ng-template>
      </div>
  `
})

export class SlideComponent implements OnInit, OnDestroy {

  slide$: Observable<Slide>;
  subscription: Subscription;

  constructor(
    private slidesService: SlidesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.subscription = this.slidesService.slides$.subscribe();
    this.slide$ = this.route.params
      .switchMap(param => {
        return this.slidesService.getSlide(param.id)
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  async addSlide(event: Slide) {
    await this.slidesService.addSlide(event);
    this.backToSlides()
  }

  async updateSlide(event: Slide) {
    const key = this.route.snapshot.params.id;
    await this.slidesService.updateSlide(key, event);
    this.backToSlides()
  }

  async removeSlide(event: Slide) {
    const key = this.route.snapshot.params.id;
    await this.slidesService.removeSlide(key);
    this.backToSlides()
  }

  backToSlides() {
    this.router.navigate(['slides'])
  }
}