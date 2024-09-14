Blockchain Voting DApp

This is a blockchain-based decentralized application (DApp) for voting built using Truffle, Node.js, and Docker. This document will guide you through the steps to set up, run the application locally, and configure it using Docker along with Jenkins for CI/CD.
Prerequisites

Ensure you have the following tools installed:

    Node.js (v16 or higher)
    npm (v6 or higher, usually comes with Node.js)
    Truffle (for compiling, testing, and migrating smart contracts)
    Ganache (for running a local Ethereum blockchain)
    Docker (for containerizing the app)
    Jenkins (for CI/CD pipelines)

Install Truffle and Ganache

bash

npm install -g truffle
npm install -g ganache-cli

Running the Application Locally
1. Clone the Repository

First, clone the project repository to your local machine:

bash

git clone https://github.com/pavankalyanvarikolu/votingapp.git
cd votingapp

2. Install Dependencies

Use npm to install the project's dependencies:

bash

npm install

3. Compile Smart Contracts

Compile the smart contracts with Truffle:

bash

truffle compile

4. Run a Local Blockchain

In another terminal window, start a local Ethereum blockchain using Ganache:

bash

ganache-cli

This will start a local blockchain on http://127.0.0.1:8545.
5. Migrate Smart Contracts

Deploy the smart contracts to the local blockchain:

bash

truffle migrate --reset

6. Run the Application

Once the contracts are deployed, you can start the application using:

bash

npm run dev

This will start the app using lite-server, which will serve the app on http://localhost:3000. You can now interact with the DApp through your browser.
Running the Application Using Docker
1. Build the Docker Image

If you have Docker installed, you can run the application using a Docker container. First, build the Docker image:

bash

docker build -t votingapp .

2. Run the Docker Container

After building the image, run it using the following command:

bash

docker run -p 3000:3000 votingapp

This will serve the app on http://localhost:3000 inside a Docker container.
Jenkins Pipeline Setup
Step 1: Install Jenkins

You can run Jenkins locally using Docker:

bash

docker run -d -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts

Access Jenkins at http://localhost:8080 and follow the on-screen instructions to unlock Jenkins and complete the setup.
Step 2: Install Jenkins Plugins

To run the pipeline, you’ll need the following plugins:

    NodeJS Plugin
    Docker Pipeline Plugin
    Git Plugin
    Pipeline Plugin
    JUnit Plugin (Optional for publishing test results)
    Slack Notification Plugin (Optional for notifications)

Go to Manage Jenkins > Manage Plugins, search, and install the above plugins.
Step 3: Configure Node.js in Jenkins

    Go to Manage Jenkins > Global Tool Configuration.
    Add Node.js, name it NodeJS_18, and choose version 18.x.

Step 4: Create a Pipeline Job

    Create a new pipeline job in Jenkins:
        Click on New Item > Pipeline > OK.
    Configure the job:
        Under Pipeline, select Pipeline script and paste the following script.

Jenkins Pipeline Script

Here’s an end-to-end Jenkins pipeline script for your DApp:

groovy

pipeline {
    agent any

    tools {
        nodejs 'NodeJS_18' // Make sure the name matches the one in Jenkins
    }

    environment {
        DOCKER_IMAGE = 'bcvotingapp'
        GIT_REPO = 'https://github.com/pavankalyanvarikolu/votingapp.git'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${env.GIT_REPO}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${env.DOCKER_IMAGE}")
                }
            }
        }

        stage('Run Application') {
            steps {
                script {
                    docker.image("${env.DOCKER_IMAGE}").run('-p 3000:3000')
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'Pipeline succeeded'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}

Step 5: Run the Jenkins Pipeline

    Click Build Now to run the pipeline.
    The pipeline will:
        Pull the latest code from the repository.
        Install dependencies using Node.js.
        Build a Docker image for the DApp.
        Run the DApp in a Docker container.

Once the pipeline completes, the application will be available at http://localhost:3000.