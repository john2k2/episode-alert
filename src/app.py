from flask import Flask
from flask_cors import CORS
from flask import jsonify
import subprocess

app = Flask(__name__)
CORS(app, origins='*')


@app.route('/actualizar-capitulos')
def actualizar_capitulos():
    # Ejecuta el script de actualización
    subprocess.run(['python', 'actualizar_capitulos.py'])

    # Devuelve una respuesta al frontend
    return jsonify({'mensaje': 'Actualización completada'})

if __name__ == '__main__':
    app.run(port=3001)

