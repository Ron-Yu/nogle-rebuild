var gulpConfig = function() {
  var src = './src/';
  var build = './build/';
  var assets = src + 'assets/';

  var config = {
    /**
    *   native files
    */
    src: {
        dir: src,

        // customed files
        js: src + 'js/**/*.js',
        template: src + '**/*.jade',
        sass: src + 'sass/application.sass',
        mainjs: src + 'js/main.js',

        // bundle js file
        collectionJs: src + 'js/collection.react.js',

        //third party library or framework for sass
        vendor: src + 'sass/vendor',

        assets : {
          font: assets + 'font/**/*.*',
          img: assets + 'img/**/*.*'
        }
    },
    /**
    *   build folders
    */
    build: {
      dir: build,
      // customed files
      js: build + 'js/',
      css:  build + 'css/',
      html: build
    }// end build
  };// end config

  return config;
};

module.exports = gulpConfig();
