'use strict';
module.exports = {
    spec: './test/**/*.spec.ts',
    recursive: true,
    colors: true,
    diff: true,
    timeout: 30000,
    require: [
        'ts-node/register'
    ]
};