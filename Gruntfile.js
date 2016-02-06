module.exports = function (grunt){
    
    var files = require('./files').files;

    // Configuración del Proyecto
    grunt.initConfig({
        builddir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/**\n'+
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */'
        },

        clean: [ '<%= builddir %>' ],

        concat: {
            options: {
                banner: '(function(window, angular){\n\n',
                footer: '\n})(window, angular);'
            },
            build: {
                src: files.src,
                dest: '<%= builddir %>/<%= pkg.name %>.js'
            }
        },

        watch: {
            startup: {
                files: [],
                tasks: ['karma:continuous:start'],
                options: {
                    atBegin: true,
                    spawn: false
                }
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['concat'],
            },
            karma: {
                files: ['src/js/*.js', 'test/*.js'],
                tasks: ['karma:continuous:run'],
            }

        },

        karma: {
            options: {
                configFile: 'karma.conf.js',
            },
            unit: {
                singleRun: true
            },
            continuous: {
                background: true
            }
        }

    });

    grunt.registerTask('default', 'Perform a normal build', ['concat', 'karma:unit:run']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
};