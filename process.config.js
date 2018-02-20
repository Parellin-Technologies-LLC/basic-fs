module.exports = {
    apps: [
        {
            name: 'BasicFS',
            script: './index.js',
            env: {
                NODE_ENV: 'development',
                SILENT: false,
                DATA: 'data/',
                PORT: 3000
            },
            restart_delay: 5000,
            instances: 0,
            exec_mode: 'cluster'
        }
    ]
};
