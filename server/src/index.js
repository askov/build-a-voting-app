'use strict';

const DEBUG_MODE = true;

const Koa = require('koa');
const koaBody = require('koa-body');
/* eslint-disable no-unused-vars */
const mongoose = require('./models/db');
/* eslint-enable */

const api = require('./api/api');

const app = new Koa();
app.use(koaBody());
app.use(api.routes());

const port = 3000;

app.listen(port, () => {
  if (DEBUG_MODE) {
    /* eslint-disable no-console */
    const colors = require('colors');
    console.log(`\n${colors.cyan.bold('Server started')}:\
      http://localhost:${port}`);
    /* eslint-enable */
  }
});
