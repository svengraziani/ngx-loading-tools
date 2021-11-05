import {RequestMatchStrategy} from "@anexia/ngx-interceptor-tools";

export type LoadingStrategies = LoadingStrategy[];

export interface LoadingStrategy {
  /**
   * Strategy to detect request.
   */
  matcher: RequestMatchStrategy;
  handler: LoadingHandlerStrategy;
}
