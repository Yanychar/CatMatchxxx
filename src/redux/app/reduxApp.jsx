
if (process.env.NODE_ENV !== 'development') {
    module.exports = require('./reduxApp.prod.jsx');
} else {
    module.exports = require('./reduxApp.dev.jsx');
}
