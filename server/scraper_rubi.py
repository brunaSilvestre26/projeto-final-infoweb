import requests
from bs4 import BeautifulSoup
from transformers import pipeline
import json

# Pipeline de sumarização com IA
# aiSummarizer = pipeline("summarization", model="facebook/bart-large-cnn")

""" def gerar_resumo(texto, max_tokens=130):
    if not texto or len(texto.split()) < 30:
        return texto
    try:
        resumo = aiSummarizer(texto[:1024], max_length=max_tokens, min_length=30, do_sample=False)
        return resumo[0]['summary_text']
    except Exception as e:
        return f"Erro ao gerar resumo: {str(e)}" """

def fetchMostRecentUrls(sitemap_url, limite=8):
    resp = requests.get(sitemap_url)
    soup = BeautifulSoup(resp.content, "xml")
    links = [loc.text for loc in soup.find_all("loc")]
    return links[::-1][:limite]

def extractArticleDetails(url):
    try:
        resp = requests.get(url)
        soup = BeautifulSoup(resp.content, "html.parser")

        # Título no h2.blog-arc-heading
        titleH2 = soup.find("h2", class_="blog-arc-heading")
        title = titleH2.get_text(strip=True) if titleH2 else "Sem título"

        # Autor(es)
        authorParagraph = soup.find("p", class_="blog-user")
        author = authorParagraph.get_text(strip=True) if authorParagraph else "Desconhecido"

        # Imagem (open graph)
        imageDiv = soup.find("div", class_="blog-arc-cover")
        image_url = ""

        if imageDiv:
            imgElement = imageDiv.find("img")
            if imgElement and imgElement.has_attr("src"):
                image_url = imgElement["src"]

        # content: apenas <p> que são filhos diretos da div com classe "single-col"
        singleColDiv = soup.find("div", class_="single-col")
        if singleColDiv:
            # Encontra apenas os <p> que são filhos diretos
            paragraphs = singleColDiv.find_all("p", recursive=False)
            content = " ".join(p.get_text(strip=True) for p in paragraphs)
        else:
            content = ""

        # Resumo com IA
        # resumo = gerar_resumo(content)
        
        if len(content) > 200:
            summaryTemp = content[:200]
            # Procura o próximo espaço após os 200 caracteres
            nextSpace = content[200:].find(" ")
            if nextSpace != -1:
                summary = content[:200 + nextSpace].rstrip() + "..."
            else:
                summary = summaryTemp.rstrip() + "..."
        else:
            summary = content

        return {
            "title": title,
            "url": url,
            "image_url": image_url,
            "author": author,
            "content": content,
            "summary": summary
        }

    except Exception as e:
        print(f"Erro ao extrair {url}: {e}")
        return None

# ---------- Script Principal ----------

def main():
    sitemap_url = "https://rubi.ubi.pt/wp-sitemap-posts-post-1.xml"
    urls = fetchMostRecentUrls(sitemap_url)

    artigos = []

    print(f"A extrair {len(urls)} artigos mais recentes...\n")

    for url in urls:
        print(f"   ↪ {url}")
        artigo = extractArticleDetails(url)
        if artigo:
            artigos.append(artigo)

    # Guardar em JSON
    with open("articles_rubi.json", "w", encoding="utf-8") as f:
        json.dump(artigos, f, ensure_ascii=False, indent=2)

    print(f"\nFicheiro 'articles_rubi.json' criado com {len(artigos)} artigos.")

if __name__ == "__main__":
    main()
