import {Inject, Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {LOADING_STRATEGY} from '../tokens/loading-strategy';
import {catchError, tap} from 'rxjs/operators';
import {INSPECT_LOADING_INTERCEPTOR} from "../tokens/inspect-loading-strategy";
import {LoadingStrategies} from "../interfaces/loading-strategy";

@Injectable({providedIn: 'root'})
export class WebServiceLoadingInterceptor implements HttpInterceptor {
  public constructor(
    @Inject(LOADING_STRATEGY) private readonly strategies: LoadingStrategies,
    @Inject(INSPECT_LOADING_INTERCEPTOR) private readonly inspectLoadingInterceptor: boolean
  ) {
  }

  public intercept(request: HttpRequest<unknown>, delegate: HttpHandler): Observable<any> {
    if (!this.strategies) {
      return delegate.handle(request);
    }
    // run loading strategy matcher against request
    const matchingStrategies = this.strategies.filter(matchStrategy => matchStrategy.matcher.match(request));

    if (this.inspectLoadingInterceptor) {
      console.log(request, matchingStrategies, this.strategies);
    }

    // if no loading strategy matches
    if (matchingStrategies.length === 0) {
      return delegate.handle(request);
    }

    return delegate.handle(request).pipe(
      tap(httpEvent => {
        if (httpEvent instanceof HttpResponse) {
          this.stopStrategies(matchingStrategies, request);
        } else {
          matchingStrategies.forEach(matchingStrategy => matchingStrategy.handler.start(request));
        }
      }),
      catchError(error => {
        this.stopStrategies(matchingStrategies, request);
        return throwError(error);
      })
    );
  }

  private stopStrategies(matchingStrategies: LoadingStrategies, request: HttpRequest<any>): void {
    matchingStrategies.forEach(matchingStrategy => matchingStrategy.handler.stop(request));
  }
}
