import requests
from bs4 import BeautifulSoup
from transformers import pipeline
import json
import re

# Pipeline de sumarização com IA
# resumidor = pipeline("summarization", model="facebook/bart-large-cnn")

""" def gerar_resumo(texto, max_tokens=130):
    if not texto or len(texto.split()) < 10: 
        return "Texto muito curto para gerar um resumo."
    try:
        input_length = len(texto.split())
        ajustado_max = min(max_tokens, int(input_length * 0.9))
        resumo = resumidor(
            texto[:1024],
            max_length=ajustado_max,
            min_length=15, 
            do_sample=False
        )
        return resumo[0]['summary_text']
    except Exception as e:
        return f"Erro ao gerar resumo: {str(e)}" """
    
def fetchMostRecentUrls(sitemap_url, limite=8):
    resp = requests.get(sitemap_url)
    soup = BeautifulSoup(resp.content, "xml")
    links = [loc.text for loc in soup.find_all("loc")]
    return links[-limite:]  # Pega os últimos N links (mais recentes)


def extractTubiArticleDetails(url):
    try:
        resp = requests.get(url)
        soup = BeautifulSoup(resp.content, "html.parser")

        # Título
        headerDiv = soup.find("div", class_="entry-header")
        titleH1 = headerDiv.find("h1", class_="entry-title") if headerDiv else None
        title = titleH1.get_text(strip=True) if titleH1 else "Sem título"

        # tags
        tags = []
        if headerDiv:
            tags = [span.get_text(strip=True) for span in headerDiv.find_all("span", class_="entry-category")]

        # Corpo do conteúdo - múltiplos métodos de extração
        content = ""
        
        # Método 1: Tenta a classe original
        contentDiv = soup.find("div", class_="entry-content-single")
        if contentDiv:
            paragraphs = contentDiv.find_all("p")
            content = " ".join(p.get_text(strip=True) for p in paragraphs)
        
        # Método 2: Se não encontrou conteúdo suficiente, tenta outras classes
        if not content or len(content) < 50:
            # Tenta outras classes possíveis
            for className in ["entry-content", "vlog-content", "post-content"]:
                contentDiv = soup.find("div", class_=className)
                if contentDiv:
                    paragraphs = contentDiv.find_all(["p", "div"])
                    texts = []
                    for p in paragraphs:
                        text = p.get_text(strip=True)
                        if text and len(text) > 20 and not text.startswith("http"):
                            texts.append(text)
                    if texts:
                        content = " ".join(texts)
                        break
        
        # Método 3: Fallback - procura por texto que contenha palavras-chave do artigo
        if not content or len(content) < 50:
            allText = soup.get_text()
            # Procura por frases que contenham palavras do título
            titleKeywords = title.lower().split()[:3]  # Primeiras 3 palavras do título
            sentences = allText.split('.')
            relevantSentences = []
            for sentence in sentences:
                if any(keyword in sentence.lower() for keyword in titleKeywords) and len(sentence.strip()) > 30:
                    relevantSentences.append(sentence.strip())
                    if len(' '.join(relevantSentences)) > 200:  
                        break
            if relevantSentences:
                content = ' '.join(relevantSentences)
        
        print(f"Corpo extraído: {len(content)} caracteres")

        # Resumo com IA
        # resumo = gerar_resumo(corpo)

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

        # Vídeo
        videoThumbnail = ""
        videoUrl = ""
        
        # Tenta encontrar o iframe do YouTube de várias formas
        iframe = None
        
        # Método 1: Procura na div com classe específica
        videoDiv = soup.find("div", class_="fluid-width-video-wrapper")
        if videoDiv:
            iframe = videoDiv.find("iframe")
        
        # Método 2: Procura diretamente por iframe do YouTube
        if not iframe:
            iframe = soup.find("iframe", src=re.compile(r"youtube\.com"))
        
        # Método 3: Procura qualquer iframe
        if not iframe:
            allIframes = soup.find_all("iframe")
            for frameTemp in allIframes:
                if frameTemp.has_attr("src") and "youtube" in frameTemp["src"]:
                    iframe = frameTemp
                    break
        
        if iframe and iframe.has_attr("src"):
            videoUrl = iframe["src"]
            print(f"Vídeo encontrado: {videoUrl}")
            
            # Extrai o ID do vídeo do YouTube
            match = re.search(r"youtube\.com/embed/([^?&]+)", videoUrl)
            if match:
                videoId = match.group(1)
                videoThumbnail = f"https://img.youtube.com/vi/{videoId}/hqdefault.jpg"
                print(f"Imagem de capa: {videoThumbnail}")
            else:
                print(f"Não foi possível extrair o ID do vídeo do YouTube")
        else:
            print(f"Nenhum iframe de vídeo encontrado")

        # Se não encontrou imagem de vídeo, usa uma imagem padrão
        if not videoThumbnail:
            videoThumbnail = "https://tubi.ubi.pt/wp-content/uploads/2017/06/tubi_logo-1.png"
            print(f"Usando imagem padrão: {videoThumbnail}")        

        return {
            "title": title,
            "url": url,
            "tags": tags,
            "image_url": videoThumbnail,
            "video_url": videoUrl,
            "content": content,
            "summary": summary
        }

    except Exception as e:
        print(f"Erro ao extrair {url}: {e}")
        return None

# ----------- Script Principal -----------

def main():
    sitemap_url = "https://tubi.ubi.pt/wp-sitemap-posts-post-1.xml"
    urls = fetchMostRecentUrls(sitemap_url)

    artigos = []

    print(f"A extrair {len(urls)} artigos mais recentes do TUBI...\n")

    for url in urls:
        print(f"   ↪ {url}")
        artigo = extractTubiArticleDetails(url)
        if artigo:
            artigos.append(artigo)

    with open("articles_tubi.json", "w", encoding="utf-8") as f:
        json.dump(artigos, f, ensure_ascii=False, indent=2)

    print(f"\nFicheiro 'articles_tubi.json' criado com {len(artigos)} artigos.")

if __name__ == "__main__":
    main()
