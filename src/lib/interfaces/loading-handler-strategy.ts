import {HttpRequest} from '@angular/common/http';

export interface LoadingHandlerStrategy {
  start(request: HttpRequest<any>): void;
  stop(request: HttpRequest<any>): void;
}
