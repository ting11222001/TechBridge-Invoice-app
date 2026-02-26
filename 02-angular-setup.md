Angular CLI, Angular, Node.js, TypeScript, and RxJS version compatibility:
https://angular.dev/reference/versions

Some open source guides:
https://github.com/layzeedk

https://this-is-angular.github.io/angular-guides/docs/category/fundamentals

https://this-is-learning.github.io/rxjs-fundamentals-course/

node.js:
https://nodejs.org/en/download

nvm:
https://github.com/coreybutler/nvm-windows

Bootstrap:
https://getbootstrap.com/
```
npm i bootstrap
```

Install Angular CLI:
https://angular.dev/installation
```
npm install -g @angular/cli
```

Create a new angular project:
```
ng new <project name>
```

Start up the angular app:
```
cd <project root folder>
ng serve
```

Create a login component:
```
ng generate c component/login --skip-tests=true
```

Add bootstrap in angular.json in "styles":
```
 "node_modules/bootstrap/dist/css/bootstrap.min.css",
```

Generate a service:
```
ng g service service/user --skip-tests=true
```

Generate an interface:
```
ng g interface interface/user
```

Handling request failure:
https://angular.dev/guide/http/making-requests#handling-request-failure