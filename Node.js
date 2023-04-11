nombre : Node.js CI

en :
  empujar :
    ramas : [ "principal" ]
  pull_request :
    ramas : [ "principal" ]

trabajos :
  construir :

    se ejecuta en : ubuntu-latest

    estrategia :
      matriz :
        versión de nodo : [14.x, 16.x, 18.x]
        # Consulte el cronograma de lanzamiento de Node.js compatible en https://nodejs.org/en/about/releases/

    pasos :
    - usos : acciones/checkout@v3
    - nombre : Usar Node.js ${{ matrix.node-version }}
      usos : acciones/setup-node@v3
      con :
        versión-nodo : ${{ matrix.versión-nodo }}
        caché : ' npm '
    - ejecutar : npm ci
    - ejecutar : npm ejecutar compilación --si está presente
    - ejecutar : prueba npm
