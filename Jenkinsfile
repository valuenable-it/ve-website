pipeline {
    agent any
    
    environment {
        // Set NVM environment variables
        NVM_DIR = '/home/ubuntu/.nvm'
        NODE_VERSION = '18.18.2'
    }
    
    stages {
        stage('Detect Branch and Set Environment') {
            steps {
                script {
                    // Detect the current branch name
                    def branchName = env.BRANCH_NAME
                    env.ENVIRON = 'development'
                }
            }
        }
        
        stage('Checkout Configuration Repository') {
            steps {
                script {
                    // Checkout the configuration repository containing script.sh and env_values.py
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "refs/heads/${env.BRANCH_NAME}"]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'Template']],
                        submoduleCfg: [],
                        userRemoteConfigs: [[credentialsId: 'valuenable-it', url: 'https://github.com/valuenable-it/jenkins-config-repo']]
                    ])
                    
                    def envValuesFile = readFile 'Template/env_values.py'
                    def envVars = evaluate(envValuesFile)
                    
                    def environment = env.ENVIRON.toLowerCase()
                    if (envVars[environment]) {
                        env.TO_MAIL = envVars[environment].TO_MAIL
                        env.CC_MAIL = envVars[environment].CC_MAIL
                        env.CUSTOM_MESSAGE = envVars[environment].CUSTOM_MESSAGE
                    } else {
                        error "Environment '${environment}' not found in the JSON file."
                    }
                }
            }
        }
        
        stage('Setup Node Environment') {
            steps {
                script {
                    // Source NVM and set up Node.js environment
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
                        
                        # Use the specified Node version
                        nvm use ${NODE_VERSION}
                        
                        # Verify Node and npm versions
                        node --version
                        npm --version
                        
                        # Clear npm cache to avoid potential issues
                        npm cache clean --force
                    '''
                }
            }
        }
        
        stage('Move Scripts') {
            steps {
                sh "mv Template/react_deploy.sh ."
                sh "mv Template/env_master.sh ."
            }
        }
        
        stage('Execute Script') {
            steps {
                script {
                    // Run script with proper NVM environment
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
                        
                        # Use the specified Node version
                        nvm use ${NODE_VERSION}
                        
                        # Make script executable and run it
                        chmod +x react_deploy.sh
                        ./react_deploy.sh ${ENVIRON}
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                def gitAuthor = sh(returnStdout: true, script: 'git log -1 --pretty=format:"%an"').trim()
                def triggeredByUser = null
                
                if (currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause').size() > 0) {
                    triggeredByUser = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')[0].userId
                } else {
                    triggeredByUser = gitAuthor ?: 'Unknown'
                }
                
                emailext (
                    body: "Build ${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'\n\n" +
                          "Build URL: ${env.BUILD_URL}\n\n" +
                          "Triggered by: ${triggeredByUser}\n\n" +
                          "${env.CUSTOM_MESSAGE}",
                    subject: "${env.ENVIRON.toUpperCase()} - Jenkins Build Notification - ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                    to: env.TO_MAIL,
                    cc: env.CC_MAIL,
                    from: "jenkins@valuenable.in"
                )
            }
        }
    }
}
