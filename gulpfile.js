//任务1:sass->css:
//1.引入包
//（1）引入gulp包,返回值为对象
// (2) 引入gulp-sass包，返回值为函数
var gulp = require("gulp");
var sass = require("gulp-sass");
// const htmlmin = require('gulp-htmlmin');

//2.开启gulp任务 gulp.task(任务名,函数)
gulp.task("compileSass",function(){
    //2.1 拿到文件流gulp.src()
    return gulp.src(["./src/sass/*.scss","!./src/sass/var.scss"])
    //2.2通过管道运输gulp.pipe()，运输过程中，进行sass编译 sass()
    //*忽略错误，继续编译
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError)) 
   
    //2.3通过管道gulp.pipe()运输到指定目录下gulp.dest()
    .pipe(gulp.dest("./src/css/"))
})
// 任务2：监听a.scss

gulp.task("jt",function(){
    gulp.watch("./src/sass/*.scss",gulp.series("compileSass"))
})
