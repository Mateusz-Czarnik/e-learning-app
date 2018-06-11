import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormControl, Validators} from "@angular/forms";
import {Slide} from "../../../shared/services/slides/slides.service";

@Component({
  selector: 'slide-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['slide-form.component.scss'],
  template: `
      <div class="slide-form">
          <form [formGroup]="form"
          >
              <div class="slide-form__name">
                  <label>
                      <h3>Slide image</h3>
                      <img
                        class="slide-form__image-preview"
                        [src]="imagePreview || './img/blank.png'"
                        alt="Image preview"
                      >
                      <input
                        type="file"
                        (change)="handleFileChange($event)"
                      >
                      <div class="error" *ngIf="required('image')">
                          Slide image is required
                      </div>
                  </label>
              </div>
              <div
                class="slide-form__food"
                formGroupName="question"
              >
                  <label>
                      <h3>Slide question</h3>
                      <input
                        type="text"
                        placeholder="assad"
                        formControlName="question"
                      >
                      <div class="error" *ngIf="required('question.question')">
                          Slide question is required
                      </div>
                  </label>
                  <label>
                      <h3>Slide difficulty</h3>
                      <label>
                          <div class="slide-form__answer-wrapper">
                              <input
                                class="slide-form__answer-checkbox"
                                name="difficulty"
                                type="radio"
                                formControlName="difficulty"
                                value="easy"
                              >
                              <p>Easy</p>
                          </div>
                      </label>
                      <label>
                          <div class="slide-form__answer-wrapper">
                              <input
                                class="slide-form__answer-checkbox"
                                name="difficulty"
                                type="radio"
                                formControlName="difficulty"
                                value="medium"
                              >
                              <p>Medium</p>
                          </div>
                      </label>
                      <label>
                          <div class="slide-form__answer-wrapper">
                              <input
                                class="slide-form__answer-checkbox"
                                name="difficulty"
                                type="radio"
                                formControlName="difficulty"
                                value="hard"
                              >
                              <p>Hard</p>
                          </div>
                      </label>
                      <div class="error" *ngIf="required('question.difficulty')">
                          Slide difficulty is required
                      </div>
                  </label>
                  <div class="">
                      <h3>Slide answers</h3>
                      <div class="slide-form__subtitle">
                          <input
                            type="text"
                            #newAnswer
                          >
                          <button
                            type="button"
                            class="slide-form__add"
                            (click)="addAnswer(newAnswer.value)"
                          >
                              <img src="./img/add-white.svg" alt="">
                              Add answer
                          </button>
                      </div>
                      <div formArrayName="answers">
                          <h3 *ngIf="answers.length">Select answer to mark it as correct</h3>
                          <label *ngFor="let answer of answers.controls; index as i;">
                              <div class="slide-form__answer-wrapper">
                                  <input
                                    class="slide-form__answer-checkbox"
                                    type="radio"
                                    name="question.correctAnswer"
                                    value="{{answer.value}}"
                                    (change)="onRadioChange(answer.value)"
                                    [checked]="form.get('question.correctAnswer').value === answer.value"
                                  >
                                  <p>{{answer.value}}</p>
                                  <span class="slide-form__remove" (click)="removeAnswer(i)"></span>
                              </div>
                          </label>
                      </div>
                      <div class="error" *ngIf="answers.errors">
                          At least two answers are required
                      </div>
                      <div class="error" *ngIf="required('question.correctAnswer')">
                          Correct answer is required
                      </div>
                  </div>


              </div>
              <div class="slide-form__submit">
                  <div>
                      <button
                        type="button"
                        class="button"
                        *ngIf="!exists"
                        (click)="createSlide()"
                      >Create slide
                      </button>
                      <button
                        type="button"
                        class="button"
                        *ngIf="exists"
                        (click)="updateSlide()"
                      >Save
                      </button>
                      <a [routerLink]="['../']" class="button button--cancel">Cancel</a>
                  </div>
                  <div
                    class="slide-form__delete"
                    *ngIf="exists"
                  >
                      <div *ngIf="toggled">
                          <p>Delete item?</p>
                          <button
                            type="button"
                            class="confirm"
                            (click)="removeSlide()"
                          >Yes
                          </button>
                          <button
                            type="cancel"
                            class="confirm"
                            (click)="toggle()"
                          >No
                          </button>
                      </div>
                      <button class="button button--delete" type="button" (click)="toggle()">
                          Delete
                      </button>
                  </div>
              </div>
          </form>
      </div>
  `
})

export class SlideFormComponent implements OnChanges {
  toggled = false;

  exists = false;

  imagePreview: string;

  @ViewChild('newAnswer')
  newAnswerRef: ElementRef;

  @Input()
  slide: Slide;

  @Output()
  create = new EventEmitter<Slide>()

  @Output()
  update = new EventEmitter<Slide>()

  @Output()
  remove = new EventEmitter<Slide>()

  form = this.fb.group({
    image: [null, Validators.required],
    question: this.fb.group({
      difficulty: ['easy', Validators.required],
      answers: this.fb.array([], Validators.compose([Validators.required, Validators.minLength(2)])),
      question: ['', Validators.required],
      correctAnswer: ['', Validators.required]
    }),
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.slide && this.slide.question) {
      const value = this.slide;

      this.exists = true;
      this.emptyAnswers()
      this.form.patchValue(value)
      this.imagePreview = value.image

      if (value.question.answers) {
        for (const item of value.question.answers) {
          this.answers.push(new FormControl(item))
        }
      }
    }
  }

  emptyAnswers() {
    while (this.answers.controls.length) {
      this.answers.removeAt(0);
    }
  }

  get answers() {
    return this.form.get('question.answers') as FormArray;
  }


  required(control: string) {
    return this.form.get(control).hasError('required')
  }

  onRadioChange(value: any) {
    this.correctAnswer.patchValue(value);
  }

  get correctAnswer() {
    return this.form.get('question.correctAnswer');
  }

  createSlide() {
    if (this.form.valid) {
      this.create.emit(this.form.value)
    }
  }

  updateSlide() {
    if (this.form.valid) {
      this.update.emit(this.form.value)
    }
  }

  removeSlide() {
    this.remove.emit(this.form.value)
  }

  addAnswer(value: string) {
    if (value) {
      this.answers.push(new FormControl(value));
      this.newAnswerRef.nativeElement.value = '';
    }
  }

  removeAnswer(index: number) {
    if (this.answers.at(index).value === this.correctAnswer.value) this.form.get('question.correctAnswer').patchValue('');
    this.answers.removeAt(index)
  }

  toggle() {
    this.toggled = !this.toggled
  }

  handleFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imagePreview = 'asdsadsa'
        this.form.patchValue({
          image: reader.result
        });
      }

      reader.onloadend = () => {
        this.imagePreview = reader.result

        this.cdr.detectChanges();
      }
    }
  }
}