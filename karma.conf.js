module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: [
      'jasmine'
    ],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],

    client: {
      jasmine: {},
      clearContext: false
    },

    reporters: [
      'progress',
      'kjhtml'
    ],

    browsers: [
      'Chrome'
    ],

    restartOnFileChange: true,

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    }
  });
};