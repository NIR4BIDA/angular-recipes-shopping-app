import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, take, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate{
    constructor(private authService:AuthService,private router:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(take(1),map(user=>{
            const isAuth=user?true:false
            if(isAuth){
                return true
            }
            else{
                return this.router.createUrlTree(['/auth'])
            }
        }))
    }
}