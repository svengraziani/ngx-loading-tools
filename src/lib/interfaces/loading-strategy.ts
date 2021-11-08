import {RequestMatchStrategy} from "@anexia/ngx-interceptor-tools";
import {LoadingHandlerStrategy} from "./loading-handler-strategy";

export type LoadingStrategies = LoadingStrategy[];

export interface LoadingStrategy {
  /**
   * Strategy to detect request.
   */
  matcher: RequestMatchStrategy;
  handler: LoadingHandlerStrategy;
}
