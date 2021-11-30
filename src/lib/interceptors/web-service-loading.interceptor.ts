import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {LOADING_STRATEGY} from '../tokens/loading-strategy';
import {catchError, finalize, tap} from 'rxjs/operators';
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

    let requestCancelled = true;
    return delegate.handle(request).pipe(
      tap((httpEvent: HttpEvent<any>) => {

        if(httpEvent?.type === 4) {
          requestCancelled = false;
        }

        if(httpEvent?.type === 0) {
          matchingStrategies.forEach(matchingStrategy => matchingStrategy.handler.start(request));
        }
      }),
      catchError(error => {
        requestCancelled = false;
        this.stopStrategies(matchingStrategies, request);
        return throwError(error);
      }),
      finalize(() => {
        if(requestCancelled) {
          this.stopStrategies(matchingStrategies, request);
        }
      })
    );
  }

  private stopStrategies(matchingStrategies: LoadingStrategies, request: HttpRequest<any>): void {
    matchingStrategies.forEach(matchingStrategy => matchingStrategy.handler.stop(request));
  }
}
