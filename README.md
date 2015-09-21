# angular-sir-trevor

AngularJS block-based editor inspired by Sir Trevor JS

## Installation

Ensure you have Node and NPM installed using the instructions at:

https://nodejs.org/download/

Then run the following command to install the dependancies:

    npm install
    
The following packages will be installed:

* babel - for running ES6 modules in the browser
* gulp - task runner
* gulp-babel - version for build tasks
* gulp-concat - combine static files together
* gulp-connect - live reload server
* gulp-html-replace - create asset bundles for production
* gulp-minify-css - minify css code
* gulp-uglify - minify js code

When using with the Ionic framework, add overflow-scroll ion-content to support html editing:

    <ion-content overflow-scroll="true">

## Usage

To run the server type the command below and then point your browser to http://localhost:8080/src/

    gulp
    
To build the production version run the command below and navigate to http://localhost:8080/dist/

    gulp dist