const gulp = require('gulp');
const liveServer = require('live-server');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

function serve() {
    liveServer.start({
        file: 'public/index.html'
    });
}

function build() {
    return gulp
        .src('./src/**/*.ts*')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(gulp.dest('lib'));
}

gulp.task(serve);
gulp.task(build);

exports.default = gulp.parallel(build, serve);
