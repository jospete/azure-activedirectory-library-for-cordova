const del = require("del");
const gulp = require("gulp");
const shell = require("gulp-shell");
const git = require("gulp-git");
const runSequence = require("gulp-run-sequence");

/**
 * ADALiOS update flow:
 *
 * 1) npm install (only if not already installed)
 * 2) gulp ios-update-adal
 */

const adios = {
    dir: "azure-activedirectory-library-for-objc",
    tag: "3.0.0-pre6",
    script: "build_sdk.sh",
    framework: "ADALiOS.framework"
};

gulp.task("ios-clean-adal", function () {
    return del(adios.dir);
});

gulp.task("ios-pull-adal", function (done) {
    git.clone("https://github.com/AzureAD/" + adios.dir + ".git", null, done);
});

gulp.task("ios-checkout-adal", function (done) {
    if (adios.tag) {
        git.checkout("tags/" + adios.tag, {cwd: adios.dir}, done);
    } else {
        console.log("no tag found, skipping checkout");
        done();
    }
});

gulp.task("ios-get-adal", function (done) {
    runSequence(
        "ios-clean-adal",
        "ios-pull-adal",
        "ios-checkout-adal",
        done
    );
});

gulp.task("ios-move-script", function () {
    return gulp.src("./src/ios/tools/" + adios.script)
        .pipe(gulp.dest("./" + adios.dir));
});

gulp.task("ios-run-script", shell.task("./" + adios.script, {cwd: adios.dir}));

gulp.task("ios-script", function (done) {
    runSequence(
        "ios-move-script",
        "ios-run-script",
        done
    );
});

gulp.task("ios-transfer-adal", function () {
    return gulp.src(adios.dir + "/build/" + adios.framework + "/*")
        .pipe(gulp.dest("src/ios/test"));
});

gulp.task("ios-update-adal", function (done) {
    runSequence(
        "ios-get-adal",
        "ios-script",
        "ios-transfer-adal",
        done
    );
});
