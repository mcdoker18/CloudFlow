// Copyright (C) 2017 Nokia

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Injectable, Injector} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";

/**
 * Add the X-Auth-Token header to all http requests
 */
@Injectable()
export class AuthIntercept implements HttpInterceptor {
    oauthService: OAuthService;  // https://github.com/angular/angular/issues/18224
    constructor(/*private oauthService: OAuthService*/ private injector: Injector) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.oauthService = this.injector.get(OAuthService);
        const token = this.oauthService.getAccessToken() || '';
        const cloneReq = req.clone({headers: req.headers.set("X-Auth-Token", token)});
        return next.handle(cloneReq);
    }
}
