import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import 'localstorage-polyfill'
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import {  provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { importProvidersFrom } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routes } from 'src/app/app-routing.module';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from 'src/app/const';
import { jwtInterceptorFn } from 'src/app/interceptors/jwtInterceptorFn';
import { environment } from 'src/environments/environment';
import { getProductUrl } from 'src/app/helper/helper.service';




const compression = require('compression')

global['localStorage'] = localStorage;

(global as any).window = new Window();
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ryby-shop-frontend/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');
  const bodyParser = require('body-parser');
  const commonEngine = new CommonEngine();

  server.use(compression({ level: 6}));
  server.use(bodyParser.json({ limit: '10mb' }));
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.get('/sitemap.xml', async (req, res, next) => {

    try {

      const paath = path.join(distFolder, './assets/sitemap.xml');

      fs.readFile(paath, (err, data) => {
        if(err) {
          console.error('File not found....', err)
          res.status(500).send('File not found....');
        } else {
          res.header('Content-Type', 'application/xml');
          res.status(200).sendFile(paath);
        }

      })

    } catch (e) {
      res.send(500).end();
        next(e);
    }
});
server.get('/gen-map', async (req, res, next) => {
  try {
    const api = environment.api+'product'+'/map/map';
    const paath = path.join(distFolder, './assets/sitemap.xml');
    const products = await fetch(api, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml',
      }
    });
    const items: {id: number, name: string}[] = await products.json();


    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`.concat(
    items.map(
      (prod, index) => (
        `<url>\n<loc>${environment.url+getProductUrl('products', prod.id, prod.name).join('/')}</loc>\n
        <lastmod>${new Date(Date.now()).toISOString().split('T')[0]}</lastmod>\n</url>`
      )
    ).join('\n')
  ).concat('\n</urlset>');

  fs.writeFileSync(paath, sitemap);

    res.sendStatus(201).end();


  } catch (err) {
    res.send(500).end();
    next(err);
  }
})
server.delete('/deletexml', async (req, res, next) => {

  try {
    const paath = path.join(distFolder, './assets/sitemap.xml');
    fs.unlink(paath, (err) => {
      if(err) {
        console.error('File not found....', err)
        res.status(500).send('File not found....');
      }
      else
      res.sendStatus(200).end();
    })
  } catch (err) {
    res.send(500).end();
    next(err)
  }
})
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine.render({
      bootstrap: () => bootstrapApplication(AppComponent, {
        providers: [
          provideHttpClient(withInterceptors([jwtInterceptorFn]), withFetch()),
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
    }),
    documentFilePath: indexHtml,
    url: `${protocol}://${headers.host}${originalUrl}`,
    publicPath: distFolder,
    providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
  }).then(html => res.status(200).send(html)).catch((err) => {  console.log(err); next(err); });

  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4222;

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
