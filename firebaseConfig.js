// Firebase config
var config = {
    apiKey: MY_API_KEY,
    authDomain: "kevin-xword.firebaseapp.com",
    databaseURL: "https://kevin-xword.firebaseio.com",
    projectId: "kevin-xword",
    storageBucket: "kevin-xword.appspot.com",
    messagingSenderId: "693272376803"
};
firebase.initializeApp(config);

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            var user = authResult.user;
            var credential = authResult.credential;
            var isNewUser = authResult.additionalUserInfo.isNewUser;
            var providerId = authResult.additionalUserInfo.providerId;
            var operationType = authResult.operationType;

            return true;
        },
        signInFailure: function (error) {

            return handleUIError(error);
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
        }
    },
    credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
    // Query parameter name for mode.
    queryParameterForWidgetMode: 'mode',
    // Query parameter name for sign in success url.
    queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('<your-privacy-policy-url>');
    }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

function initApp() {
    console.log('app init');

    database = firebase.database();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('user', user);
            current_user = user;
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;

            document.getElementById("auth-status").innerText = displayName;
            document.getElementById("login-button").classList.add("hidden");
            document.getElementById("logout-button").classList.remove("hidden");

            // load list of puzzles
            fetch();

            // ...
        } else {
            // User is signed out.
            // ...
            current_user = null;
            document.getElementById("logout-button").classList.add("hidden");
            document.getElementById("login-button").classList.remove("hidden");
            document.getElementById("auth-status").innerText = "not signed in";
        }
    });
}

// Triggers init on load
window.addEventListener('load', function () {
    initApp()
});