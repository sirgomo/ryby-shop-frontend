import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { environment } from "src/environments/environment";

export const jwtInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
  HttpHandlerFn) => {
     const userToken = localStorage.getItem('token');
      if(req.url.indexOf('https://i.ebayimg.com') !== -1) {

        return next(req);
      }
       

     const modifiedReq = req.clone({
       headers: req.headers.set('Authorization', `Bearer ${userToken}`),
      });

     return next(modifiedReq);
  };
