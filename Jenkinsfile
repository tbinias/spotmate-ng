node {
   def nodeHome = tool name: 'nodejs-0.12.14', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
   env.PATH = "${nodeHome}/bin:${env.PATH}"

   // Mark the code build 'stage'....
   stage 'Build'
   sh "npm install"
   sh "npm run build"

   stage 'Integration Test'
   sh "npm run integration-test"
   step([$class: 'JUnitResultArchiver', testResults: 'reports/protractor/xml/*.xml'])
}
