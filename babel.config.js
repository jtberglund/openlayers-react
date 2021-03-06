module.exports = {
    presets: [
        ['@babel/preset-env', { modules: 'commonjs' }],
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        '@babel/preset-react'
    ],
    plugins: ['@babel/proposal-object-rest-spread']
};
