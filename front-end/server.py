import logging
import os
from livereload import Server

logging.basicConfig(level=logging.DEBUG)

# Ruta al directorio raíz de tu proyecto
root_path = os.path.join(os.path.dirname(__file__), '..')

# Crear servidor
server = Server()

# Vigilar todos los archivos del directorio para recarga automática
server.watch(root_path + r'\**\*')

# Servir el proyecto desde la carpeta raíz
server.serve(host='0.0.0.0', port=8080, root=root_path, default_filename='index.html')