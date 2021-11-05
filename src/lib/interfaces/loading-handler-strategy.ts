import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

export interface LoadingHandlerStrategy {
  isLoading$: Observable<boolean>;

  start(request: HttpRequest<any>): void;

  stop(request: HttpRequest<any>): void;
}
