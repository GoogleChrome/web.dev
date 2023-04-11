https://github.com/snyk/actions/

nombre : Snyk Infraestructura como código

en :
  empujar :
    ramas : [ "principal" ]
  pull_request :
    # Las ramas de abajo deben ser un subconjunto de las ramas de arriba
    ramas : [ "principal" ]
  horario :
    - cron : ' 28 6 * * 4 '

permisos :
  contenido : leer

trabajos :
  snyk :
    permisos :
      contenido : leer # para acciones/pago para obtener código
      eventos de seguridad : escriba # para github/codeql-action/upload-sarif para cargar los resultados de SARIF
      acciones : lectura # solo requerida para un repositorio privado por github/codeql-action/upload-sarif para obtener el estado de ejecución de la acción
    se ejecuta en : ubuntu-latest
    pasos :
      - usos : acciones/checkout@v3
      - nombre : Ejecute Snyk para verificar los archivos de configuración en busca de problemas de seguridad
        continuar en caso de error : verdadero
        usos : snyk/actions/iac@14818c4695ecc4045f33c9cee9e795a788711ca4
        env :
          SNYK_TOKEN : ${{ secretos.SNYK_TOKEN }}
        con :
          archivo : su-archivo-a-prueba.yaml
      - nombre : Subir resultado a GitHub Code Scanning
        usos : github/codeql-action/upload-sarif@v2
        con :
          sarif_file : snyk.sarif
