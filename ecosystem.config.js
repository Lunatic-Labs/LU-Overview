module.exports = {
  apps : [{
    name: 'Angular Client',
    script: 'node_modules/@angular/cli/bin/ng',
    args: 'serve',
    cwd: 'client'
  }, {
    name: 'Nest Server',
    script: 'node',
    args: './node_modules/@nestjs/cli/bin/nest.js start --watch',
    cwd: 'server'
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'pre-setup': 'sudo apt-get install git; wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash; nvm install',
      'post-deploy' : 'npm install --prefix ./server ./; npm install --prefix ./client ./; pm2 reload ecosystem.config.js --env production',
    }
  }
};
