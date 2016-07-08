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
   sh "docker build -t dockerreg.binias-online.de:5000/spotmate-ng:${env.BUILD_NUMBER} ."

   stage 'Publish docker image'
   sh "docker push dockerreg.binias-online.de:5000/spotmate-ng:${env.BUILD_NUMBER}"
   
   stage 'Trigger deployment'
   build job: 'spotmate-ng-infrastructure', parameters: [[$class: 'StringParameterValue', name: 'VERSION', value: '${env.BUILD_NUMBER}']], wait: false
}
