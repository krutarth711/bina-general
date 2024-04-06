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

## SQL queries

### user

```
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('Super Admin','Admin','Staff') NOT NULL DEFAULT 'Staff',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

```

### Pending lists

```
CREATE TABLE `pending_lists` (
  `plist_id` int NOT NULL AUTO_INCREMENT,
  `listname` varchar(255) NOT NULL,
  `s3_url` varchar(255) DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `list_status` enum('In-Progress','In-Review','Submitted','Not-Started') DEFAULT 'Not-Started',
  `submit_url` varchar(255) DEFAULT '',
  PRIMARY KEY (`plist_id`),
  UNIQUE KEY `plist_id_UNIQUE` (`plist_id`),
  UNIQUE KEY `s3_url_UNIQUE` (`s3_url`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

```

### Active lists

```
CREATE TABLE `active_lists` (
  `alist_id` int NOT NULL AUTO_INCREMENT,
  `actual_quantity` int DEFAULT NULL,
  `total_weight` float DEFAULT NULL,
  `unit` enum('KGS','GRMS','MLS') DEFAULT 'KGS',
  `BL_id` int DEFAULT NULL,
  `total_price` float NOT NULL,
  `item_name` varchar(45) NOT NULL,
  `unit_price` float DEFAULT NULL,
  `unit_weight` float DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hs_code` varchar(45) DEFAULT NULL,
  `radiation` varchar(45) DEFAULT NULL,
  `chemical` varchar(45) DEFAULT 'NILL',
  `brand` varchar(45) DEFAULT NULL,
  `UOM` varchar(45) DEFAULT 'PKTS',
  `unit_pieces` int DEFAULT '0',
  `total_pieces` int DEFAULT '0',
  `final_quantity` int DEFAULT '0',
  PRIMARY KEY (`alist_id`),
  KEY `fk_pending_lists` (`BL_id`),
  CONSTRAINT `fk_pending_lists` FOREIGN KEY (`BL_id`) REFERENCES `pending_lists` (`plist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
