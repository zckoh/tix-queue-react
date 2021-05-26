pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerCredentials')
        REACT_APP_BACKEND_URL = "/api/"
        CI = "true"
    }

    stages {
        stage('Install dependencies with NPM') {
            steps {
                nodejs('node14.1.0') {
                    sh('yarn install')
                }
            }
        }

        stage('Test') {
            steps {
                nodejs('node14.1.0') {
                    sh('yarn test')
                }
            }
        }

        stage('Create production build') {
            steps {
                nodejs('node14.1.0') {
                    sh('yarn build')
                }
            }
        }

        stage('Login to docker') {
            steps {
                sh('docker login -u $DOCKER_CREDENTIALS_USR -p $DOCKER_CREDENTIALS_PSW')
            }
        }

        stage('Build docker image') {
            steps {
                sh('docker build -t $DOCKER_CREDENTIALS_USR/help-queue-react .')
            }
        }

        stage('Push docker image to registry') {
            steps {
                sh('docker push $DOCKER_CREDENTIALS_USR/help-queue-react')
            }
        }
    }
}
