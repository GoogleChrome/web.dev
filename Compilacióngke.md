nombre : Compilación e implementación en GKE
en :
  empujar :
    ramas : [ "principal" ]
env :
  PROJECT_ID : ${{ secretos.GKE_PROJECT }}
  GAR_LOCATION : us-central1 # TODO: actualizar la región del registro de artefactos
  GKE_CLUSTER : clúster-1     # TODO: actualizar el nombre del clúster
  GKE_ZONE : us-central1-c    # TODO: actualizar la zona del clúster
  DEPLOYMENT_NAME : gke-test # TODO: actualizar el nombre de la implementación
  REPOSITORIO : muestras # TODO: actualización del repositorio acoplable de Artifact Registry
  IMAGEN : sitio estático
trabajos :
  setup-build-publish-deploy :
    nombre : Configurar, Construir, Publicar e Implementar
    se ejecuta en : ubuntu-latest
    medio ambiente : producción

    permisos :
      contenido : ' leer '
      id-token : ' escribir '
         pasos :
    - nombre : Caja
      usos : acciones/checkout@v3
    - id : ' autorización '
      nombre : ' Autenticar en Google Cloud '
      utiliza : ' google-github-actions/auth@v0 '
      con :
        token_format : ' acceso_token '
        workload_identity_provider : ' proyectos/123456789/ubicaciones/global/workloadIdentityPools/mi-grupo/proveedores/mi-proveedor '
        service_account : ' my-service-account@my-project.iam.gserviceaccount.com '
    - nombre : configuración de Docker
      correr : |-
        echo ${{pasos.auth.salidas.access_token}} | docker login -u oauth2accesstoken --password-stdin https://$GAR_LOCATION-docker.pkg.dev
    - nombre : configurar las credenciales de GKE
      usos : google-github-actions/get-gke-credentials@v0
      con :
        nombre_del_clúster : ${{ env.GKE_CLUSTER }}
        ubicación : ${{ env.GKE_ZONE }}
    - nombre : Construir
      correr : |-
        compilación de la ventana acoplable \
          --tag "$GAR_LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$GITHUB_SHA" \
          --construir-arg GITHUB_SHA="$GITHUB_SHA" \
          --construir-arg GITHUB_REF="$GITHUB_REF" \
    - nombre : Publicar
      correr : |-
        ventana acoplable "$GAR_LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$GITHUB_SHA"
    - nombre : Configurar Personalizar
      correr : |-
        curl -sfLo personalizar https://github.com/kubernetes-sigs/kustomize/releases/download/v3.1.0/kustomize_3.1.0_linux_amd64
        chmod u+x ./personalizar
    - nombre : Implementar
      correr : |-
        ./personalizar editar imagen establecida LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY/IMAGE:TAG=$GAR_LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$GITHUB_SHA
        ./Personalizar compilación. | kubectl aplicar -f -
        Implementación de estado de implementación de kubectl/$DEPLOYMENT_NAME
        kubectl obtener servicios -o ancho
