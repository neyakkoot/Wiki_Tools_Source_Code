import pywikibot
import re
import time
from pywikibot.exceptions import InvalidTitleError

# தளங்களை வரையறுத்தல்
source_site = pywikibot.Site('ta', 'wikisource')
wikt_site = pywikibot.Site('ta', 'wiktionary')

# பக்கங்களின் வரம்பு
start_page = 116
end_page = 125
base_page_name = "பக்கம்:திருக்குறள்_சொற்பொருள்_சுரபி.pdf/"

def create_wikt_text(word, definition):
    template = f"""=={{{{மொழி|ta}}}}==

{{{{ஒலிக்கோப்பு-தமிழ்|இந்தியா}}}}

==பொருள்==
{{{{பெயர்ச்சொல்-பகுப்பு|ta}}}}
# {definition}

==மொழிபெயர்ப்புகள்==
{{{{சிறு-மொழி|en}}}}
#

{{{{ஆதாரங்கள்-மொழி|ta}}}}"""
    return template

def main():
    for page_num in range(start_page, end_page + 1):
        full_page_name = f"{base_page_name}{page_num}"
        print(f"--- ஆய்வு செய்கிறது: {full_page_name} ---")
        
        source_page = pywikibot.Page(source_site, full_page_name)
        if not source_page.exists():
            print(f"பக்கம் காணப்படவில்லை: {full_page_name}")
            continue

        text = source_page.text
        lines = text.split('\n')

        for line in lines:
            line = line.strip()
            
            # 1. வரி காலியாக இருந்தால் தவிர்க்கவும்
            # 2. வரி '<' இல் தொடங்கினால் (Header/Footer tags) தவிர்க்கவும்
            # 3. வரியில் '=' இல்லையெனில் தவிர்க்கவும்
            if not line or line.startswith('<') or '=' not in line:
                continue

            # '=' இக்குறியீட்டிற்கு முன்பு உள்ளதை சொல்லாக எடுத்தல்
            parts = line.split('=', 1)
            word = parts[0].strip()
            
            # HTML tags (எ.கா <b>) இருந்தால் நீக்குதல்
            word = re.sub('<[^<]+?>', '', word).strip()
            definition = parts[1].strip()

            if not word:
                continue

            try:
                # விக்சனரியில் சொல் இருக்கிறதா என்று சரிபார்த்தல்
                wikt_page = pywikibot.Page(wikt_site, word)
                
                if wikt_page.exists():
                    print(f"தவிர்க்கப்பட்டது: '{word}' ஏற்கனவே விக்சனரியில் உள்ளது.")
                    continue
                else:
                    print(f"புதிய சொல் கண்டறியப்பட்டது: {word}")
                    wikt_page.text = create_wikt_text(word, definition)
                    
                    summary = f"திருக்குறள் சொற்பொருள் சுரபி நூலிலிருந்து உருவாக்கப்பட்டது"
                    wikt_page.save(summary=summary, minor=False)
                    print(f"வெற்றி: '{word}' விக்சனரியில் சேர்க்கப்பட்டது.")
                    time.sleep(60) 

            except InvalidTitleError:
                print(f"தவறான தலைப்பு தவிர்க்கப்பட்டது: {word}")
                continue
            except Exception as e:
                print(f"பிழை: {word} - {e}")

if __name__ == "__main__":
    main()
