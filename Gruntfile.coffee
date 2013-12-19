module.exports = (grunt) ->
	grunt.initConfig
		concat:
			bulk:
				src: ['src/*.jsx']
				dest: 'bulk.jsx'
			bulk_:
				src: ['node_modules/underscore/underscore.js', 'src/*.jsx']
				dest: 'bulk_.jsx'
		watch:
			files: ['src/*.jsx']
			tasks: 'default'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.registerTask 'default', [
		'concat:bulk',
		'concat:bulk_',
	]
