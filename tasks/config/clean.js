module.exports = function(grunt) {
  grunt.config.set('clean', {
    // Delete the `assets` folder
    build: ['source/assets'],
    cleanRedundant: [
      'source/assets/css/style.css',
      'source/assets/css/tranquilpeak.css',
      'source/assets/js/script.js',
      'source/assets/js/tranquilpeak.js'
    ]
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
