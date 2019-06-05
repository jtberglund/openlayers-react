const gulp = require('gulp');
const liveServer = require('live-server');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const inputOptions = {
    input: 'src/index.tsx',

    // Tell Rollup NOT to bundle React/ReactDOM with our app
    // We'll grab these libraries from a CDN
    external: ['react', 'react-dom'],

    plugins: [
        nodeResolve({
            extensions
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        postcss({
            extract: `lib/bundle.css`,
            extensions: ['.css'],
            plugins: []
        }),
        babel({
            exclude: 'node_modules/**',
            extensions
        })
    ]
};

const outputOptions = {
    file: 'lib/bundle.js',
    format: 'iife',
    sourcemap: true,

    // Names of the global objects for external libraries
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    }
};

async function build() {
    const bundle = await rollup.rollup(inputOptions);

    // write the bundle to disk
    await bundle.write(outputOptions);
}

async function watch() {
    await rollup.watch({
        ...inputOptions,
        output: [outputOptions],
        watch: {
            include: 'src/**',
            exclude: 'src/**/*.test.*'
        }
    });
}

function serve() {
    liveServer.start({
        file: 'public/index.html',
        // Reload the browser when the bundle changes
        watch: ['lib']
    });
}

gulp.task(serve);
gulp.task(build);
gulp.task(watch);

exports.default = gulp.parallel(watch, serve);
