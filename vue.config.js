const fs = require('fs')

module.exports = {
    devServer: {
        https: {
          key: fs.readFileSync('./certs/private.key'),
          cert: fs.readFileSync('./certs/certificate.crt'),
        },
        public: 'https://localhost:8080/'
    }
}