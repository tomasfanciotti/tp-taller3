BuildTp(){

    if [ "$1" != "" ]; then
      docker build -f ./$1/Dockerfile -t "taller3-$1" ./$1

    else
        docker build -f ./mascotas/Dockerfile -t "taller3-mascotas" ./mascotas
        docker build -f ./tratamientos/Dockerfile.prod -t "taller3-tratamientos" ./tratamientos
        docker build -f ./usuarios/Dockerfile -t "taller3-usuarios" ./usuarios
        docker build -f ./front/Dockerfile -t "taller3-front" ./front
        docker build -f ./notificaciones/Dockerfile -t "taller3-notificaciones" ./notificaciones
        # docker build -f ./telegram/Dockerfile -t "taller3-telegram" ./telegram
    fi
}

StopTp(){

    docker-compose -f "./mascotas/docker-compose.yml" stop -t 5
    docker-compose -f "./tratamientos/docker-compose.yml" stop -t 5
    docker-compose -f "./usuarios/docker-compose.yml" stop -t 5
    docker-compose -f "./front/docker-compose.yml" stop -t 5
    docker-compose -f "./notificaciones/docker-compose.yml" stop -t 5

   if [ "$1" == "-k" ]; then
       FLAGS='--remove-orphans'
       docker-compose -f "./mascotas/docker-compose.yml" down -t 5 $FLAGS
       docker-compose -f "./tratamientos/docker-compose.yml" down -t 5 $FLAGS
       docker-compose -f "./usuarios/docker-compose.yml" down -t 5 $FLAGS
       docker-compose -f "./front/docker-compose.yml" down -t 5 $FLAGS
       docker-compose -f "./notificaciones/docker-compose.yml" down -t 5 $FLAGS
  fi
}

RunTp(){
    if [ "$1" == "logs" ]; then
        # Show logs
        docker-compose -f "$2/docker-compose.yml" logs -f
    else
        # Docker Compose Up
        docker-compose -f "./front/docker-compose.yml" up -d
        docker-compose -f "./mascotas/docker-compose.yml" up -d
        docker-compose -f "./tratamientos/docker-compose.yml" up -d
        docker-compose -f "./usuarios/docker-compose.yml" up -d
        docker-compose -f "./notificaciones/docker-compose.yml" up -d
    fi
}

if [ "$1" == "build" ]; then
    shift
    BuildTp "$@"

elif [ "$1" == "run" ]; then
    shift
    RunTp "$@"

elif [ "$1" == "stop" ]; then
    shift
    StopTp "$@"

elif [ "$1" == "help" ]; then
    echo ""
    echo "  - run [logs]         Inicia la arquitectura definida en 'composer.py'"
    echo "                           logs: Muestra los logs"
    echo ""
    echo "  - stop [-k]          Detiene los contenedores corriendo"
    echo "                           -k: elimina los contenedores"
    echo ""

else
    echo "Comando desconocido.."
    echo "Prueba con $0 help"
fi