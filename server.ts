import 'zone.js/node';

import { APP_BASE_HREF, isPlatformServer } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import 'localstorage-polyfill'
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { importProvidersFrom } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routes } from 'src/app/app-routing.module';
import { applyDomino } from '@ntegral/ngx-universal-window';
import { provideRouter } from '@angular/router';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from 'src/app/const';
import { jwtInterceptorFn } from 'src/app/interceptors/jwtInterceptorFn';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


global['localStorage'] = localStorage;
//
const BROWSER_DIR = join(process.cwd(), 'dist/ryby-shop-frontend/browser');
applyDomino(global, join(BROWSER_DIR, 'index.html'));

(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ryby-shop-frontend/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: () => bootstrapApplication(AppComponent, {
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptorFn])),
        {
          provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
        },
        provideRouter(routes),
        importProvidersFrom(JwtModule.forRoot({})),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(AppRoutingModule),
        importProvidersFrom(MatSnackBarModule),
        provideClientHydration(),
      ],
    })
   //bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
