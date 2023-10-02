import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { HelperService } from "../helper/helper.service";
import { finalize } from "rxjs";

export const LoaderInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const loaderService = inject(HelperService);
    if(loaderService) {
      loaderService.showLoader.next(true);
    }
    return next(req).pipe(
      finalize(() => {
        if(loaderService)
          loaderService.showLoader.next(false);
      })
    );
}
