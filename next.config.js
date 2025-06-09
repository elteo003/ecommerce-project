const path = require('path')

module.exports = {
    webpack(config) {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src') // o '.' se i tuoi hooks stanno in root/hooks
        return config
    }
}