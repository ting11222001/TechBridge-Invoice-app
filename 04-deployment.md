Created two environment related files to set api url.

The environemnt.prod.ts is like this:
```
export const environment = {
  production: true,
  apiUrl: 'https://techbridge-invoice-production.up.railway.app' -> this is the current service url of my Spring Boot project on Railway
};
```

In `angular.json`, this is added:
```
"configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              ...
```

To make sure on Vercel it's using the right api url.

On Vercel, choose `production` as deployment environment and I override the `Build Command` with this:
```
ng build --configuration production
```

Concept-wise it seems that Angular's CLI handles it automatically based on the build command:
```
ng serve or ng build (no flag) → uses environment.ts (dev, localhost)
ng build --configuration production → swaps in environment.prod.ts (prod, Railway URL)
```