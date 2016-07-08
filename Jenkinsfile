node {
   stage 'Checkout'
   checkout scm

   def nodeHome = tool name: 'nodejs-0.12.14', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
   env.PATH = "${nodeHome}/bin:${env.PATH}"

   stage 'Build'
   sh "npm install"
   sh "npm run build"

   stage 'Integration Test'
   sh "npm run integration-test"
   step([$class: 'JUnitResultArchiver', testResults: 'reports/protractor/xml/*.xml'])

   stage 'Build docker image'
   sh "docker build -t dockerreg.binias-online.de:5000/spotmate-ng:${BUILD_NUMBER} ."

   stage 'Publish docker image'
   sh "docker push dockerreg.binias-online.de:5000/spotmate-ng:${BUILD_NUMBER}"

   //stage 'Create artifacts'
   //archive 'Dockerfile, app/**/*, build/dist/**/*,apache/**/*'
}
