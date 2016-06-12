node {
   stage 'Checkout'
   git([url: 'https://github.com/tbinias/spotmate-ng.git', branch: 'dockerize'])

   def nodeHome = tool name: 'nodejs-0.12.14', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
   env.PATH = "${nodeHome}/bin:${env.PATH}"

   stage 'Build'
   sh "npm install"
   sh "npm run build"

   stage 'Integration Test'
   sh "npm run integration-test"
   step([$class: 'JUnitResultArchiver', testResults: 'reports/protractor/xml/*.xml'])

   stage 'Build docker & tag'
   sh "docker build -t spotmate:${env.BUILD_NUMBER} ."

   build job: 'deploy spotmate-ng', parameters: [[$class: 'StringParameterValue', name: 'dockertag', value: '${env.BUILD_NUMBER}']], wait: false
}
