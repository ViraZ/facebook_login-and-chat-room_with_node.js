// app/routes.js
var User        = require('../app/models/user');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var url = require('url');

module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.post('/profile', function(req, res) {
        User.findById(req.session.passport.user, function( err, user ) {
            if( !err ) {
                if (user == null){
                    res.end();
                    return false;
                }

                if (!req.body.minus) {
                    user.money = user.money + +req.body.sum
                } else {
                    user.money = user.money - req.body.sum
                }

                user.save();

                res.redirect('/profile')
                res.end()
            } else {
                return console.log( err );
            }
        });
    });

    app.post('/profile/save', function(req, res) {
        User.findById(req.session.passport.user, function( err, user ) {
            if( !err ) {
                user.conversation = req.body.conversation;

                user.save();

                res.redirect('/profile')
                res.end()
            } else {
                return console.log( err );
            }
        });
    });

    app.post('/profile/print', function(req, res) {
        console.log(req.body.conversation);

        var doc = new PDFDocument;

        doc.pipe(fs.createWriteStream('output.pdf'));

        doc.fontSize(14).text(req.body.conversation, 100, 100);

        doc.end();

        res.end();
    });

// Download file
res.sendFile('index1.html', { root: path.join(__dirname, '../public') });
/*    app.get('/profile/print', function(req, res, next){
      var file = req.params.file
        , path = __dirname + '/profile/print' + file;

      res.download(path);
    });
*/    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

