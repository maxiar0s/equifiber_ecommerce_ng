# Equi-Fiber Angular

Aplicacion FrontEnd en Angular 21 para una tienda de snacks naturales para caballos. La solucion simula autenticacion, roles, mantenedores, carrito, compras y pago exitoso sin integrar medios de pago reales.

## Requisitos Cubiertos

- Angular actual con componentes standalone y rutas.
- Bootstrap 5 y grilla de 12 columnas con vistas responsivas para movil, tablet y escritorio.
- Formularios reactivos en inicio de sesion, registro, recuperacion, perfil, carrito y administrador.
- Validaciones de campos, correo, telefono, RUT, edad minima, stock y precios.
- Contrasenas con longitud minima, longitud maxima, mayuscula, numero y confirmacion.
- Roles: `admin`, `cliente` y `centro`.
- Menu integrado con opciones segun sesion y rol.
- Mantenedor de productos, inventario y usuarios para administrador.
- Carrito de compras, ordenes del usuario y pago simulado exitoso.
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

El proyecto incluye 4 pruebas unitarias sobre registro y carrito:

- Contrasenas distintas invalidan el formulario.
- Edad menor a 13 anos invalida el registro.
- Registro valido normaliza el correo y permite direccion opcional.
- Checkout permite direccion opcional con carrito valido.

Archivos de pruebas:

- `src/app/pages/register/register.component.spec.ts`
- `src/app/pages/cart/cart.component.spec.ts`

## Estructura Del Proyecto

- `src/app/pages/`: componentes de pantallas como inicio, tienda, carrito, registro, perfil y administrador.
- `src/app/services/`: servicios compartidos, incluyendo `DataService` para datos simulados en localStorage.
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

## Guion Sugerido Para El Video

1. Ejecutar `npm start` y abrir la aplicacion.
2. Mostrar responsividad cambiando entre escritorio, tablet y movil.
3. Navegar por inicio, tienda, detalle de producto y carrito.
4. Registrar un usuario y mostrar validaciones del formulario.
5. Iniciar sesion como cliente, modificar perfil y revisar compras.
6. Simular una compra desde el carrito.
7. Iniciar sesion como administrador y mostrar mantenedor de productos/usuarios.
8. Ejecutar `npm run test:ci` para mostrar Jasmine/Karma.
9. Ejecutar `npm run docs` y abrir la documentacion Compodoc.

## Entrega

Comprimir el codigo fuente del proyecto en `.zip` o `.rar`. No es necesario incluir `node_modules`, `dist`, `coverage` ni `documentation`, porque se regeneran con los comandos anteriores.
