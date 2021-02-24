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
  }]
};
