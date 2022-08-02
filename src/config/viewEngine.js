import express from 'express';
import path from 'path';

const handlebars = require('express-handlebars');

const configViewEngine = (app) => {
    app.use(express.static(path.join('src', 'public')));

    app.engine('hbs', handlebars.engine({
        extname: '.hbs'
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join('src', 'resources', 'views'));

    // config to active navigation thanks to hbs's registerHelper
    // this function will be available to use in the view engine
    const hbs = handlebars.create({});
    // register new function
    hbs.handlebars.registerHelper('checkString', (value1, value2) => {
        return value1 === value2;
    })
}

export default configViewEngine;