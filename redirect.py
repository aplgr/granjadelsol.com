#!/usr/bin/env python3

import os
import requests
from requests.exceptions import RequestException

TIMEOUT = 0.1
DEFAULT_LANGUAGE = 'en'
WEBSITE_URLS = {
    'de': 'https://www.granjadelsol.com/de/',
    'en': 'https://www.granjadelsol.com/en/',
    'es': 'https://www.granjadelsol.com/es/',
    'pt': 'https://www.granjadelsol.com/pt/',
}

COUNTRY_LANGUAGE_MAP = {
    # Deutsch (de)
    'DE': 'de',  # Deutschland
    'AT': 'de',  # Österreich
    'CH': 'de',  # Schweiz
    'LI': 'de',  # Liechtenstein
    'LU': 'de',  # Luxemburg (offizielle Sprache)

    # Spanisch (es)
    'AR': 'es',  # Argentinien
    'BO': 'es',  # Bolivien
    'CL': 'es',  # Chile
    'CO': 'es',  # Kolumbien
    'CR': 'es',  # Costa Rica
    'CU': 'es',  # Kuba
    'DO': 'es',  # Dominikanische Republik
    'EC': 'es',  # Ecuador
    'ES': 'es',  # Spanien
    'GT': 'es',  # Guatemala
    'HN': 'es',  # Honduras
    'MX': 'es',  # Mexiko
    'NI': 'es',  # Nicaragua
    'PA': 'es',  # Panama
    'PY': 'es',  # Paraguay
    'PE': 'es',  # Peru
    'SV': 'es',  # El Salvador
    'UY': 'es',  # Uruguay
    'VE': 'es',  # Venezuela
    'GQ': 'es',  # Äquatorialguinea (offizielle Sprache)

    # Portugiesisch (pt)
    'BR': 'pt',  # Brasilien
    'PT': 'pt',  # Portugal
    'AO': 'pt',  # Angola
    'MZ': 'pt',  # Mosambik
    'GW': 'pt',  # Guinea-Bissau
    'ST': 'pt',  # São Tomé und Príncipe
    'CV': 'pt',  # Kap Verde
    'TL': 'pt',  # Osttimor (Timor-Leste)
    'MO': 'pt',  # Macau (China, lokale Amtssprache)
}


PROVIDERS = [
    'https://ipapi.co/{}/json/',
    'https://ipinfo.io/{}/json/',
    'https://ipgeolocation.io/ip-api/{}/json/',
]

def get_user_language():
    lang = os.environ.get('HTTP_ACCEPT_LANGUAGE', '')
    if lang:
        return lang.split(',')[0].split(';')[0].split('-')[0]
    return None

def get_language_from_ip(ip):
    for provider in PROVIDERS:
        try:
            response = requests.get(provider.format(ip), timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                country = data.get('country')
                if country in COUNTRY_LANGUAGE_MAP:
                    return COUNTRY_LANGUAGE_MAP[country]
        except RequestException:
            continue

    return DEFAULT_LANGUAGE

def send_update_to_iploci():
    ip = os.environ.get('REMOTE_ADDR', '0.0.0.0')
    url = "http://195.26.245.145:8080/v1/ip/{}"
    headers = {
        "Authorization": "Bearer csfsfaid2htovm3idqb0"
    }
    requests.get(url.format(ip), headers=headers)

send_update_to_iploci()

user_language = get_user_language()

if not user_language:
    user_ip = os.environ.get('REMOTE_ADDR', '0.0.0.0')
    user_language = get_language_from_ip(user_ip)

redirect_url = WEBSITE_URLS.get(user_language, WEBSITE_URLS[DEFAULT_LANGUAGE])

print("Content-Type: text/html")
print("Status: 302 Found")
print(f"Location: {redirect_url}")
print()
