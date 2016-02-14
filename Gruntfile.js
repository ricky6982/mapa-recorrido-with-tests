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

        html2js: {
            options: {
                module: 'mapaRecorrido.templates'
            },
            main: {
                src: ['src/template/**/*.tpl.html'],
                dest: 'src/template.js'
            }
        },

        jshint: {
            beforeconcat: ["src/js/*.js", "test/*.js"],
            options: {
              eqnull: true
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
            html: {
                files: ['src/template/*.tpl.html'],
                tasks: ['html2js', 'concat', 'jshint']
            },
            js: {
                files: ['src/js/*.js', 'src/localizacion-servicio/*.js'],
                tasks: ['concat', 'jshint'],
            },
            karma: {
                files: ['src/js/*.js', 'src/localizacion-servicio/*.js', './test/*.js'],
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

    grunt.registerTask('default', 'Perform a normal build', ['jshint', 'concat', 'karma:unit:run']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-karma');
};