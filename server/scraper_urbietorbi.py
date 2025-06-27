import json
import requests
from bs4 import BeautifulSoup
from transformers import pipeline
import time
from collections import defaultdict

wantedTags = ["ubi", "regiao", "desporto", "cultura", "made-in-ubi", "opiniao", "reportagem"]

aiSummarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# ---------- Funções ----------

def fetchTagPageUrls():
    url = "https://urbietorbi.ubi.pt/page-sitemap.xml"
    resp = requests.get(url)
    soup = BeautifulSoup(resp.content, "xml")
    allUrls = [loc.text for loc in soup.find_all("loc")]

    tags = defaultdict(list)
    for link in allUrls:
        for tag in wantedTags:
            if f"/{tag}/" in link and link not in tags[tag]:
                tags[tag].append(link)
    return tags

def fetchArticlesByTag(tagUrl, limit=5):
    resp = requests.get(tagUrl)
    soup = BeautifulSoup(resp.content, "html.parser")
    articles = []

    articlesHtml = soup.select("article.elementor-post")[:limit]

    for article in articlesHtml:
        try:
            # URL do artigo
            urlTag = article.select_one("a.elementor-post__thumbnail__link")
            url = urlTag["href"]

            # Imagem
            imageTag = article.select_one("img")
            image_url = imageTag["src"] if imageTag else None

            # Título
            articleTitle = article.find("h3", class_="elementor-post__title")
            title = articleTitle.get_text(strip=True) if articleTitle else "Sem título"

            articles.append({
                "url": url,
                "image_url": image_url,
                "title": title,
            })

        except Exception as e:
            print(f"Erro ao processar artigo: {e}")
            continue

    return articles



def generateSummary(text, max_tokens=130):
    if not text or len(text.split()) < 30:
        return "Texto muito curto para gerar um resumo."
    
    try:
        summary = aiSummarizer(text[:1024], max_length=max_tokens, min_length=30, do_sample=False)
        return summary[0]['summary_text']
    except:
        return "Erro ao gerar resumo."


def extractArticleDetails(url, tag):
    try:
        resp = requests.get(url)
        soup = BeautifulSoup(resp.content, "html.parser")

        # Título
        articleTitle = soup.find("h1", class_="elementor-heading-title elementor-size-default")
        title = articleTitle.get_text(strip=True) if articleTitle else "Sem título"

        # Autor(es)
        authors = []
        articleAuthors = soup.find_all("a", rel="author")
        for articleAuthor in articleAuthors:
            authors.append(articleAuthor.get_text(strip=True))
        author = ", ".join(authors) if authors else "Desconhecido"

        # Imagem
        articleImage = soup.find("meta", property="og:image")
        image_url = articleImage["content"] if articleImage else None

        # Corpo do artigo
        content = ""
        divs = soup.find_all("div", class_="elementor-widget-container")

        for div in divs:
            paragraphs = div.find_all("p")
            if len(paragraphs) > 2: 
                content = " ".join(p.get_text(strip=True) for p in paragraphs)
                break


        # Gerar resumo
        summary = generateSummary(content)

        return {
            "title": title,
            "image_url": image_url,
            "author": author,
            "tags": tag,
            "content": content,
            "summary": summary,
            "url": url            
        }

    except Exception as e:
        print(f"Erro em {url}: {e}")
        return None

# ---------- Script Principal ----------

def main():
    print("🔍 A obter links de categorias no sitemap...")
    tags = fetchTagPageUrls()

    extractedArticles = []

    for tag, tagUrls in tags.items():
      for tagUrl in tagUrls:
          print(f"\nCategoria: {tag}")
          articleUrls = fetchArticlesByTag(tagUrl)

          for articleUrl in articleUrls:
              print(f"   ↪ A extrair artigo: {articleUrl['url']}")
              data = extractArticleDetails(articleUrl['url'], tag)
              if data:
                  extractedArticles.append(data)
              time.sleep(1)
        

    with open("articles_urbietorbi.json", "w", encoding="utf-8") as f:
      json.dump(extractedArticles, f, ensure_ascii=False, indent=2)

    print(f"\nExtração concluída! {len(extractedArticles)} artigos guardados.")


if __name__ == "__main__":
    main()
