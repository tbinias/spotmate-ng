node {
   // Mark the code checkout 'stage'....
   stage 'Checkout'
   // Get some code from a GitHub repository
   git([url: 'https://github.com/tbinias/spotmate-ng.git', branch: 'dockerize'])
   // Get the maven tool.
   // ** NOTE: This 'M3' maven tool must be configured
   // **       in the global configuration.
   //def mvnHome = tool 'M3'
   def nodeHome = tool name: 'nodejs-0.12.14', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
   env.PATH = "${nodeHome}/bin:${env.PATH}"

   // Mark the code build 'stage'....
   stage 'Build'
   sh "npm install"
   sh "npm run build"

   stage 'E2E Test'
   sh "npm run e2etest"
   //sh "docker-compose build"
   //sh "docker-compose up -d"
   //sh "./waitForDockerCompose.sh"
   //sh "node_modules/protractor/bin/protractor test/protractor.conf; echo \$? > protractor_status"
   step([$class: 'JUnitResultArchiver', testResults: 'reports/protractor/xml/*.xml'])
   //def r = readFile('status').trim()
   //sh "docker-compose down"
}
