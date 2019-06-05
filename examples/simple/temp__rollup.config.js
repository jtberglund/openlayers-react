import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';

export default {
    input: 'src/index.tsx',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    }
    // plugins: [
    //     babel({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
