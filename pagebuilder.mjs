#!/usr/bin/env node
import { globby } from 'globby';
import { promises as fs } from 'fs';
import * as path from 'path';
import pkg from 'jsonfile';
const { readFile } = pkg;
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import inquirer from 'inquirer';

// Check for arguments
var args = process.argv.slice(2);
if (args.length > 1) {
  console.log(chalk.red('ERROR : ', 'PageBuilder accepts only 1 argument'));
  process.exit(1);
}

const APPLICATION_ROUTES_TEMPLATE_PATH = 'src/app/routes.template.tsx';
const PROVIDER_TEMPLATE_REPLACEMENT_STRING = '__CASE__STATEMENTS__';
const ROUTES_TEMPLATE_REPLACEMENT_STRING = '__ROUTES__CONFIG__REPLACEMENT';
const PROVIDER_TEMPLATE_PATH = 'src/provider.template.tsx';
const CLIENT_PROVIDER_NAME = 'clientProvider.ts';
let IMPORT_STRING = '';
let ROUTE_STRING = '';
const LAYOUT_CONF_OBJ = {};
const APP_CONF_OBJ = {};
const warningArray = [];
const ignoreLayouts = [];
let buildableApp;

const templateSpinner = createSpinner(
  'Scanning for pagebuilder template files'
).start();

/*
 ************************* UTILS - Start **********************
 */

// Function to add empty console logs for better readability
const logMessageToConsole = (message) => {
  console.log('');
  console.log('');
  console.log(message);
  console.log('');
  console.log('');
};

// function to read file and handle errors
const readFileByPath = async (path) => {
  let fileContent;
  try {
    fileContent = await fs.readFile(path, 'utf-8');
  } catch (err) {
    logMessageToConsole(chalk.red(`ERROR while reading ${path}: `, err));
    process.exit(1);
  }
  return fileContent;
};

// Function to get json data, if unable to parse json - it will exit the script.
const getJSONData = async (file) => {
  let res;
  try {
    res = await readFile(file);
  } catch (err) {
    logMessageToConsole(chalk.red('ERROR : ', err));
    process.exit(1);
  }
  return res;
};

// Function to find out all the applications available in workspace
const findAllApps = async () => {
  const applications = [];
  try {
    const appsPath = await globby('**/app.config.json');
    for (const appPath of appsPath) {
      const appConfigData = await getJSONData(appPath);
      APP_CONF_OBJ[appConfigData.applicationName] = {
        asyncConfigPath: appConfigData.asyncConfigPath,
        applicationPath: path.join(appPath, '../'),
        clientManagerPath: appConfigData.clientManagerPath,
        createClientPath: appConfigData.createClientPath,
      };
      applications.push(appConfigData.applicationName);
    }
  } catch (err) {
    logMessageToConsole(chalk.red('Error in findAllApps', err));
    process.exit(1);
  }
  return applications;
};

const getPagebuilderTemplatePath = async () => {
  let path;
  try {
    path = await globby('**/pagebuilder_provider.template');
  } catch (err) {
    logMessageToConsole(chalk.red('ERROR : ', err));
    process.exit(1);
  }
  if (path.length !== 1) {
    logMessageToConsole(
      chalk.red(
        'ERROR : pagebuilder_provider.template is not found in the workspace or conflicting paths found : ',
        path
      )
    );
    process.exit(1);
  }
  return path[0];
};

const getPagebuilderRouteTemplatePath = async () => {
  let path;
  try {
    path = await globby('**/pagebuilder_route.template');
  } catch (err) {
    logMessageToConsole(chalk.red('ERROR : ', err));
    process.exit(1);
  }
  if (path.length !== 1) {
    logMessageToConsole(
      chalk.red(
        'ERROR : pagebuilder_route.template is not found in the workspace or conflicting paths found : ',
        path
      )
    );
    process.exit(1);
  }
  return path[0];
};

