const gulp = require('gulp');
const liveServer = require('live-server');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');

function serve() {
    liveServer.start({
        file: 'public/index.html'
    });
}

async function build() {
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    const bundle = await rollup.rollup({
        input: 'src/index.tsx',
        plugins: [
            resolve({ extensions }),
            commonjs({
                include: 'node_modules/**',
                exclude: '**/*.css',
                // left-hand side can be an absolute path, a path
                // relative to the current directory, or the name
                // of a module in node_modules
                namedExports: {
                    'node_modules/react/index.js': ['cloneElement', 'createContext', 'Component', 'createElement'],
                    'node_modules/react-dom/index.js': ['render', 'hydrate']
                }
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
    });
    // console.log(bundle.watchFiles); // an array of file names this bundle depends on

    // write the bundle to disk
    await bundle.write({
        file: 'lib/bundle.js',
        format: 'cjs'
    });
}

gulp.task(serve);
gulp.task(build);

exports.default = gulp.parallel(build, serve);
