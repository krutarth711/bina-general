# backend

## lambda functions

I have added code of every lambda function that is being used in the API Gateway.
Use the nodejs folder as a dependency layer to be added as lambda layer - here you will be able to use all the packages and common jwt method used by all the lambda functions.

These are the environment variables that are required to be passed to the lambda functions:

```
DATABASE_NAME	<db-name>
JWT_SECRET	    <jwt-secret>
RDS_HOSTNAME	<rds-hostname>
RDS_PASSWORD	<rds-password>
RDS_PORT	    3306 or <rds-port>
RDS_USERNAME	<username>
```

## API Gateway structure

```
/
    /active-lists
        DELETE
        GET
        POST
        PUT
    /auth
        POST
    /PList
        GET
        POST
        PUT
        /internal
            POST
        /submit
            POST
    /user
        DELETE
        GET
        POST
```

## Pending list upload

change the bucket name inside the PLUpload/index.mjs file to whatever s3 bucket you create and want the uploaded filed to be stored.

## docx creation

Here is the link to the documentation I have used to create word docs: https://docxtemplater.com/docs/api/
This package expects an existing word document in which will be populated according to the values we pass. I have attached that input document in the folder named as "Buland-word-input.docx".

This document should be added inside the folder called "input" which should be inside a s3 bucket. i.e. s3/bulandinvoicetest/input/Buland-word-input.docx

For the created document to take place, there should exist a folder called "output" inside the same s3 bucket. i.e. bulandinvoicetest/output/
All the generated documents will go to this path.
