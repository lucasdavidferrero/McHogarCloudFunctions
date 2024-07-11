
# Enviroment Variables
https://firebase.google.com/docs/functions/config-env?gen=2nd#env-variables

# Comandos Prisma
`npx prisma generate` -> Sincroniza el modelo prisma con la base de datos.

## Migraciones 
After updating your schema, create a migration file with:
```
npx prisma migrate dev --name <migration-name>
```
If you need to see what your database schema looks like after running the migration, you can use (optional step):
```
npx prisma studio
```
Generate Prisma Client
```
npx prisma generate
```
## Migración manual
En caso que se necesite modificar el .sql que se ejecutará en la migración:
```
npx prisma migrate dev --create-only
```
Esto genera el .sql y da la posibilidad al desarrollador de ajustar este archivo a sus necesidades.
Luego de haber modificado el .sql, ejecutar:
```
npx prisma migrate dev
```

links: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client , https://www.prisma.io/docs/orm/prisma-migrate/getting-started , https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model