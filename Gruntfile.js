module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      scripts: {
        files: ['src/*.js', 'src/*.css', 'src/*.html'],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/lib/jquery-3.1.1.min.js'],
        dest: 'build/lib/build.js'
      },
      extras: {
        src: ['src/data/testJSON.js'],
        dest: 'build/data/testJSON.js'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/index.html': 'src/index.html'
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')()
        ]
      },
      dist: {
        src: 'src/quiz.css',
        dest: 'build/quiz.css'
      }

    },
    uglify: {
      build: {
        files: {
          'build/quiz.js': 'src/quiz.js'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.registerTask('default', ['uglify', 'postcss', 'htmlmin', 'concat']);
}
