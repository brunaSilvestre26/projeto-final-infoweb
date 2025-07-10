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

def obter_urls_mais_recentes(sitemap_url, limite=8):
    resp = requests.get(sitemap_url)
    soup = BeautifulSoup(resp.content, "xml")
    links = [loc.text for loc in soup.find_all("loc")]
    return links[::-1][:limite]

def extrair_detalhes_artigo(url):
    try:
        resp = requests.get(url)
        soup = BeautifulSoup(resp.content, "html.parser")

        # Título no h2.blog-arc-heading
        titulo_tag = soup.find("h2", class_="blog-arc-heading")
        titulo = titulo_tag.get_text(strip=True) if titulo_tag else "Sem título"

        # Autor(es)
        autor_tag = soup.find("p", class_="blog-user")
        autor = autor_tag.get_text(strip=True) if autor_tag else "Desconhecido"

        # Imagem (open graph)
        imagem_div = soup.find("div", class_="blog-arc-cover")
        imagem_url = ""

        if imagem_div:
            img_tag = imagem_div.find("img")
            if img_tag and img_tag.has_attr("src"):
                imagem_url = img_tag["src"]

        # Corpo: apenas <p> que são filhos diretos da div com classe "single-col"
        single_col_div = soup.find("div", class_="single-col")
        if single_col_div:
            # Encontra apenas os <p> que são filhos diretos
            paragrafos = single_col_div.find_all("p", recursive=False)
            corpo = " ".join(p.get_text(strip=True) for p in paragrafos)
        else:
            corpo = ""

        # Resumo com IA
        # resumo = gerar_resumo(corpo)
        
        if len(corpo) > 200:
            resumo_temp = corpo[:200]
            # Procura o próximo espaço após os 200 caracteres
            prox_espaco = corpo[200:].find(" ")
            if prox_espaco != -1:
                resumo = corpo[:200 + prox_espaco].rstrip() + "..."
            else:
                resumo = resumo_temp.rstrip() + "..."
        else:
            resumo = corpo

        return {
            "title": titulo,
            "url": url,
            "image_url": imagem_url,
            "author": autor,
            "content": corpo,
            "summary": resumo
        }

    except Exception as e:
        print(f"Erro ao extrair {url}: {e}")
        return None

# ---------- Script Principal ----------

def main():
    sitemap_url = "https://rubi.ubi.pt/wp-sitemap-posts-post-1.xml"
    urls = obter_urls_mais_recentes(sitemap_url)

    artigos = []

    print(f"A extrair {len(urls)} artigos mais recentes...\n")

    for url in urls:
        print(f"   ↪ {url}")
        artigo = extrair_detalhes_artigo(url)
        if artigo:
            artigos.append(artigo)

    # Guardar em JSON
    with open("articles_rubi.json", "w", encoding="utf-8") as f:
        json.dump(artigos, f, ensure_ascii=False, indent=2)

    print(f"\nFicheiro 'articles_rubi.json' criado com {len(artigos)} artigos.")

if __name__ == "__main__":
    main()
