/**
 * gulp demo
 *
 * by kele527
 */
//导入工具包 require('node_modules里对应模块')
var del=require('del');
var gulp=require('gulp');
var uglify=require('gulp-uglify');//压缩javascript文件，减小文件大小
var mincss=require('gulp-clean-css');//压缩css
var inline=require('gulp-inline-source'); //资源内联 （主要是js，css，图片）
var include=require('gulp-include'); //资源内联（主要是html片段）
var sequence=require('gulp-sequence');
var useref=require('gulp-useref'); //合并文件
var gulpif=require('gulp-if');
var print=require('gulp-print'); //打印命中的文件
var connect=require('gulp-connect'); //本地服务器
var  imagemin = require('gulp-imagemin');//压缩图片
var jshint = require('gulp-jshint');
var spritesmith = require('gulp.spritesmith');
var htmlmin = require('gulp-htmlmin');//压缩html，可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作
var spriter = require('gulp-css-spriter');
//清理构建目录
gulp.task('clean',function (cb) {
    del(['dist']).then(function () {
        cb()
    })
});

gulp.task('mincss',function () {
    return gulp.src('css/base.css')
        .pipe(mincss())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('minjs',function () {
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(inline())//把js内联到html中
        .pipe(include())//把html片段内联到html主文件中
        .pipe(useref())//根据标记的块  合并js或者css
        .pipe(gulpif('js/*.js',uglify()))
        .pipe(gulpif('css/*.css',mincss()))
        .pipe(connect.reload()) //重新构建后自动刷新页面
        .pipe(gulp.dest('dist'));
});


//本地服务器  支持自动刷新页面
gulp.task('connect', function() {
    connect.server({
        root: './dist', //本地服务器的根目录路径
        port:8080,
        livereload: true
    });
});

//sequence的返回函数只能运行一次 所以这里用function cb方式使用
gulp.task('watchlist',function (cb) {
    sequence('clean',['sprite','mincss','Imagemin','minjs','testHtmlmin','html'])(cb)
});

gulp.task('watch',function () {
    gulp.watch(['./src/**'],['watchlist']);
});


//中括号外面的是串行执行， 中括号里面的任务是并行执行。
gulp.task('default',function (cb) {
    sequence('clean',['sprite','mincss','Imagemin','minjs','testHtmlmin','html','connect'],'watch')(cb)
});
//压缩图片
gulp.task('Imagemin', function () {
    gulp.src('images/*.jpg')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'));
});
// jshhint
gulp.task('jshint', function(){
    gulp.src('./js/*.js')
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter('default'));
})
//sprite
gulp.task('sprite', function(){
    return gulp.src('css/index.css')
        .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': 'dist/images/sprite.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../images/sprite.png'
        }))
        .pipe(gulp.dest('dist/css'));//保存压缩文件到指定的目录下面
});
//htmlmin
gulp.task('testHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});