const getPagebuilderCreateClientTemplatePath = async () => {
  let path;
  try {
    path = await globby('**/create_client.template');
  } catch (err) {
    logMessageToConsole(chalk.red('ERROR : ', err));
    process.exit(1);
  }
  if (path.length !== 1) {
    logMessageToConsole(
      chalk.red(
        'ERROR : pagebuilder_route.template is not found in the workspace or conflicting paths found : ',
        path
      )
    );
    process.exit(1);
  }
  return path[0];
};

const isSafeToBuild = (appName) => {
  if (buildableApp === 'all') {
    return true;
  }
  if (appName.toLowerCase().trim() === buildableApp.toLowerCase().trim()) {
    return true;
  }
  return false;
};

const createChildRoutes = (routeConfigArr) => {
  for (const routeConfig of routeConfigArr) {
    IMPORT_STRING +=
      `import { ${routeConfig.componentName} } from '${routeConfig.importPath}'; ` +
      '\n';
    ROUTE_STRING +=
      `\t\t\t\t\t<Route path="${routeConfig.path}" element={<${routeConfig.componentName} />} >` +
      '\n';
    if (
      routeConfig.child_routes !== undefined &&
      routeConfig.child_routes !== null
    ) {
      createChildRoutes(routeConfig.child_routes);
    }
    ROUTE_STRING += '</Route>';
  }
};

/*
 ************************* UTILS - End **********************
 */

/*
  ############## Verification Tasks - Start ##############  
  Run few tasks before starting actual work like
    - checking if all templates are in place.
    - if user wants to undo or build page.
    - ask for any user input if required.
*/

await getPagebuilderTemplatePath();
await getPagebuilderRouteTemplatePath();
await getPagebuilderCreateClientTemplatePath();

const undoTask = args.length === 1 && args[0].includes('undo');

templateSpinner.success();

const promptBeforeBuilding = async () => {
  const appsSpinner = createSpinner(
    'Scanning all the applications in the workspace'
  ).start();
  const applications = await findAllApps();
  appsSpinner.success();
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'appToBuild',
        message: 'Which application do you want to build?',
        choices: ['all', ...applications],
      },
    ])
    .then((answers) => {
      buildableApp = answers.appToBuild;
    });
};

// Ask user for prompt only if the task is not undo.
undoTask ? '' : await promptBeforeBuilding();
/*
  ############## Verification Tasks - End ##############  
*/

/*
  ############## Undo task - Start ##############  
*/

// Below code block is for reverting the script task [undo].
if (undoTask) {
  try {
    const undoStep1 = createSpinner(
      'Scanning all provider.template.tsx files'
    ).start();
    const files = await globby('**/provider.template.tsx');
    undoStep1.success();
    const undoStep2 = createSpinner(
      'Reading the pagebuilder template file'
    ).start();
    const pgbTemplatePath = await getPagebuilderTemplatePath();
    // empty all the routes.template.tsx
    const templateData = await readFileByPath(pgbTemplatePath);
    const writableTemplateData = templateData.replace(
      PROVIDER_TEMPLATE_REPLACEMENT_STRING,
      ''
    );
    undoStep2.success();
    for (const templateFile of files) {
      const undoStep3 = createSpinner(`Reverting ${templateFile}`).start();
      await fs.writeFile(templateFile, writableTemplateData);
      undoStep3.success();
    }
    logMessageToConsole(
      chalk.bgGreen(
        'The above provider templates have been reverted to their original state'
      )
    );

    const undoStep5 = createSpinner(
      `Scanning all routes.template.tsx files`
    ).start();
    const undoStep6 = createSpinner(
      `Scanning the pagebuilder route template file`
    ).start();

    // undo routes files
    const pgbRouteTemplatePath = await getPagebuilderRouteTemplatePath();
    undoStep6.success();
    const routeTemplateData = await readFileByPath(pgbRouteTemplatePath);
    const routeTemplateFiles = await globby('**/routes.template.tsx');
    undoStep5.success();

    for (const templateFile of routeTemplateFiles) {
      const undoStep6 = createSpinner(`Reverting ${templateFile}`).start();
      await fs.writeFile(templateFile, routeTemplateData);
      undoStep6.success();
    }
    logMessageToConsole(
      chalk.bgGreen(
        'The above route templates have been reverted to their original state'
      )
    );
  } catch (err) {
    logMessageToConsole(chalk.red('Error while running undo task', err));
    process.exit(1);
  }
  // exit gracefully
  process.exit(0);
}

