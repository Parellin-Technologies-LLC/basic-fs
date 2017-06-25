module.exports = {
    apps: [
        {
            name: 'BasicFS',
            script: './index.js',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
				NODE_ENV: 'production'
			},
            "restart_delay": 5000,
            "instances": 0,
            "exec_mode": "cluster"
        }
    ]
};
