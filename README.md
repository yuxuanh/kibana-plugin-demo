# demo

> demo user picture

---

## what I change

1.use kibana 'node script/generate_plugin demo' to create this, version is 6.3.2, when you create you need said the version, then you need change back kibana package.json's version to align the plugin version, otherwise it will not work.  
2.updated  
package.json - I updated eui version, after added, you need to add plugin-helper back, which use command 'yarn add link:../../kibana/packages/kbn-plugin-helpers' and build again 'yarn kbn bootstrap'  
server/routes/example.js - is the B/E service part  
public/components/main/main.js - is the F/E part  
public/less/main.less - is the css, I updated one to cover the exist component style  
3.example data  
POST /prd_mi_info_user_attri/doc/abc  
{"custSeg": "MAS","hasDebitCard": "Y"}  


## development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following yarn scripts.

  - `yarn kbn bootstrap`

    Install dependencies and crosslink Kibana and all projects/plugins.

    > ***IMPORTANT:*** Use this script instead of `yarn` to install dependencies when switching branches, and re-run it whenever your dependencies change.

  - `yarn start`

    Start kibana and have it include this plugin. You can pass any arguments that you would normally send to `bin/kibana`

      ```
      yarn start --elasticsearch.url http://localhost:9220
      ```

  - `yarn build`

    Build a distributable archive of your plugin.

  - `yarn test:browser`

    Run the browser tests in a real web browser.

  - `yarn test:server`

    Run the server tests using mocha.

For more information about any of these commands run `yarn ${task} --help`. For a full list of tasks checkout the `package.json` file, or run `yarn run`.
