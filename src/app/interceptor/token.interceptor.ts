// import { APIService } from 'src/app/services/api.service';
// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { NgToastService } from 'ng-angular-popup';
// import { Route, Router } from '@angular/router';


// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   constructor(private apiService: APIService, private toastr: NgToastService, private router: Router) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     const myToken = this.apiService.getToken();

//     if(myToken){
//       request = request.clone({
//         setHeaders: {Authorization: `Bearer ${myToken}`}
//       })
//     }

//     return next.handle(request).pipe(
//       catchError((err: any)=>{
//         if(err instanceof HttpErrorResponse){
//           if(err.status === 401){
//             this.toastr.warning({detail:"Warning", summary: "Token is expired, Login again"});
//             this.router.navigate(['login'])
//           }
//         }
//         return throwError(()=> new Error("Some other error occured"));
//       })
//     );
//   }
// }
