module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        globals: {
          'jQuery': false,
          '$': false,
          'ga': false,
          'document': false,
          'window': false
        },
        curly: true,
        eqeqeq: true,
        nonbsp: true,
        undef: true,
      },
      files: [ 'dist/js/concatted.js' ]
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        },
        drop_console: true,
        banner: '/*! Custom JS for WSU LibGuides - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      target: {
        files: {
          'dist/js/libguidesCustom.min.js': ['dist/js/concatted.js']
        }
      }
    },
    concat: {
      options: {
        banner: '$(document).ready(function(){',
        footer: '});'
      },
      target: {
        src: ['src/js/*.js'],
        dest: 'dist/js/concatted.js'
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/main.min.css': 'src/sass/main.scss'
        },
        options: {
          style: 'compressed',
        }
      },
      dev: {
        files: {
          'dist/css/main.css': 'src/sass/main.scss'
        },
        options: {
          trace: true,
          style: 'expanded',
          lineNumbers: true,
        }
      }
    },
    copy: {
      main: {
        expand: true,
        src: ['dist/**'],
        dest: 'backup/'
      }
    },
    watch: {
      files: ['src/sass/**/*.scss', 'src/js/**/*.js'],
      tasks: ['jshint', 'sass']
    },
    clean: {
      js: ['dist/js/**/*.js'],
      css: ['dist/css/**/*.js']
    },
    qunit: {
      all: ['src/js/test/*.html']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['copy', 'sass', 'concat', 'jshint','uglify']);
  grunt.registerTask('run-tests', ['qunit'])

};
