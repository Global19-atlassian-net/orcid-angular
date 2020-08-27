import { Injectable, Inject } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { OauthService } from '../core/oauth/oauth.service'
import { OauthParameters, RequestInfoForm } from '../types'
import { oauthSessionHasError, oauthSessionUserIsLoggedIn } from './constants'
import { UserService } from '../core'
import { HttpClient } from '@angular/common/http'
import { WINDOW } from '../cdk/window'

@Injectable({
  providedIn: 'root',
})
export class SignInGuard implements CanActivateChild {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = next.queryParams

    return this._platform.get().pipe(
      switchMap((value) => {
        if (value.oauthMode) {
          return this.handleOauthSession(queryParams as OauthParameters)
        } else {
          return of(true)
        }
      })
    )
  }

  handleOauthSession(queryParams: OauthParameters) {
    // If the show login parameters is present redirect the user to the register
    if (queryParams.show_login === 'false') {
      return of(
        this._router.createUrlTree(['/register'], {
          queryParams: queryParams,
        })
      )
    }
    // check if the user is already login or there are errors
    return this._user.getUserSession(queryParams).pipe(
      map((x) => x.oauthSession),
      map((session) => {
        if (
          !session.forceLogin &&
          oauthSessionUserIsLoggedIn(session) &&
          !oauthSessionHasError(session)
        ) {
          return this._router.createUrlTree(['/oauth/authorize'], {
            queryParams: queryParams,
          })
        } else if (oauthSessionHasError) {
          this.handleOpenIdErrorCodes(session)
        }
        return true
      })
    )
  }

  private handleOpenIdErrorCodes(session: RequestInfoForm) {
    if (session.error) {
      this.window.location.href = `${session.redirectUrl}/?code=${session.error}`
    }
  }
}