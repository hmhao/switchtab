module.exports = {
    basedir: __dirname + '/src', // 设置browserify配置中指向的默认目录为项目根目录
    entries: ['./html5polyfill.js', './switchtab.js'],
    output: {
        path: __dirname + '/dist', // 设置输出目录
        filename: 'switchtab.js' // 输出文件名
    },
    extensions: ['', '.js', '.jsx', '.coffee'], // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
    standalone: 'SwitchTab',
    debug: false //是否生成内联sourcemap用于调试
};
