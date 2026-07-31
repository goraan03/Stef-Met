export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    upload: {
        dir: process.env.UPLOAD_DIR || './uploads',
        maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    },
});