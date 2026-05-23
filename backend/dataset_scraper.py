import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_sites(urls):
    print("--- DÉBUT DE L'EXTRACTION ---")
    scraped_data = []

    # Création du dossier pour les données
    os.makedirs('knowledge_data', exist_ok=True)

    for url in urls:
        print(f"\nTentative d'extraction depuis : {url}")
        try:
            # Requete HTTP avec un User-Agent pour éviter d'être bloqué
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extraction du titre
            title = soup.title.string.strip() if soup.title else "Sans Titre"
            
            # Extraction du texte (tous les paragraphes pertinents)
            paragraphs = soup.find_all('p')
            text_content = "\n\n".join([p.text.strip() for p in paragraphs if len(p.text.strip()) > 30])
            
            # Extraction des liens d'images
            images = []
            for img in soup.find_all('img'):
                src = img.get('src')
                if src:
                    # Rendre le lien de l'image absolu s'il est relatif
                    images.append(urljoin(url, src))
            
            site_info = {
                "url": url,
                "title": title,
                "text_content": text_content,
                "image_links": list(set(images)) # On supprime les doublons
            }
            
            scraped_data.append(site_info)
            print(f"-> Succès: Titre trouvé '{title}'")
            print(f"-> Info: {len(text_content)} caractères extraits, {len(site_info['image_links'])} images trouvées.")
            
        except Exception as e:
            print(f"-> Erreur lors de l'extraction de {url} : {e}")

    # Sauvegarde dans un fichier JSON
    output_path = 'knowledge_data/all_sites_info.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(scraped_data, f, ensure_ascii=False, indent=4)
        
    print(f"\n--- FIN DE L'EXTRACTION ---")
    print(f"Toutes les informations (Texte, Titres, Liens d'images) ont été sauvegardées dans {output_path}")

if __name__ == "__main__":
    # ---> AJOUTE TES LIENS ICI <---
    # Mets tous les sites que tu veux scraper dans cette liste
    sites_to_scrape = [
        "https://moroccool.com/blog/caftan",
        "https://atlasloom.fr/matieres/"
        # Tu peux rajouter d'autres liens ici en mettant une virgule après les guillemets !
    ]
    
    if not sites_to_scrape:
        print("Veuillez ajouter des URLs dans la liste 'sites_to_scrape' à la ligne 50 avant de lancer le script.")
    else:
        scrape_sites(sites_to_scrape)

