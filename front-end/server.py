import logging
from livereload import Server

logging.basicConfig(level=logging.DEBUG)

# Ruta al directorio raíz de tu proyecto
root_path = r"C:\Users\Yony\Desktop\TrabajosConPipe\5_Pa_Las_Doce_V3\5PaLasDoce\front-end"

# Crear servidor
server = Server()

# Vigilar todos los archivos del directorio para recarga automática
server.watch(root_path + r'\**\*')

# Servir el proyecto desde la carpeta raíz
server.serve(host='0.0.0.0', port=8080, root=root_path, default_filename='index.html')