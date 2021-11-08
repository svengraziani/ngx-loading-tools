import {BehaviorSubject} from 'rxjs';
import {distinctUntilChanged, shareReplay} from 'rxjs/operators';
import {LoadingHandlerStrategy} from "../interfaces/loading-handler-strategy";

export class LoadingHandler implements LoadingHandlerStrategy {
  private _loadingState = new BehaviorSubject(false);
  public isLoading$ = this._loadingState.asObservable().pipe(distinctUntilChanged(), shareReplay(1));

  public start(request: any): void {
    this._loadingState.next(true);
  }

  public stop(request: any): void {
    this._loadingState.next(false);
  }
}
