const gulp = require('gulp');
const babel = require('gulp-babel');
const htmlreplace = require('gulp-html-replace');
const del = require('del');
const uglify = require('gulp-uglify');
const cssMin = require('gulp-clean-css');

gulp.task('clean', function () {
  return del(['./build/*.*']);
})

gulp.task('build', function () {
  const jsStream = gulp.src('./src/app.js')
    .pipe(babel())
    .pipe(uglify());
    
  const cssStream = gulp.src('./src/style.css')
    .pipe(cssMin());

  return gulp.src('./src/list.html')
      .pipe(htmlreplace({
        js: {
          src: jsStream,
          tpl: '<script>%s</script>'
        },
        css: {
          src: cssStream,
          tpl: '<style type="text/css">%s</style>'
        }
      }))
      .pipe(gulp.dest('build'));
})

gulp.task('watch', ['build'], function () {
  gulp.watch(['./src/**/*'], ['build']);
});

gulp.task('default', ['build']);