/*
  ############## Undo task - End ##############  
*/

/*
  ############## Declaration of each task required to build all pages - Start ##############  
*/

// Scan all layout configs
const scanLayoutConfigTask = async () => {
  try {
    const files = await globby('**/layout.config.json');
    for (const file of files) {
      const res = await getJSONData(file);
      if (res.appName == undefined) {
        logMessageToConsole(
          chalk.red(
            `appName is not configured in one of the layout.config.json at ${file}`
          )
        );
        process.exit(1);
      }
      if (isSafeToBuild(res.appName)) {
        LAYOUT_CONF_OBJ[res.name.toLowerCase()] = {
          appName: res.appName,
          templatePath: path.join(file, '../') + PROVIDER_TEMPLATE_PATH,
          components: [],
          domainList: [],
        };
      } else {
        ignoreLayouts.push(res.name.toLowerCase());
      }
    }
  } catch (err) {
    logMessageToConsole(
      chalk.red('Error while scanning for layout config ', err)
    );
    process.exit(1);
  }
};

// scan all component config
const scanComponentConfigTask = async () => {
  try {
    const files = await globby('**/component.config.json');
    for (const file of files) {
      const res = await getJSONData(file);
      for (const placeholderObj of res.layoutIdentity) {
        if (LAYOUT_CONF_OBJ[placeholderObj.name.toLowerCase()] !== undefined) {
          LAYOUT_CONF_OBJ[placeholderObj.name.toLowerCase()]?.components.push({
            name: res.name,
            importPath: res.importPath,
            areaId: placeholderObj.areaId,
          });
          LAYOUT_CONF_OBJ[placeholderObj.name.toLowerCase()]?.domainList.push(
            res.domain
          );
        } else {
          if (!ignoreLayouts.includes(placeholderObj.name.toLowerCase())) {
            warningArray.push(placeholderObj.name);
          }
        }
      }
    }
  } catch (err) {
    logMessageToConsole(
      chalk.red('Error while scanning for component config ', err)
    );
    process.exit(1);
  }
};

// Since now the layout object is ready , we have to write it to the file.
const writeComponentsToLayoutTask = async () => {
  try {
    const pageBuilderProviderTemplatePath = await getPagebuilderTemplatePath();
    const pageBuilderProviderTemplateContent = await readFileByPath(
      pageBuilderProviderTemplatePath
    );
    for (const layoutConf of Object.keys(LAYOUT_CONF_OBJ)) {
      const pageBuilderProviderTemplateContent = await readFileByPath(
        pageBuilderProviderTemplatePath
      );
      const templateFilePath = LAYOUT_CONF_OBJ[layoutConf].templatePath;
      let switch_statement_string = '';
      let import_statement_string = '';

      for (const compObj of LAYOUT_CONF_OBJ[layoutConf]?.components) {
        // Add imports
        import_statement_string +=
          `import { ${compObj.name} } from "${compObj.importPath}";` + '\n';
        switch_statement_string += `case '${compObj.areaId}': \n\t return <${compObj.name} {...props.options} />;\n`;
      }

      // Write the layout file here
      const tempProviderData = pageBuilderProviderTemplateContent.replace(
        PROVIDER_TEMPLATE_REPLACEMENT_STRING,
        switch_statement_string
      );
      const writableProviderData = import_statement_string + tempProviderData;
      //Write to file
      await fs.writeFile(templateFilePath, writableProviderData);
    }
  } catch (err) {
    logMessageToConsole(
      chalk.red('Error while writing the components to layout ', err)
    );
    process.exit(1);
  }
};

