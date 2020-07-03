var devMod = process.env.NODE_ENV == 'development';//开发环境


var gulp = require('gulp');
// $ npm install gulp --save-dev

var sass = require('gulp-sass');
sass.compiler = require('node-sass');
// $ npm install node-sass gulp-sass --save-dev

var sassGlob = require('gulp-sass-glob');
// $ npm install gulp-sass-glob --save-dev

var imgMin = require('gulp-imagemin');
// $ npm install gulp-imagemin --save-dev

var uglify = require('gulp-uglify');
// $ npm install --save-dev gulp-uglify

var debug = require('gulp-strip-debug');
// $ npm install --save-dev gulp-strip-debug

var cleanCss = require('gulp-clean-css');
// $ npm install gulp-clean-css --save-dev

var htmlClean = require('gulp-htmlclean');
// $ npm install gulp-htmlclean --save-dev

var connect = require('gulp-connect');
// $ npm install gulp-connect --save-dev

var postCss = require('gulp-postcss');
// $ npm install gulp-postcss --save-dev
var autoPrefixer = require('autoprefixer');
// $ npm install autoprefixer --save-dev

var fileInclude = require('gulp-file-include');
// $ npm install gulp-file-include --save-dev

var browserify = require('gulp-browserify');
// $ npm install --save-dev gulp-browserify
var folder = {
    src: 'src/',
    dist: 'dist/'
}

function html() {
    var page = gulp.src(folder.src + 'html/*.html')
        .pipe(connect.reload())
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
    if (!devMod) {
        page.pipe(htmlClean())
    }
    page.pipe(gulp.dest(folder.dist + 'html/'))
    return page
}
function css() {
    var page = gulp
        .src(folder.src + 'css/*.scss')
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(connect.reload())
        .pipe(postCss([autoPrefixer()]))
    if (!devMod) {
        page.pipe(cleanCss())
    }
    page.pipe(gulp.dest(folder.dist + 'css/'))
    return page
}
function js() {
    var page = gulp.src(folder.src + 'js/*.js')
        .pipe(connect.reload())
        .pipe(browserify(
            { read: false }
        ));
    if (!devMod) {
        page.pipe(uglify())
            .pipe(debug())
    }
    page.pipe(gulp.dest(folder.dist + 'js/'))
    return page
}
function img() {
    var page = gulp
        .src(folder.src + 'images/*')
        .pipe(connect.reload())
        .pipe(imgMin())
        .pipe(gulp.dest(folder.dist + 'images/'))
    return page
}

function server() {
    connect.server({
        port: 9999,
        livereload: true
    })
}
function watch() {
    gulp.watch(folder.src + 'html/*', gulp.series(html))
    gulp.watch(folder.src + 'css/*', gulp.series(css))
    gulp.watch(folder.src + 'js/*', gulp.series(js))
    gulp.watch(folder.src + 'images/*', gulp.series(img))
}


gulp.task('default', gulp.series(gulp.parallel(html, css, js, server, watch)))