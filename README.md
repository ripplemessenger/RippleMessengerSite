## run
1. clone the code
2. modify .env(database, base url)
3. 
```
npm install
npx prisma generate
npm run dev
```

## deploy
1. run without problem
2. point nginx to localhost:3000
3.
```
npm run build
npm run start
```
or
```
npm install -g pm2
npm run build
pm2 start npx --name web -- next start -p 3000
pm2 save
crontab -e
0 3 * * * cd /your/path/to/site && npm run build && pm2 reload web --update-env
```
