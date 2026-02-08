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
    """புதிய விக்சனரி பக்கத்திற்கான வடிவம்"""
    return f"""=={{{{மொழி|ta}}}}==

{{{{ஒலிக்கோப்பு-தமிழ்|இந்தியா}}}}

==பொருள்==
{{{{பெயர்ச்சொல்-பகுப்பு|ta}}}}
# {definition}

==மொழிபெயர்ப்புகள்==
{{{{சிறு-மொழி|en}}}}
#

{{{{ஆதாரங்கள்-மொழி|ta}}}}"""

def update_existing_text(old_text, new_definition):
    """ஏற்கனவே உள்ள பக்கத்தில் பொருளை இணைத்தல்"""
    # ஏற்கனவே 'பொருள்' பகுதி இருக்கிறதா என்று பார்த்தல்
    if "==பொருள்==" in old_text:
        # பொருள் பகுதிக்கு கீழே புதிய விளக்கத்தை இணைத்தல்
        updated_text = old_text.replace("==பொருள்==", f"==பொருள்==\n# {new_definition}")
    else:
        # பொருள் பகுதி இல்லையெனில், மொழி வார்ப்புருவிற்கு கீழே சேர்த்தல்
        updated_text = old_text + f"\n\n==பொருள்==\n{{{{பெயர்ச்சொல்-பகுப்பு|ta}}}}\n# {new_definition}"
    return updated_text

def main():
    for page_num in range(start_page, end_page + 1):
        full_page_name = f"{base_page_name}{page_num}"
        print(f"--- ஆய்வு செய்கிறது: {full_page_name} ---")
        
        source_page = pywikibot.Page(source_site, full_page_name)
        if not source_page.exists():
            continue

        lines = source_page.text.split('\n')

        for line in lines:
            line = line.strip()
            if not line or line.startswith('<') or ('-' not in line and '=' not in line):
                continue

            # சொல் மற்றும் பொருளைப் பிரித்தல்
            delimiter = '-' if '-' in line else '='
            parts = line.split(delimiter, 1)
            word = re.sub('<[^<]+?>', '', parts[0]).strip()
            definition = parts[1].strip()

            if not word or len(word) < 2:
                continue

            try:
                wikt_page = pywikibot.Page(wikt_site, word)
                
                if wikt_page.exists():
                    current_content = wikt_page.text
                    
                    # விக்சனரியில் விளக்கம் (definition) ஏற்கனவே உள்ளதா எனச் சரிபார்த்தல்
                    # ஒரு வரியில் '#' தொடங்கி விளக்கம் இருந்தால் அது இருப்பதாகக் கருதப்படும்
                    if "# " in current_content or "#" in current_content:
                        print(f"தவிர்க்கப்பட்டது: '{word}' ஏற்கனவே விளக்கத்துடன் உள்ளது.")
                        continue
                    else:
                        # சொல் உள்ளது ஆனால் விளக்கம் இல்லை எனில் மேம்படுத்துதல்
                        print(f"மேம்படுத்துகிறது: '{word}' (விளக்கம் சேர்க்கப்படுகிறது)")
                        wikt_page.text = update_existing_text(current_content, definition)
                        summary = f"ஏற்கனவே உள்ள சொல்லிற்கு விளக்கம் சேர்க்கப்பட்டது"
                else:
                    # சொல் இல்லையெனில் புதிய பக்கம்
                    print(f"புதிய சொல்: {word}")
                    wikt_page.text = create_wikt_text(word, definition)
                    summary = f"திருக்குறள் சொற்பொருள் சுரபி நூலிலிருந்து உருவாக்கப்பட்டது"

                wikt_page.save(summary=summary, minor=False)
                time.sleep(10)

            except InvalidTitleError:
                continue
            except Exception as e:
                print(f"பிழை: {word} - {e}")

if __name__ == "__main__":
    main()
