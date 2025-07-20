# Set alias for MinIO (replace "local" if your alias is different)

mc alias set local {MinIO_S3_API_URL} {admin_user} {admin_user_password}

# Check configured aliases

mc alias list

# Allow public download access for a specific folder inside the bucket

mc anonymous set download local/{bucket_name}/{folder_name}

# Remove bucket (forcefully and with caution, dangerous command)

mc rb --force --dangerous local/{bucket_name}
