import { App } from './app/app.js';
import './assets/main.less';

window.addEventListener('load', function () {
    const config = window.appConfig;
    const container = document.getElementById(config.appId);
    const url = config.debugUrl ? config.debugUrl : location.origin;
    (new App(container, url, config)).render();
});