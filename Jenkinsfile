node {
   stage 'Checkout'
   git([url: 'https://github.com/tbinias/spotmate-ng.git', branch: 'dockerize'])

   def nodeHome = tool name: 'nodejs-0.12.14', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
   env.PATH = "${nodeHome}/bin:${env.PATH}"

   stage 'Build'
   sh "npm install"
   sh "npm run build"

   stage 'E2E Test'
   sh "npm run integration-test"
   step([$class: 'JUnitResultArchiver', testResults: 'reports/protractor/xml/*.xml'])
}
