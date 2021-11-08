import {Provider} from "@angular/core";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {WebServiceLoadingInterceptor} from "../interceptors/web-service-loading.interceptor";


export function provideInterceptorConfig(): Provider {
  return {provide: HTTP_INTERCEPTORS, useExisting: WebServiceLoadingInterceptor, multi: true};
}
