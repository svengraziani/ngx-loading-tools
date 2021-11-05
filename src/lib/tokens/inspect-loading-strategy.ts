import {InjectionToken} from "@angular/core";


export const INSPECT_LOADING_INTERCEPTOR = new InjectionToken<boolean>('specifies if interceptor console logs are active', {
  factory() {
    return false;
  }
})
