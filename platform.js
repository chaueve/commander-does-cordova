const { Command } = require('commander');

const platformCommand = new Command('platform')
  .storeOptionsAsProperties(false) // new style
  .passCommandToAction(false) // new style 
  .alias('platforms')
  .description("Manage cordova platforms - allowing you to add, remove, update, list and check for updates. Running commands to add or remove platforms affects the contents of the project's platforms directory.");
  
platformCommand
  .command('add <platform-spec...>')
  .description('Add specified platforms')
  .option('--nosave', 'Do not save <platform-spec> into config.xml & package.json after installing them using <engine> tag')
  .option('--link <path>', 'When <platform-spec> is a local path, links the platform library directly instead of making a copy of it')
  .action((platforms, options) => {
    showCommand('platform add', { platforms }, options);
  });
platformCommand
  .command('remove <platform...>')
  .alias('rm')
  .description('Remove specified platforms')
  .option('--nosave', 'Do not delete specified platforms from config.xml & package.json after removing them')
  .action((platforms, options) => {
    showCommand('platform remove', { platforms }, options);
  });
platformCommand
  .command('update <platform...>')
  .description('Update specified platforms')
  .action((platforms) => {
    showCommand('platform remove', { platforms });
  });
platformCommand
  .command('list')
  .alias('ls')
  .description('List all installed and available platforms')
  .action(() => {
    showCommand('platform list');
  });
platformCommand
  .command('check')
  .description('List platforms which can be updated via cordova-cli with the command platform update')
  .action(() => {
    showCommand('platform check');
  });
platformCommand
  .command('save')
  .description('Save <platform-spec> of all platforms added to config.xml')
  .action(() => {
    showCommand('platform save');
  });

function showCommand(name, parameters, options) {
  console.log(name);
  process.stdout.write('parameters: ');
  console.log (parameters)
  process.stdout.write('command options: ');
  console.log(options);
  // Cheat: use knowledge of final hierarchy to get to common options.
  process.stdout.write('common options: ');
  console.log(platformCommand.parent.opts());
}
  
module.exports.platformCommand = platformCommand;
