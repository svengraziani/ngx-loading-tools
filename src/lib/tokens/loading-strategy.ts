import {InjectionToken} from "@angular/core";
import {LoadingStrategy} from "../interfaces/loading-strategy";
export const LOADING_STRATEGY = new InjectionToken<LoadingStrategy>('Loading strategy token');
