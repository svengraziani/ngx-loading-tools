import {LoadingHandlerStrategy} from "../interfaces/loading-handler-strategy";
import {HttpRequest} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Memoize} from "typescript-memoize";
import {distinctUntilChanged, shareReplay, switchMap} from "rxjs/operators";
import {RequestMatchSelectorStrategy} from "@anexia/ngx-interceptor-tools";

export type DistinctLoadingStateDict = { [selector: string]: boolean }

export class DistinctLoadingHandler implements LoadingHandlerStrategy {

  private _loadingStateSubject = new BehaviorSubject<DistinctLoadingStateDict>({});

  public constructor(private selector: RequestMatchSelectorStrategy) {
  }

  public start(request: HttpRequest<any>): void {
    this._updateState(this.selector(request), true);
  }

  public stop(request: HttpRequest<any>): void {
    this._updateState(this.selector(request), false);
  }

  @Memoize((requestSelector) => requestSelector)
  public isLoading$(requestSelector: string): Observable<boolean> {
    return this._loadingStateSubject.asObservable().pipe(
      switchMap(currentState => {
        if (!currentState.hasOwnProperty(requestSelector)) {
          return of(false);
        }
        return of(currentState[requestSelector]);
      }),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  private _updateState(requestId: string, value: boolean): void {
    const currentState = this._loadingStateSubject.getValue();
    const newState = {...currentState, [requestId]: value};
    this._loadingStateSubject.next(newState);
  }
}
