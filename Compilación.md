
nombre : Compilación e implementación para G•PH

en :
  empujar :
    ramas : [ "principal" ]

# Variables de entorno disponibles para todos los trabajos y pasos en este flujo de trabajo.
env :
  REGION_ID : cn-hangzhou
  REGISTRO : Registry.cn-hangzhou.aliyuncs.com
  ESPACIO DE NOMBRES : espacio de nombres
  IMAGEN : repositorio
  ETIQUETA : ${{github.sha}}
  ACK_CLUSTER_ID : ID de clúster
  ACK_DEPLOYMENT_NAME : implementación de nginx

  ACR_EE_REGISTRY : myregistry.cn-hangzhou.cr.aliyuncs.com
  ACR_EE_INSTANCE_ID : ID de instancia
  ACR_EE_NAMESPACE : espacio de nombres
  ACR_EE_IMAGE : repositorio
  ACR_EE_TAG : ${{github.sha}}

permisos :
  contenido : leer

trabajos :
  construir :
    se ejecuta en : ubuntu-latest
    medio ambiente : producción

    pasos :
    - nombre : Caja
      usos : acciones/checkout@v3

    # 1.1 Iniciar sesión en ACR
    - nombre : inicie sesión en ACR con el par AccessKey
      usos : aliyun/acr-login@v1
      con :
        id-región : " ${{ env.REGION_ID }} "
        id-clave-de-acceso : " ${{ secretos.ACCESS_KEY_ID }} "
        acceso-clave-secreto : " ${{ secretos.ACCESS_KEY_SECRET }} "

    # 1.2 Crear y enviar imagen a ACR
    - nombre : compilar y enviar la imagen a ACR
      ejecutar : |
        docker build --tag "$REGISTRO/$ESPACIO DE NOMBRES/$IMAGEN:$ETIQUETA" .
        docker push "$REGISTRO/$ESPACIO DE NOMBRES/$IMAGEN:$ETIQUETA"
    # 1.3 Escanear imagen en ACR
    - nombre : escanear imagen en ACR
      usos : aliyun/acr-scan@v1
      con :
        id-región : " ${{ env.REGION_ID }} "
        id-clave-de-acceso : " ${{ secretos.ACCESS_KEY_ID }} "
        acceso-clave-secreto : " ${{ secretos.ACCESS_KEY_SECRET }} "
        repositorio : " ${{ env.NAMESPACE }}/${{ env.IMAGE }} "
        etiqueta : " ${{ env.TAG }} "

    # 2.1 (Opcional) Iniciar sesión en ACR EE
    - usos : acciones/checkout@v3
    - nombre : Inicie sesión en ACR EE con el par AccessKey
      usos : aliyun/acr-login@v1
      con :
        servidor de inicio de sesión : " https://${{ env.ACR_EE_REGISTRY }} "
        id-región : " ${{ env.REGION_ID }} "
        id-clave-de-acceso : " ${{ secretos.ACCESS_KEY_ID }} "
        acceso-clave-secreto : " ${{ secretos.ACCESS_KEY_SECRET }} "
        ID de instancia : " ${{ env.ACR_EE_INSTANCE_ID }} "

    # 2.2 (Opcional) Crear y enviar imagen ACR EE
    - nombre : compilar y enviar la imagen a ACR EE
      ejecutar : |
        docker build -t "$ACR_EE_REGISTRY/$ACR_EE_NAMESPACE/$ACR_EE_IMAGE:$TAG" .
        ventana acoplable "$ACR_EE_REGISTRY/$ACR_EE_NAMESPACE/$ACR_EE_IMAGE:$TAG"
    # 2.3 (Opcional) Escanear imagen en ACR EE
    - nombre : escanear imagen en ACR EE
      usos : aliyun/acr-scan@v1
      con :
        id-región : " ${{ env.REGION_ID }} "
        id-clave-de-acceso : " ${{ secretos.ACCESS_KEY_ID }} "
        acceso-clave-secreto : " ${{ secretos.ACCESS_KEY_SECRET }} "
        ID de instancia : " ${{ env.ACR_EE_INSTANCE_ID }} "
        repositorio : " ${{ env.ACR_EE_NAMESPACE}}/${{ env.ACR_EE_IMAGE }} "
        etiqueta : " ${{ env.ACR_EE_TAG }} "

    # 3.1 Establecer contexto ACK
    - nombre : Establecer contexto K8s
      usos : aliyun/ack-set-context@v1
      con :
        id-clave-de-acceso : " ${{ secretos.ACCESS_KEY_ID }} "
        acceso-clave-secreto : " ${{ secretos.ACCESS_KEY_SECRET }} "
        ID de clúster : " ${{ env.ACK_CLUSTER_ID }} "

    # 3.2 Implementar la imagen en el clúster ACK
    - nombre : Configurar Personalizar
      correr : |-
        curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash /dev/stdin 3.8.6
    - nombre : Implementar
      correr : |-
        ./personalizar editar establecer imagen REGISTRO/ESPACIO DE NOMBRES/IMAGEN:TAG=$REGISTRO/$ESPACIO DE NOMBRES/$IMAGEN:$ETIQUETA
        ./Personalizar compilación. | kubectl aplicar -f -
        implementación de estado de implementación de kubectl/$ACK_DEPLOYMENT_NAME
        kubectl obtener servicios -o ancho
