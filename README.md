# Image Optimization System

## Overview
This system handles the uploading of CSV files containing image data, processes their content by optimizing images through an asynchronous image processing service, and provides mechanisms for tracking the status of uploads and notifying users through webhooks once processing is complete.

## Features
- CSV file upload for image data
- Asynchronous image optimization
- Status checking for processing requests
- Webhook notifications for completed optimizations

## API Endpoints

### 1. Upload CSV
- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Description**: Uploads a CSV file containing image data to the database.
- **Response**: Returns a request ID for tracking the processing status.

### 2. Check Status
- **URL**: `/status/{requestId}`
- **Method**: `GET`
- **Description**: Retrieves the processing status of the uploaded CSV file.

### 3. Register Webhook
- **URL**: `/webhook/register`
- **Method**: `POST`
- **Description**: Registers a webhook URL to receive notifications when image optimization is complete.

## Components
- **API Endpoints**: Handles file uploads, status checks, and webhook registration.
- **Database**: Stores CSV contents, webhook URLs, and optimization job information.
- **Async Optimizer Worker**: A cron job that runs every 2 minutes to process images and send results to webhooks.

## Database Schema
The system uses PostgreSQL with the following tables in the `images` schema:
- **productimages**: Stores metadata for product images.
- **optimizerjobs**: Tracks optimization jobs for images.
- **webhookurls**: Stores webhook URLs for notifications.

## Technologies Used
- **Backend Framework**: Node.js
- **Database**: PostgreSQL
- **Scheduler**: Cron
- **Inversion of Control (IoC)**: Inversify
- **Image Optimization**: Sharp
- **Webhook Delivery**: Axios
- **Version Control**: Git
- **Onion Architecture**: Impletmented to ensure modularity and scalability by organizing code into layers (domain, application, infrastructure).

## Technical Design Document
[https://docs.google.com/document/d/1gIfsBHksEhyHFkmCMNWQK-wMJcNRlEVR_jRJCs5CFmM/edit?tab=t.0](https://docs.google.com/document/d/1gIfsBHksEhyHFkmCMNWQK-wMJcNRlEVR_jRJCs5CFmM/edit?tab=t.0)

