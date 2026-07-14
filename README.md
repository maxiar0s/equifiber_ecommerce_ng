# Equi-Fiber Angular

Aplicacion FrontEnd en Angular 21 para una tienda de snacks naturales para caballos. La solucion simula autenticacion, roles, mantenedores, carrito, compras y pago exitoso sin integrar medios de pago reales.

## Requisitos Cubiertos

- Angular actual con componentes standalone y rutas.
- API REST de Firebase Realtime Database con metodos GET, POST, PUT y DELETE.
- Bootstrap 5 y grilla de 12 columnas con vistas responsivas para movil, tablet y escritorio.
- Formularios reactivos en inicio de sesion, registro, recuperacion, perfil, carrito y administrador.
- Validaciones de campos, correo, telefono, RUT, edad minima, stock y precios.
- Contrasenas con longitud minima, longitud maxima, mayuscula, numero y confirmacion.
- Roles: `admin`, `cliente` y `centro`.
- Menu integrado con opciones segun sesion y rol.
- Mantenedor de productos, inventario y usuarios para administrador.
- Carrito de compras, ordenes del usuario y pago simulado exitoso.
- Contenedor Docker multi-stage con Node.js y Nginx.
- Pruebas unitarias con Jasmine y Karma.
- Documentacion generada con Compodoc.

## Usuario Administrador

- Correo: `admin@equifiber.cl`
- Contrasena: `Admin123!`

## Ejecutar Aplicacion

```bash
npm install
npm start
```

Abrir `http://localhost:4200/`.

## Pruebas Unitarias

```bash
npm run test:ci
```

El proyecto incluye 15 pruebas unitarias sobre registro, carrito, administracion y API REST:

- Contrasenas distintas invalidan el formulario.
- Edad menor a 13 anos invalida el registro.
- Registro valido normaliza el correo y permite direccion opcional.
- Checkout permite direccion opcional con carrito valido.
- Producto sin descripcion no se guarda en inventario.
- Producto valido se agrega al inventario.
- Productos se cargan desde Firebase mediante GET.
- Productos se crean mediante POST.
- Productos se actualizan mediante PUT.
- Productos se eliminan mediante DELETE.
- Usuarios de demostracion se guardan y consumen desde Firebase.
- Perfiles de usuario se eliminan desde Firebase.

Archivos de pruebas:

- `src/app/pages/register/register.component.spec.ts`
- `src/app/pages/cart/cart.component.spec.ts`
- `src/app/pages/admin/admin.component.spec.ts`
- `src/app/services/data.service.spec.ts`

## Estructura Del Proyecto

- `src/app/pages/`: componentes de pantallas como inicio, tienda, carrito, registro, perfil y administrador.
- `src/app/services/`: servicios compartidos; `DataService` consume productos desde Firebase y conserva sesion, carrito y usuarios de demostracion en localStorage.
- `src/environments/environment.ts`: URL de Firebase Realtime Database.
- `src/app/guards/`: guards de rutas para sesion y rol administrador.
- `src/app/app.routes.ts`: definicion central de rutas de navegacion.

## Documentacion

Generar documentacion estatica:

```bash
npm run docs:build
```

Levantar documentacion navegable:

```bash
npm run docs
```

Compodoc publica la documentacion en `http://localhost:8080/` y genera archivos en `documentation/`.

## Build

```bash
npm run build
```

Los archivos compilados quedan en `dist/equifiber-angular/`.

## Firebase Realtime Database

El catalogo de productos usa la API REST de Firebase:

```text
https://equifiber-240b7-default-rtdb.firebaseio.com/products.json
```

| Accion | Metodo | Endpoint |
|---|---|---|
| Listar productos | GET | `/products.json` |
| Crear producto | POST | `/products.json` |
| Actualizar producto | PUT | `/products/{id}.json` |
| Eliminar producto | DELETE | `/products/{id}.json` |

Firebase almacena usuarios de demostracion bajo `/users/{rut}.json`, incluyendo sus claves ficticias para permitir el inicio de sesion sin integrar Firebase Authentication.

> Advertencia: este enfoque es exclusivamente academico. Las reglas permiten leer credenciales ficticias para demostrar el consumo de datos; nunca debe utilizarse con usuarios o contrasenas reales.

Las reglas de `database.rules.json` bloquean el resto de la base y habilitan acceso solamente a productos y usuarios ficticios. Una aplicacion real deberia utilizar Firebase Authentication.

Para publicar las reglas con Firebase CLI:

```bash
firebase login
firebase deploy --only database
```

## Docker

Con Docker Desktop iniciado, construir y ejecutar la imagen:

```bash
docker build -t equifiber-angular:latest .
docker run --rm -p 8080:8080 equifiber-angular:latest
```

Abrir `http://localhost:8080/` y comprobar tambien una ruta interna como `http://localhost:8080/tienda`.

Publicar en Docker Hub:

```bash
docker login
docker tag equifiber-angular:latest maxiar0s/equifiber-angular:latest
docker push maxiar0s/equifiber-angular:latest
```

Imagen publicada: [maxiar0s/equifiber-angular](https://hub.docker.com/r/maxiar0s/equifiber-angular)

## Despliegue Cloud

La imagen puede desplegarse como servicio web en Render usando la imagen publica de Docker Hub. El contenedor escucha en el puerto `8080`.

## Guion Sugerido Para El Video

1. Ejecutar `npm start` y abrir la aplicacion.
2. Mostrar responsividad cambiando entre escritorio, tablet y movil.
3. Navegar por inicio, tienda, detalle de producto y carrito.
4. Registrar un usuario y mostrar validaciones del formulario.
5. Iniciar sesion como cliente, modificar perfil y revisar compras.
6. Simular una compra desde el carrito.
7. Iniciar sesion como administrador y mostrar mantenedor de productos/usuarios.
8. Abrir Firebase y mostrar que crear, editar y eliminar productos modifica la base remota.
9. Mostrar la imagen publicada en Docker Hub y la aplicacion ejecutandose en Cloud.
10. Ejecutar `npm run test:ci` para mostrar Jasmine/Karma.
11. Ejecutar `npm run docs` y abrir la documentacion Compodoc.

## Entrega

Comprimir el codigo fuente del proyecto en `.zip` o `.rar`. No es necesario incluir `node_modules`, `dist`, `coverage` ni `documentation`, porque se regeneran con los comandos anteriores.

Antes de entregar, agregar aqui los enlaces definitivos de Trello y la aplicacion desplegada en Cloud.