// Add routes config to routes template in respective app
const writeRoutesToTemplateTask = async () => {
  try {
    const appConfigObject = {};
    const appFiles = await globby('**/app.config.json');
    for (const appConfig of appFiles) {
      const res = await getJSONData(appConfig);
      if (isSafeToBuild(res.applicationName)) {
        appConfigObject[res.applicationName] = {
          routesTemplatePath:
            path.join(appConfig, '../') + APPLICATION_ROUTES_TEMPLATE_PATH,
        };
      }
    }

    //read all routes - path.join(routeFile, '../')
    const routeFiles = await globby('**/route.config.json');

    for (const routeFile of routeFiles) {
      const res = await getJSONData(routeFile);
      if (isSafeToBuild(res.applicationName)) {
        if (appConfigObject[res.applicationName].routesConfig) {
          appConfigObject[res.applicationName].routesConfig.push(
            res.routeConfig.routes
          );
        } else {
          appConfigObject[res.applicationName].routesConfig = [
            res.routeConfig.routes,
          ];
        }
      }
    }
    const pgbRouteTemplatePath = await getPagebuilderRouteTemplatePath();

    // Now finally write the config
    for (const appObj of Object.keys(appConfigObject)) {
      const configFileArr = appConfigObject[appObj].routesConfig;
      const templateFilePath = appConfigObject[appObj].routesTemplatePath;
      let routeTemplateData = await readFileByPath(pgbRouteTemplatePath);
      // TODO: to support child routes , move below code to a new function and call recursively
      if (configFileArr) {
        let writableImportData = '';
        let writableRoutesData = '';
        for (const singleRouteConfig of configFileArr) {
          // Get only the route and imports from routeConfigData
          for (const routeConf of singleRouteConfig) {
            let importString =
              `import { ${routeConf.componentName} } from '${routeConf.importPath}'; ` +
              '\n';
            let routeString = '';
            if (
              routeConf.child_routes == null ||
              routeConf.child_routes == undefined ||
              !routeConf.child_routes
            ) {
              routeString =
                `\t\t\t<Route path="${routeConf.path}" element={<${routeConf.componentName} />} />` +
                '\n';
            } else {
              // Handle child routes
              routeString =
                `\t\t\t<Route path="${routeConf.path}" element={<${routeConf.componentName} />} >` +
                '\n';
              for (const childRouteConf of routeConf.child_routes) {
                importString +=
                  `import { ${childRouteConf.componentName} } from '${childRouteConf.importPath}'; ` +
                  '\n';
                routeString +=
                  `\t\t\t\t\t<Route path="${childRouteConf.path}" element={<${childRouteConf.componentName} />}>` +
                  '\n';
                if (
                  childRouteConf.child_routes !== undefined &&
                  childRouteConf.child_routes !== null
                ) {
                  createChildRoutes(childRouteConf.child_routes);
                  importString += IMPORT_STRING;
                  routeString += ROUTE_STRING;
                }
                routeString += '</Route>';
              }
              routeString += '\t\t\t</Route>';
            }
            writableImportData += importString;
            writableRoutesData += routeString + '\n';
          }
        }
        writableImportData += '\n' + routeTemplateData;
        const finalRoutesTemplateContent = writableImportData.replace(
          ROUTES_TEMPLATE_REPLACEMENT_STRING,
          writableRoutesData
        );
        await fs.writeFile(templateFilePath, finalRoutesTemplateContent);
      }
    }
  } catch (err) {
    logMessageToConsole(
      chalk.red('Error while writing the components to layout ', err)
    );
    process.exit(1);
  }
};

