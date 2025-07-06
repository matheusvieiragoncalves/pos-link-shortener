import { env } from '@/env';
import { app } from './app';

app.listen({ port: env.PORT, host: env.HOST }, () => {
  console.log(`🚀 Server is running on http://${env.HOST}:${env.PORT}`);
});
