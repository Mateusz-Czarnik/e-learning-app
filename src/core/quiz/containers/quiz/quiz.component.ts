import {Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";

import {Store} from "store";
import {Subscription} from "rxjs/Subscription";

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/do'

import {Slide, SlidesService} from "../../../shared/services/slides/slides.service";

interface QuizStages {
  [key: string]: {
    [key: string]: string
  }
}

@Component({
  selector: 'quiz',
  styleUrls: ['quiz.component.scss'],
  template: `
      <div class="quiz">
          <div *ngIf="filteredSlides; else loading;">
              <div *ngIf="filteredSlides.length; else noSlides">
                  <quiz-section
                    [quizFinished]="isFinished"
                    [slides]="filteredSlides"
                    (update)="handleUpdate($event)"
                    (replay)="handleReplay($event)"
                  ></quiz-section>
              </div>
              <ng-template #noSlides>
                  <div class="message">
                      <img src="/img/loading.svg" alt="">
                      No slides in database!
                  </div>
              </ng-template>
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

export class QuizComponent implements OnInit, OnDestroy {

  isFinished: boolean = false;
  slides$: Observable<Slide[]>;
  filteredSlides: Slide[];
  subscription: Subscription;
  quizStages: QuizStages = {
    easy: {
      prevStage: 'easy',
      nextStage: 'medium'
    },
    medium: {
      prevStage: 'easy',
      nextStage: 'hard'
    },
    hard: {
      prevStage: 'medium',
      nextStage: 'finish'
    }
  };
  currentStage = 'easy';

  constructor(
    private slidesService: SlidesService,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.slides$ = this.store.select('slides');
    this.subscription = this.slidesService.slides$.subscribe((slides) => this.filterSlidesByDifficulty(slides, this.currentStage));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleUpdate(data: any) {
    if (data.answer === data.correctAnswer) {
      let nextStage = this.quizStages[data.difficulty].nextStage;

      if (nextStage === 'finish') {
        this.isFinished = true;
      } else {
        this.currentStage = nextStage;
        this.getSlides()
      }
    } else {
      let prevStage = this.quizStages[data.difficulty].prevStage;
      this.currentStage = prevStage;
      this.getSlides()
    }
  }

  handleReplay(event: string) {
    this.currentStage = 'easy';
    this.isFinished = false;
    this.getSlides()
  }

  getSlides() {
    this.slides$.subscribe((slides) => this.filterSlidesByDifficulty(slides, this.currentStage))
  }

  filterSlidesByDifficulty(slides: Slide[], difficulty: string) {
    this.filteredSlides = slides
      .filter(slide => slide.question.difficulty === difficulty)
  }
}