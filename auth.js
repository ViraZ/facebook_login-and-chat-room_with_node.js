// expose our config directly to our application using module.exports
module.exports = {
    'facebookAuth' : {
        'clientID'      : '', // your App ID
        'clientSecret'  : '', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileFields' : ["id", "birthday", "email", "first_name", "gender", "last_name"]
    }
};
