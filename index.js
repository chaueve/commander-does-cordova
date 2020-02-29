const { Command } = require('commander');

const program = new Command();

program
  .storeOptionsAsProperties(false) // new style
  .passCommandToAction(false) // new style 
  .name('cordova');

function showCommand(name, parameters, options) {
  console.log(name);
  process.stdout.write('parameters: ');
  console.log (parameters)
  process.stdout.write('command options: ');
  console.log(options);
  process.stdout.write('common options: ');
  console.log(program.opts());
}

// common options
program
  .option('-d,--verbose', 'Pipe out more verbose output to your shell.')
  .option('-v,--version', 'Print out the version of your cordova-cli install.')
  .option('--no-update-notifier', 'Will disable updates check.')
  .option('--nohooks', 'Suppress executing hooks (taking RegExp hook patterns as parameters).')
  .option('--no-telemetry', 'Disable telemetry collection for the current command.')
  .on('option:version', () => {
    // Using custpm processing to do lazy calculation of version string, instead of using built-in .version
    console.log('version');
    process.exit();
  });

program
  .command('create <path> [id] [name] [config]')
  .description('Create the directory structure for the Cordova project in the specified path.')
  .option('--template <template>')
  .option('--copy-from <src>')
  .option('--link-to <link>')
  .action((path, id, name, config, options) => {
    showCommand('create', { path, id, name, config }, options);
  });

program
  .command('telemetry [state]')
  .description('Turns telemetry collection on or off.')
  .action((state) => {
    showCommand('telemetry', { state });
  });

const configCommand = program
  .command('config')
  .description('Set, get, delete, edit, and list global cordova options.');
configCommand
  .command('ls')
  .action(() => {
    showCommand('config ls');
  });
configCommand
  .command('edit')
  .action(() => {
    showCommand('config edit');
  });
configCommand
  .command('set <key> <value>')
  .action((key, value) => {
    showCommand('config set', { key, value });
  });
configCommand
  .command('get <key>')
  .action((key) => {
    showCommand('config get', { key });
  });
configCommand
  .command('delete <key>')
  .action((key) => {
    showCommand('config delete:', { key });
  });

const platformCommand = program
  .command('platform')
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

function addBuildOptions(cmd) {
  cmd
    .option('--debug', 'Perform a debug build')
    .option('--release', 'Perform a release build')
    .option('--device', 'Build it for a device')
    .option('--emulator', 'Build it for an emulator')
    .option('--buildConfig <configfile>', 'Use the specified build configuration file')
}

function separatePlatformsFromPlatformOpts(args) {
  // assume platforms never start with a dash, and first platform options does
  let firstOption = args.length + 1;
  args.forEach((arg, index) => {
    if (index < firstOption && arg[0] === '-')
      firstOption = index;
  });
  return { platforms: args.slice(0, firstOption), platformOpts: args.slice(firstOption) };
}

const compileCommand = program
  .command('compile [platform...]')
  .usage('[options] [platform...] [-- <platformOpts>]')
  .description("Subset of the cordova build command. It only performs the compilation step without doing prepare.")
  .action((platformsAndOpts, options) => {
    const { platforms, platformOpts } = separatePlatformsFromPlatformOpts(platformsAndOpts);
    showCommand('compile', { platforms, platformOpts }, options);
  });
addBuildOptions(compileCommand);

const buildCommand = program
  .command('build [platform...]')
  .usage('[options] [platform...] [-- <platformOpts>]')
  .description("Shortcut for cordova prepare + cordova compile for all/the specified platforms.")
  .action((platformsAndOpts, options) => {
    const { platforms, platformOpts } = separatePlatformsFromPlatformOpts(platformsAndOpts);
    showCommand('build', { platforms, platformOpts }, options);
  });
addBuildOptions(buildCommand);

const runCommand = program
  .command('run [platform...]')
  .usage('[options] [platform...] [-- <platformOpts>]')
  .description("Prepares, builds, and deploys app on specified platform devices/emulators. If a device is connected it will be used, unless an eligible emulator is already running.")
  .action((platformsAndOpts, options) => {
    const { platforms, platformOpts } = separatePlatformsFromPlatformOpts(platformsAndOpts);
    showCommand('run', { platforms, platformOpts }, options);
  });
addBuildOptions(runCommand);
runCommand
  .option('--list', 'Lists available targets. Displays both device and emulator deployment targets unless specified.')
  .option('--noprepare', 'Skip preparing')
  .option('--nobuild', 'Skip building')
  .option('--target <targetName>', 'Deploy to a specific target emulator/device.');

program.parse();
