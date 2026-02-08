import requests
import csv

def get_wikidata_translations(word_en):
    url = "https://www.wikidata.org/w/api.php"

    # Define a User-Agent header
    headers = {
        'User-Agent': 'ColabWikidataBot/1.0 (your_email@example.com)' # Replace with your actual email or identifier
    }

    # 1. ஆங்கிலச் சொல்லிற்கான Wikidata ID-யைத் தேடுதல்
    search_params = {
        "action": "wbsearchentities",
        "language": "en",
        "format": "json",
        "search": word_en
    }

    try:
        response = requests.get(url, params=search_params, headers=headers)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        response_json = response.json() # Attempt to parse JSON

        if not response_json.get('search'):
            return None

        entity_id = response_json['search'][0]['id']

        # 2. குறிப்பிட்ட மொழிகளின் லேபிள்கள் மற்றும் படத்தைப் பெறுதல்
        data_params = {
            "action": "wbgetentities",
            "ids": entity_id,
            "format": "json",
            "props": "labels|claims"
        }

        data_response = requests.get(url, params=data_params, headers=headers)
        data_response.raise_for_status()
        data = data_response.json()

        entity = data['entities'][entity_id]
        labels = entity.get('labels', {})
        claims = entity.get('claims', {})

        # படத்தைப் பெறுதல் (P18)
        image_name = "No Image Found"
        if 'P18' in claims:
            image_name = claims['P18'][0]['mainsnak']['datavalue']['value']
            image_name = f"File:{image_name}"

        # தரவுகளைத் தொகுத்தல்
        return {
            "English": word_en,
            "Image": image_name,
            "Tamil": labels.get('ta', {}).get('value', 'N/A'),
            "Telugu": labels.get('te', {}).get('value', 'N/A'),
            "Kannada": labels.get('kn', {}).get('value', 'N/A'),
            "Malayalam": labels.get('ml', {}).get('value', 'N/A'),
            "Hindi": labels.get('hi', {}).get('value', 'N/A'),
            "Malay": labels.get('ms', {}).get('value', 'N/A')
        }
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error for {word_en}: {errh}")
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text}")
        return None
    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connecting for {word_en}: {errc}")
        return None
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error for {word_en}: {errt}")
        return None
    except requests.exceptions.RequestException as err:
        print(f"Something went wrong with the request for {word_en}: {err}")
        return None
    except ValueError as json_err: # Catches json.JSONDecodeError
        print(f"JSON Decode Error for {word_en}: {json_err}")
        print(f"Problematic response status code: {response.status_code}")
        print(f"Problematic response text: {response.text}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred for {word_en}: {e}")
        return None

# தேட வேண்டிய சொற்களின் பட்டியல்
search_words = ["mother", "father", "brother", "sister", "friend", "boy", "girl", "man", "woman", "child", "house"]

results = []
print("தரவுகள் சேகரிக்கப்படுகின்றன...")

for word in search_words:
    data = get_wikidata_translations(word)
    if data:
        results.append(data)
        print(f"முடிந்தது: {word}")

# CSV கோப்பாகச் சேமித்தல்
csv_columns = ["English", "Image", "Tamil", "Telugu", "Kannada", "Malayalam", "Hindi", "Malay"]
csv_file = "wiki_translations.csv"

try:
    with open(csv_file, 'w', newline='', encoding='utf-8-sig') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in results:
            writer.writerow(data)
    print(f"\nவெற்றி! தரவுகள் '{csv_file}' என்ற கோப்பில் சேமிக்கப்பட்டுள்ளன.")
except IOError:
    print("கோப்பை உருவாக்குவதில் பிழை ஏற்பட்டது.")
