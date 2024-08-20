# Buscador de precios en Rosario **( [VER APP](https://davidoreiro97.github.io/BuscadorPreciosRosario/) )**

##

---

## Objetivos

- ##### Buscar los productos más baratos en toda la ciudad de Rosario, Santa Fe, Argentina.
- ##### Buscar los productos cercanos más baratos en base a una dirección ingresada por el usuario, es decir, el usuario ingresa una dirección y también selecciona el radio de busqueda alrededor de dicha dirección hasta donde quiera buscar supermercados.
- ##### Informar al usuario a cuantas cuadras se encuentra de dicho supermercado y de sus sucursales.

##

---

## Consideraciones

- ##### La aplicación busca en tiempo real en la página de cada supermercado el producto, lo cual puede llevar a que tenga algo de lentitud.
- ##### Las busquedas pueden verse alteradas con productos que no tengan coherencia con lo buscado por el usuario debido a que `los buscadores de los supermercados devuelven búsquedas poco coherentes de los productos`. Es decir, hay supermercados donde si buscamos "pan" la busqueda nos devolverá pan y además pañuelos debido a que la búsqueda en el supermercado está mal programada.

- ##### Solo funciona para la ciudad de de Rosario, Santa Fe, Argentina.
- ##### La distancia calculada entre el usuario y las sucursales no es exacta (en cuadras) ya que se utiliza la formula de Haversine la cual calcula la distancia en línea recta entre dos puntos en una esfera y no la distancia en cuadras como sí lo haría un servicio de geolocalización.
- ##### Se invirtieron 0$ en la aplicación y su desarrollo, funciona con servicios gratuitos tanto en el frontend como en el backend y esto también aplica limitaciones de planes gratuitos en los servicios utilizados (Here api para la geolocalización inversa, localtunnel para crear un tunel entre internet y el servidor local, ngrok para tener un tunel de respaldo por si falla localtunnel), ahora se utiliza también el tunel de cloudflare Zero Trust el cual parece bastante estable y localtunnel como respaldo, ya que, ngrok solo permite 1GB de transferencia mensual en su plan gratuito.
- ##### El servidor es una PC común con una conexión a internet hogareña lo cual está expuesta a riesgos como cortes de luz, internet, fallos de hardware, etc.

##

---

## Mejoras para la próxima versión

- ##### En lugar de que las consultas se realicen en tiempo real y una a una por cada supermercado, en la próxima versión se apunta a tener una base de datos que se actualice semanalmente lo cual reducirá inmensamente el tiempo de espera al buscar un producto. **Esto mitigaria el punto 1 de las consideraciones.**
- ##### Teniendo los productos en una base de datos en lugar de obtenerlos de una búsqueda realizada en la página web de los supermercados podré mejorar las búsquedas y devolver productos mucho más coherentes a la búsqueda de cada usuario. **Esto mitigaria el punto 2 de las consideraciones.**

##

---

## Funcionamiento en líneas generales

### ■ Elementos ya disponibles en la app

- ##### Se tiene un .json con la información de todos los supermercados de la ciudad de Rosario los cuales tienen un sitio web de donde se pueden extraer datos, en este archivo estan contenidos datos como : El nombre del supermercado,&nbsp; todas sus sucursales con : dirección, latitud y longitud de cada una.
- ##### Se tiene un servidor local el cual realiza web scrapping de las búsquedas enviadas por el usuario, también realiza consultas al servidor de geoloalización inversa.
- ##### Se tiene una función la cual utiliza la formula de Haversine para calcular la distancia aproximada que debe recorrer el usuario para llegar hasta cada sucursal.
- ##### Se tiene una función que analiza si la latitud y longitud no son mayores o menores a un cierto rango de latitudes que es donde se encuentra la ciudad de Rosario.

### ■ Flujo básico de la APP

##### 1. Se le da un mensaje de bienvenida al usuario.

##### 2. Se le dan 3 opciones (**PASO 1**) :

- ##### Mi ubicación actual : Inentará detectar la ubicación actual del usuario con buena presición.
  - ##### [ERROR] Si la ubicación no está dentro de la ciudad de Rosario o tiene mala presición arrojará un error volviendo al Paso 1.
  - ##### [OK] En caso positivo pasa al Paso 2 con el usuario con latitud y longitud ya obtenidas para utilizar en la formula de haverssine.
- ##### Ingresar una ubicación : Esta opción nos envía al Paso 2.
- ##### Toda la ciudad : Esta opcion nos envía al paso 3.

##### 3.1 **[ ELIGIO PREVIAMENTE "Mi ubicacion actual" ]** Se le dan 4 opciones (**PASO 2**) :

- ##### Hasta 10,&nbsp; 20,&nbsp; 30 o 40 Cuadras desde la ubicación actual : Estas opciones envían a una función (que calcula si existen sucursales de algún supermercado cercano mediante Haversine) la latitud, longitud y el rango de búsqueda del usuario y devuelve ; [ERROR] Si la función no encuentra ningún supermercado dentro del radio de búsqueda le informa al usuario y vuelve al Paso 2. [OK] Si la función encuentra supermercados cercanos los guarda en un estado global junto con la distancia a cada sucursal, pasa al Paso 3.

##### 3.2 **[ ELIGIO PREVIAMENTE "Ingresar una ubicación" ]** Se le dan 5 opciones (**PASO 2**) :

- ##### Un campo para que ingrese una ubicación deseada.
- ##### 4 opciones para que ingrese el radio de búsqueda a partir de dicha ubicación.
- ##### Se envía al servidor la dirección ingresada por el usuario una vez presionado un radio, el servidor puede responder con:
  - ##### [ERROR] Caso en el que la API no encuentre una dirección para la búsqueda : Se informará al usuario y se le permite ingresar la dirección nuevamente.
  - ##### [ERROR] Caso en el que la dirección se encuentre fuera de la ciudad de Rosario : Se le informará al usuario y se le permite ingresar la dirección nuevamente.
  - ##### [ERROR] Caso en el que luego de 10 intentos no se puede conectar con localtunnel y otros 10 no se puede conectar con ngrok : Se le informará al usuario "No se pudo conectar con el tunel".
  - ##### [OK] Se le muestra al usuario el nombre de la dirección devuelta por la API para que la confirme, en caso que no la confirme se le permite ingresar otra dirección, en caso que confirme la aplicación calculará si existen supermercados cercanos con la latitud y longitud devuelta por la API y el rango ingresado por el usuario. Si la función no encuentra supermercados cercanos arrojará un error y le pedirá al usuario ingresar una nueva dirección o buscar a más distancia, si enncuentra supermercados cercanos permitira continuar al paso 3.

##### 4. El usuario debe ingresar el nombre del producto a buscar (**PASO 3**) :

- ##### El usuario ingresa su producto y este se envía en varias solicitudes al servidor junto con uno de los supermercados que estén dentro del rango elegido por el usuario.
- ##### El servidor responde a cada una de las solicitudes con los 20 productos de menor precio encontrados en la búsqueda en la página web de dicho supermercado, los productos devueltos tienen : nombre, precio, url a la imagen, url al producto original (si está disponible en el supermercado).
- ##### Una vez consultados todos los supermercados se juntan todos los productos en un estado global y se los muestra al usuario.
- ##### [ERROR] Si la aplicación intenta 20 veces conectarse al tunel (10 con ngrok y 10 con localtunnel) y no lo logra lo informará al usuario por cada supermercado individualmente.
- ##### [ERROR] Si por algún motivo el servidor no consigue hacer web scrapping de la página del supermercado (por un baneo o por algúna otra dificultad) lo informará al usuario individualmente por cada supermercado con error.
