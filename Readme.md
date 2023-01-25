
Google Chrome
/
web.dev
Público
El código fuente de frontend, backend y contenido para web.dev

web.dev
Licencia
 Ver licencia
 3,2k estrellas 1,6k horquillas 
Código
Asuntos
162
Solicitudes de extracción
66
Comportamiento
Proyectos
6
wiki
Seguridad
Perspectivas
Google Chrome/web.dev
Última confirmación
@malchata
malchata
…
Hace 6 horas
Estadísticas de Git
archivos
LÉAME.md
web.dev
Integración continua

web.dev es el recurso definitivo para que los desarrolladores de todos los orígenes aprendan, creen y resuelvan en la web. Está destinado no solo a educar a los desarrolladores, sino también a ayudarlos a aplicar lo que han aprendido en cualquier sitio en el que trabajen, ya sea personal o comercial.

¿Encontraste un error?👷‍♀️
¡Gracias por dejarnos saber! Presente un problema y un miembro del equipo responderá en breve.

Contenido de autoría✍️
Antes de comenzar a escribir, tómese un momento para revisar el manual de web.dev y familiarizarse con el proceso. Cuando esté listo, siga los pasos del Inicio rápido para crear su propuesta de contenido.

Construyendo el sitio🏗
Necesitará una versión reciente de Node : v14 (LTS) o superior. Para verificar la versión de su nodo, ejecute node -ven su terminal.

Si no tiene un nodo o si necesita actualizarlo, le recomendamos que utilice el Administrador de versiones de nodos (nvm) .

Clonar el repositorio
git clone https://github.com/GoogleChrome/web.dev.git
Cambiar directorio a la carpeta creada
cd web.dev 
Instalar dependencias
npm ci
Inicie un servidor local para obtener una vista previa del sitio
npm run dev
Abrir http://localhost:8080/para ver el sitio localmente. Los cambios en los activos reconstruirán el sitio. Actualice para ver sus cambios.

Configurar indicadores de compilación
Construir todo el sitio puede llevar un tiempo porque tiene alrededor de mil páginas. Si desea acelerar enormemente sus tiempos de compilación, le sugerimos configurar algunos indicadores de compilación para ignorar ciertas secciones.

Cree un .envarchivo en la raíz de su proyecto
Agregue lo siguiente:
# Ignore ALL site content
ELEVENTY_IGNORE=true

# Only build the directories you're working on.
# Note, this is a JSON string so you must use double quotes.
ELEVENTY_INCLUDE=["blog", "vitals"]
Entornos🌳
Establecido ELEVENTY_ENV=prodpara forzar compilaciones de producción. Este es el valor predeterminado cuando se ejecuta "etapa" o "implementación". No se admiten otras opciones para ELEVENTY_ENV, aunque la configuración de nuestro sitio de Eleventy se establecerá de forma predeterminada en 'dev' si no se especifica.

La compilación de producción actualmente requiere mucha memoria, hasta el punto en que nodepodría salir con errores en la línea de

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory

v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [node]
La cantidad exacta de espacio de almacenamiento dinámico requerida varía de una computadora a otra y de la versión de node. Si necesita una compilación de producción local, pero se queda sin memoria, puede aumentar el tamaño del almacenamiento dinámico agregando --node-options '--max_old_space_size=8192'(para asignar 8 gb de espacio de almacenamiento dinámico ) al npmcomando antes de run. Por ejemplo:

ELEVENTY_ENV=prod npm --node-options '--max_old_space_size=8192' run build
Puesta en escena🕺
Cuando envíe una solicitud de extracción, se preparará automáticamente para usted. Esté atento al bot de netlify para comentar sobre la solicitud de extracción con su URL única.

Desplegando el sitio🚀
Despliegues automáticos
El sitio construirá e implementará la sucursal principal automáticamente cada hora, de lunes a viernes. Si acaba de fusionar un artículo, debería publicarse en la parte superior de la próxima hora.

Despliegues manuales
Para implementar manualmente el sitio, deberá ser miembro de uno de estos equipos de Google:

web.dev-esp
web.dev-propietarios
Vaya a la página Activadores de Cloud Build .
Haga clic en el botón EJECUTAR para el activador denominado Implementar .
En el cajón lateral que se abre, haga clic en el botón EJECUTAR DISPARADOR para activar la rama principal .
NOTA: web.dev se implementa automáticamente cada hora si hay una nueva confirmación en la mainrama. Las implementaciones manuales solo deben ocurrir cuando falla una compilación o si las implementaciones automáticas están deshabilitadas.

depuración🐛
Si necesita depurar el proceso de construcción del sitio:

Agregar una debuggerdeclaración a.eleventy.js
Corrernpm run debug:eleventy
Vaya a about://inspectpara adjuntar al proceso en ejecución.
La página de inspección de Chrome que muestra el botón de inspección

Lanzamientos
