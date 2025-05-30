pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = '493761185412'                  // Your AWS Account ID
        S3_BUCKET_NAME = 'valuenable.in'           // Replace with your actual S3 bucket name
        CLOUDFRONT_DIST_ID = 'E18LLE49KUMJV1'             // Replace with your actual CloudFront distribution ID
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout your code from GitHub
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                sh '''
                    #!/bin/bash
                    set -e

                    echo "Assuming IAM role..."
                    # Assume role and export AWS credentials for this shell session only
                    eval $(aws sts assume-role --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/OrganizationAccountAccessRole --role-session-name JenkinsSession | \
                        jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\\(.AccessKeyId) AWS_SECRET_ACCESS_KEY=\\(.SecretAccessKey) AWS_SESSION_TOKEN=\\(.SessionToken)"')

                    echo "Running npm install and build..."
                    npm install
                    npm run build

                    echo "Syncing build folder to S3 bucket ${S3_BUCKET_NAME}..."
                    aws s3 sync build/ s3://${S3_BUCKET_NAME} --delete

                    echo "Creating CloudFront invalidation for distribution ${CLOUDFRONT_DIST_ID}..."
                    aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DIST_ID} --paths "/*"

                    echo "Deployment completed successfully."
                '''
            }
        }
    }
}
