import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

fetch('/assets/config/config.json')
  .then(response => response.json())
  .then(config => {
    (window as any).runtimeConfig = config;
    bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
  });
