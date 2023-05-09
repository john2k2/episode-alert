import json
import re
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin


# Define las URLs que deseas procesar
urls = [
    'https://www.leercapitulo.com/manga/d2qhr5/oshi-no-ko/',
    'https://www.leercapitulo.com/manga/5q8ord/boku-no-kokoro-no-yabai-yatsu/',
    'https://www.leercapitulo.com/manga/jo6v1s5/yofukashi-no-uta/',
    'https://www.leercapitulo.com/manga/cgvafh/kanojo-okarishimasu/',
    'https://www.leercapitulo.com/manga/7im0lu/chainsaw-man/',
    'https://www.leercapitulo.com/manga/gcoisn/kage-no-jitsuryokusha-ni-naritakute/',
    'https://www.leercapitulo.com/manga/cco8900/black-clover/',
]

def limpiar_texto(texto):
    """Limpia el texto eliminando los símbolos no deseados"""
    texto_limpio = re.sub(r'[^\w\s]', '', texto)
    return texto_limpio.strip()

# Carga los datos existentes del archivo JSON, si existe
try:
    with open('resultados.json', 'r') as archivo:
        capitulos = json.load(archivo)
except FileNotFoundError:
    capitulos = []

# Obtén el último id existente en la lista de capitulos
ultimo_id = max([c['id'] for c in capitulos]) if capitulos else 0

# Itera sobre las URLs
for url in urls:
    response = requests.get(url)
    if response.status_code == 200:
        # Parsea el contenido HTML de la respuesta
        soup = BeautifulSoup(response.content, 'html.parser')

        # Encuentra los elementos HTML que contienen los capítulos
        chapters = soup.find_all('li', class_='row')
        titulo = soup.find_all('h1')
        imagen = soup.find_all('div', class_='media-left cover-detail')

        # Obtén la URL base de la página actual
        base_url = response.url

        # Procesa los capítulos encontrados
        for chapter in chapters[:2]:
            nombre_cap = limpiar_texto(chapter.find('h4').text)
            link = urljoin(base_url, chapter.find('a')['href'])
            nombre = limpiar_texto(titulo[0].text)
            imagen_url = urljoin(base_url,imagen[0].find('img')['src'])

            # Verifica si el capítulo ya existe en la lista de capitulos y si existe no agregar de nuevo
            existente = next((c for c in capitulos if c['nombre_capitulo'] == nombre_cap and c['nombre'] == nombre), None)
            if existente:
                continue  # Salta al siguiente capítulo si ya existe

            # Incrementa el id para el nuevo capítulo
            ultimo_id += 1

            # Si el capítulo es nuevo, marca su estado como no leído
            capitulo = {
                'id': ultimo_id,
                'nombre_capitulo': nombre_cap,
                'imagen_url': imagen_url,
                'link': link,
                'nombre': nombre,
                'leido': False
            }

            # Agrega el diccionario a la lista de capítulos
            capitulos.append(capitulo)

    else:
        print(f'Error al realizar la solicitud HTTP a la URL: {url}')


# Guarda los datos en el archivo JSON
with open('resultados.json', 'w') as archivo:
    json.dump(capitulos, archivo, indent=4)

print('Resultados guardados en resultados.json')

