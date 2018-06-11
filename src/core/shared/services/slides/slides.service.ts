import {Injectable} from "@angular/core";
import {Store} from "store";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/observable/of'
import {AngularFireDatabase} from "angularfire2/database";
import {AuthService} from "../../../../auth/shared/service/auth/auth.service";

export interface Slide {
  image: string,
  question: Question,
  $key: string
}

interface Question {
  difficulty: string,
  question: string,
  answers: string[],
  correctAnswer: string
}

@Injectable()
export class SlidesService {

  slides$: Observable<Slide[]> = this.db.list(`slides/${this.uid}`)
    .do(next => this.store.set('slides', next))

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {
  }

  get uid() {
    return this.authService.user.uid
  }

  getSlide(key: string) {
    if (!key) return Observable.of({})
    return this.store.select<Slide[]>('slides')
      .filter(Boolean)
      .map(slides => {
        return slides.find((slide: Slide) => slide.$key === key)
      })
  }

  addSlide(slide: Slide) {
    return this.db.list(`slides/${this.uid}`).push(slide)
  }

  updateSlide(key: string, slide: Slide) {
    return this.db.object(`slides/${this.uid}/${key}`).update(slide)
  }

  removeSlide(key: string) {
    return this.db.list(`slides/${this.uid}`).remove(key)
  }
}