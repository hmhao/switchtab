var webpack = require('webpack');
module.exports = {
    context: __dirname + '/src', // 设置webpack配置中指向的默认目录为项目根目录
    entry: {
        switchtab: ['./switchtab.js']
    },
    output: {
        path: __dirname + '/dist', // 设置输出目录
        filename: '[name].js' // 输出文件名
    },
    resolve: {
        root: __dirname + '/src', //绝对路径
        extensions: ['', '.js', '.jsx', '.coffee'], // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
        alias: {
            //例子
            /*AppStore: 'js/stores/AppStores.js',
            ActionType: 'js/actions/ActionType.js',
            AppAction: 'js/actions/AppAction.js'*/
        }
    },
    externals: {
        jquery: 'window.$'
    },
    devtool: '#source-map'
};
