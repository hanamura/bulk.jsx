module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      normal:
        src: [
          'src/bulk.coffee'
          'src/tasks/*.coffee'
        ]
        dest: 'bulk.jsx'

    concat:
      full:
        src: [
          'node_modules/underscore/underscore.js'
          'node_modules/rebounds/rebounds.js'
          'bulk.jsx'
        ]
        dest: 'bulk.full.jsx'

    watch:
      files: 'src/**/*.coffee'
      tasks: 'default'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', [
    'coffee:normal'
    'concat:full'
  ]
