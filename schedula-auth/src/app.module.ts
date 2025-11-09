TypeOrmModule.forRootAsync({
  useFactory: () => {
    const isRender = !!process.env.DATABASE_URL;
    if (isRender) {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    } else {
      return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'your_password',
        database: process.env.DB_NAME || 'schedula_db',
        autoLoadEntities: true,
        synchronize: true,
      };
    }
  },
}),
