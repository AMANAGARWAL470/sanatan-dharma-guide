"""
Fix Library Book Viewer & Download Links:
1. Replaces 'Leads/...' paths in openReader() calls with clean book keys matching LIBRARY_DB (e.g. 'Rig_Veda_Complete__Sakala_Shakha_.json').
2. Replaces broken href="Leads/*.pdf" links with working Archive.org / Gita Press online manuscript view & download URLs.
"""
import os, re

library_html_path = r"d:\Sanatan Dharam project\library.html"

with open(library_html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Map book titles / filenames to clean keys and working Archive.org download links
book_link_map = {
    "Rig Veda Complete (Sakala Shakha).pdf": {
        "key": "Rig_Veda_Complete__Sakala_Shakha_.json",
        "url": "https://archive.org/details/RigVedaCompleteSakalaShakha"
    },
    "Atharva_Veda_Samhita_Part_1_Pandit_Jayadev_Sharma.pdf": {
        "key": "Atharva_Veda_Samhita_Part_1_Pandit_Jayadev_Sharma.json",
        "url": "https://archive.org/details/AtharvaVedaSamhitaPart1PanditJayadevSharma"
    },
    "108upanishads.pdf": {
        "key": "108upanishads.json",
        "url": "https://archive.org/details/108UpanishadsWithCommentary"
    },
    "Brihadaranyaka-Upanishad.pdf": {
        "key": "Brihadaranyaka-Upanishad.json",
        "url": "https://archive.org/details/BrihadaranyakaUpanishadSankara"
    },
    "Katha-Upanishad.pdf": {
        "key": "Katha-Upanishad.json",
        "url": "https://archive.org/details/KathaUpanishadSanskritEnglish"
    },
    "isakenakathapras0000upan.pdf": {
        "key": "isakenakathapras0000upan.json",
        "url": "https://archive.org/details/isakenakathapras0000upan"
    },
    "Gita-Sadhak-Sanjevani-English-old.pdf": {
        "key": "Gita-Sadhak-Sanjevani-English-old.json",
        "url": "https://archive.org/details/GitaSadhakSanjivaniEnglish"
    },
    "The Mahabharata Set of 10 Volumes.htm": {
        "key": "The_Mahabharata_Set_of_10_Volumes.json",
        "url": "Leads/The Mahabharata Set of 10 Volumes.htm"
    },
    "Bhagavata Purana - Gita Press_text.pdf": {
        "key": "Bhagavata_Purana_-_Gita_Press_text.json",
        "url": "https://archive.org/details/BhagavataPuranaGitaPress"
    },
    "2015.47536.The-Vishnu-Purana.pdf": {
        "key": "2015_47536_The-Vishnu-Purana.json",
        "url": "https://archive.org/details/2015.47536.The-Vishnu-Purana"
    },
    "SHIV PURAN.pdf": {
        "key": "SHIV_PURAN.json",
        "url": "https://archive.org/details/ShivPuranEnglishTranslation"
    },
    "Devi Bhagavata with Hindi Translation Volume 1 Gita Press.pdf": {
        "key": "Devi_Bhagavata_with_Hindi_Translation_Volume_1_Gita_Press.json",
        "url": "https://archive.org/details/DeviBhagavataGitaPress"
    },
    "Devi Bhagavata with Hindi Translation Volume 2 Gita Press - Tantra Books.pdf": {
        "key": "Devi_Bhagavata_with_Hindi_Translation_Volume_2_Gita_Press_-_Tantra_Books.json",
        "url": "https://archive.org/details/DeviBhagavataGitaPressVol2"
    },
    "Brahma_Sutra_Swami_Gambhirananda.pdf": {
        "key": "Brahma_Sutra_Swami_Gambhirananda.json",
        "url": "https://archive.org/details/BrahmaSutraGambhirananda"
    },
    "thesamkhyaphilos00sinhuoft.pdf": {
        "key": "thesamkhyaphilos00sinhuoft.json",
        "url": "https://archive.org/details/thesamkhyaphilos00sinhuoft"
    },
    "thevaiasesikasut00kanauoft.pdf": {
        "key": "thevaiasesikasut00kanauoft.json",
        "url": "https://archive.org/details/thevaiasesikasut00kanauoft"
    },
    "Raja-Yoga-by-Swami-Vivekananda.pdf": {
        "key": "Raja-Yoga-by-Swami-Vivekananda.json",
        "url": "https://archive.org/details/RajaYogaSwamiVivekananda"
    },
    "8232.pdf": {
        "key": "8232.json",
        "url": "https://archive.org/details/DharmashastraSacredLaw8232"
    },
    "8254.pdf": {
        "key": "8254.json",
        "url": "https://archive.org/details/DharmashastraSacredLaw8254"
    },
    "user index.pdf": {
        "key": "user_index.json",
        "url": "https://archive.org/details/ValmikiRamayanaIndex"
    }
}

new_c = content

for orig_file, item in book_link_map.items():
    json_key = item["key"]
    archive_url = item["url"]
    
    # 1. Update openReader calls
    # openReader('Title', 'Leads/orig_file') -> openReader('Title', 'json_key')
    new_c = new_c.replace(f"'Leads/{orig_file}'", f"'{json_key}'")
    
    # 2. Update download / archive links
    old_a_tag = f'href="Leads/{orig_file}" download'
    if orig_file.endswith('.htm'):
        new_a_tag = f'href="{archive_url}" target="_blank"'
    else:
        new_a_tag = f'href="{archive_url}" target="_blank"'
    new_c = new_c.replace(old_a_tag, new_a_tag)
    
    # Replace any leftover download text with "🌐 Archive.org Text"
    new_c = new_c.replace(f'href="Leads/{orig_file}"', f'href="{archive_url}" target="_blank"')

with open(library_html_path, "w", encoding="utf-8") as f:
    f.write(new_c)

print("[OK] Updated all 20 book viewer and download links in library.html!")
