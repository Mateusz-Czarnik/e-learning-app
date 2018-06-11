import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from "@angular/core";
import {Slide} from "../../../shared/services/slides/slides.service";

import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/observable/timer';

import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'quiz-section',
  styleUrls: ['quiz-section.component.scss'],
  template: `
      <div class="quiz-section">
          <div *ngIf="!quizFinished; else finished">
              <div class="quiz-section__image-wrapper" *ngIf="showImage; else showQuestion">
                  <img 
                    src="{{ selectedSlide.image }}" 
                    class="quiz-section__image"
                    alt="Slide img"
                  >
              </div>
              <ng-template #showQuestion>
                  <div [formGroup]="form">
                      <h2 class="quiz-section__question">{{ selectedSlide.question.question }}</h2>
                      <label class="quiz-section__answer" *ngFor="let answer of selectedSlide.question.answers">
                          <input
                            class="quiz-section__radio"
                            type="radio"
                            formControlName="answer"
                            name="answer"
                            value="{{answer}}"
                          >
                          <p class="quiz-section__answer-text">{{answer}}</p>
                      </label>
                      <hr>
                      <button
                        (click)="handleClick()"
                      >Answer
                      </button>
                  </div>
              </ng-template>
          </div>
          <ng-template #finished>
              <h1>Congratulations - you won!</h1>
              <button
                type="button"
                (click)="handleReplayClick()"
              >Play again
              </button>
          </ng-template>
      </div>
  `
})

export class QuizSectionComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    private fb: FormBuilder
  ) {
  }

  @Input()
  slides: Slide[];

  @Input()
  quizFinished: boolean;

  @Output()
  update = new EventEmitter<string>();

  @Output()
  replay = new EventEmitter<string>();

  form = this.fb.group({
    answer: ['', Validators.required],
    difficulty: '',
    correctAnswer: ''
  });

  timer: Observable<any>;
  selectedSlide: Slide;
  subscription: Subscription;
  lastSelectedIndex: number;
  showImage: boolean = false;

  ngOnInit() {
    this.loadSlide()
  }

  loadSlide() {
    let randomSlideIndex = Math.floor(Math.random() * this.slides.length);

    this.selectedSlide = this.slides[randomSlideIndex];
    this.lastSelectedIndex = randomSlideIndex

    this.form.reset();
    this.updateFormData({
      difficulty: this.selectedSlide.question.difficulty,
      correctAnswer: this.selectedSlide.question.correctAnswer
    });
    this.setTimer()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.slides) this.loadSlide();
  }

  updateFormData(data: any) {
    this.form.patchValue({
      difficulty: data.difficulty,
      correctAnswer: data.correctAnswer
    });
  }

  setTimer() {
    this.showImage = true;

    this.timer = Observable.timer(3000);
    // this.timer = Observable.timer(3000);
    this.subscription = this.timer.subscribe(() => {
      this.showImage = false;
    });
  }

  handleClick() {
    if (this.form.valid) {
      this.update.emit(this.form.value)
    }
  }

  handleReplayClick() {
    this.replay.emit('Gramy znowu!')
  }
}