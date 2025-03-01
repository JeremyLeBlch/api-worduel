import Redis from 'ioredis';

// Initialisation de Redis
const redis = new Redis({
  host: 'redis', // Le nom du service Redis dans le docker-compose
  port: 6379
});

// Fonction pour récupérer des données en cache
export const getCache = async (key: string) => {
  const cachedData = await redis.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

// Fonction pour définir des données dans le cache
export const setCache = async (key: string, value: any, expiry: number = 60) => {
  await redis.set(key, JSON.stringify(value), 'EX', expiry); // Par défaut, expiration dans 60 secondes
};

// Fonction pour supprimer des données du cache
export const deleteCache = async (key: string) => {
  await redis.del(key);
};