const createClientTask = async () => {
  const appConf = {};

  try {
    //get the domainList
    for (const layoutObj of Object.keys(LAYOUT_CONF_OBJ)) {
      if (appConf[LAYOUT_CONF_OBJ[layoutObj].appName]) {
        appConf[LAYOUT_CONF_OBJ[layoutObj].appName].domainList = [
          ...new Set(
            appConf[LAYOUT_CONF_OBJ[layoutObj].appName].domainList.concat(
              LAYOUT_CONF_OBJ[layoutObj].domainList
            )
          ),
        ];
      } else {
        appConf[LAYOUT_CONF_OBJ[layoutObj].appName] = {
          domainList: [...new Set(LAYOUT_CONF_OBJ[layoutObj].domainList)],
        };
      }
    }
    for (const app of Object.keys(APP_CONF_OBJ)) {
      if (appConf[app]) {
        appConf[app].asyncConfigPath = APP_CONF_OBJ[app].asyncConfigPath;
        appConf[app].clientManagerPath = APP_CONF_OBJ[app].clientManagerPath;
        appConf[app].createClientPath = APP_CONF_OBJ[app].createClientPath;
        appConf[app].applicationPath =
          APP_CONF_OBJ[app].applicationPath + 'src/';
      }
    }
    // Write createClient file
    const templatePath = await getPagebuilderCreateClientTemplatePath();
    const createClientTemplateData = await readFileByPath(templatePath);
    for (const appClient of Object.keys(appConf)) {
      const importString =
        `import { config } from '${appConf[appClient].asyncConfigPath}';` +
        '\n' +
        `import { ClientManager } from '${appConf[appClient].clientManagerPath}';` +
        '\n' +
        `import { create } from '${appConf[appClient].createClientPath}';` +
        '\n\n';
      const domainListTemp =
        `const domainList = ${JSON.stringify(appConf[appClient].domainList)}` +
        '\n\n\n';
      const writableClientData =
        importString + domainListTemp + createClientTemplateData;
      await fs.writeFile(
        appConf[appClient].applicationPath + '/' + CLIENT_PROVIDER_NAME,
        writableClientData
      );
    }
  } catch (err) {
    /* console.log('LAYOUT_CONF_OBJ : ', LAYOUT_CONF_OBJ);
    console.log('**************************************');
    console.log('APP_CONF_OBJ : ', APP_CONF_OBJ);
    console.log('**************************************');
    console.log('APP CONF OBJECT : ', appConf);
    console.log('**************************************'); */
    logMessageToConsole(chalk.red('Error while creating clients ', err));
    process.exit(1);
  }
};

/*
  ############## Declaration of each task required to build all pages - End ##############  
*/

/*
  ############## Executing each task in an orderly fashion - Start ##############  
*/

const spinner1 = createSpinner('Scanning layout config').start();
await scanLayoutConfigTask();
spinner1.success();

const spinner2 = createSpinner('Scanning component config').start();
await scanComponentConfigTask();
spinner2.success();

const spinner3 = createSpinner('Writing components to layout').start();
await writeComponentsToLayoutTask();
spinner3.success();

const spinner4 = createSpinner('Writing routes to route.template.tsx').start();
await writeRoutesToTemplateTask();
spinner4.success();

//console.log(LAYOUT_CONF_OBJ);
const spinner5 = createSpinner('Creating clients').start();
await createClientTask();
spinner5.success();

// domainlist -> mentor and strudent

/*
  ############## Executing each task in an orderly fashion - End ##############  
*/

// Remove any duplicate warnings.
const uniqWarningArray = [...new Set(warningArray)];

// Show warning if any, else just show success message
if (warningArray.length > 0) {
  console.log('');
  console.log(chalk.bgYellow('Pages have been built with warnings!'));
  console.log('');
  console.log(
    'There might be some issue with configs of following layout/component config : ',
    uniqWarningArray
  );
  console.log('');
} else {
  logMessageToConsole(chalk.bgGreen('Pages have been built successfully!'));
}
