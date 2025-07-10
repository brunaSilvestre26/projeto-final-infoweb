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
    
def obter_urls_mais_recentes(sitemap_url, limite=8):
    resp = requests.get(sitemap_url)
    soup = BeautifulSoup(resp.content, "xml")
    links = [loc.text for loc in soup.find_all("loc")]
    return links[-limite:]  # Pega os últimos N links (mais recentes)


def extrair_detalhes_artigo_tubi(url):
    try:
        resp = requests.get(url)
        soup = BeautifulSoup(resp.content, "html.parser")

        # Título
        header_div = soup.find("div", class_="entry-header")
        titulo_tag = header_div.find("h1", class_="entry-title") if header_div else None
        titulo = titulo_tag.get_text(strip=True) if titulo_tag else "Sem título"

        # Categorias
        categorias = []
        if header_div:
            categorias = [span.get_text(strip=True) for span in header_div.find_all("span", class_="entry-category")]

        # Corpo do conteúdo - múltiplos métodos de extração
        corpo = ""
        
        # Método 1: Tenta a classe original
        content_div = soup.find("div", class_="entry-content-single")
        if content_div:
            paragrafos = content_div.find_all("p")
            corpo = " ".join(p.get_text(strip=True) for p in paragrafos)
        
        # Método 2: Se não encontrou conteúdo suficiente, tenta outras classes
        if not corpo or len(corpo) < 50:
            # Tenta outras classes possíveis
            for class_name in ["entry-content", "vlog-content", "post-content"]:
                content_div = soup.find("div", class_=class_name)
                if content_div:
                    paragrafos = content_div.find_all(["p", "div"])
                    textos = []
                    for p in paragrafos:
                        texto = p.get_text(strip=True)
                        if texto and len(texto) > 20 and not texto.startswith("http"):
                            textos.append(texto)
                    if textos:
                        corpo = " ".join(textos)
                        break
        
        # Método 3: Fallback - procura por texto que contenha palavras-chave do artigo
        if not corpo or len(corpo) < 50:
            all_text = soup.get_text()
            # Procura por frases que contenham palavras do título
            titulo_palavras = titulo.lower().split()[:3]  # Primeiras 3 palavras do título
            sentences = all_text.split('.')
            relevant_sentences = []
            for sentence in sentences:
                if any(palavra in sentence.lower() for palavra in titulo_palavras) and len(sentence.strip()) > 30:
                    relevant_sentences.append(sentence.strip())
                    if len(' '.join(relevant_sentences)) > 200:  
                        break
            if relevant_sentences:
                corpo = ' '.join(relevant_sentences)
        
        print(f"Corpo extraído: {len(corpo)} caracteres")

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

        # Vídeo
        imagem_video = ""
        video_url = ""
        
        # Tenta encontrar o iframe do YouTube de várias formas
        iframe = None
        
        # Método 1: Procura na div com classe específica
        video_div = soup.find("div", class_="fluid-width-video-wrapper")
        if video_div:
            iframe = video_div.find("iframe")
        
        # Método 2: Procura diretamente por iframe do YouTube
        if not iframe:
            iframe = soup.find("iframe", src=re.compile(r"youtube\.com"))
        
        # Método 3: Procura qualquer iframe
        if not iframe:
            all_iframes = soup.find_all("iframe")
            for frame in all_iframes:
                if frame.has_attr("src") and "youtube" in frame["src"]:
                    iframe = frame
                    break
        
        if iframe and iframe.has_attr("src"):
            video_url = iframe["src"]
            print(f"Vídeo encontrado: {video_url}")
            
            # Extrai o ID do vídeo do YouTube
            match = re.search(r"youtube\.com/embed/([^?&]+)", video_url)
            if match:
                video_id = match.group(1)
                imagem_video = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
                print(f"Imagem de capa: {imagem_video}")
            else:
                print(f"Não foi possível extrair o ID do vídeo do YouTube")
        else:
            print(f"Nenhum iframe de vídeo encontrado")

        # Se não encontrou imagem de vídeo, usa uma imagem padrão
        if not imagem_video:
            imagem_video = "https://tubi.ubi.pt/wp-content/uploads/2017/06/tubi_logo-1.png"
            print(f"Usando imagem padrão: {imagem_video}")        

        return {
            "title": titulo,
            "url": url,
            "tags": categorias,
            "image_url": imagem_video,
            "video_url": video_url,
            "content": corpo,
            "summary": resumo
        }

    except Exception as e:
        print(f"Erro ao extrair {url}: {e}")
        return None

# ----------- Script Principal -----------

def main():
    sitemap_url = "https://tubi.ubi.pt/wp-sitemap-posts-post-1.xml"
    urls = obter_urls_mais_recentes(sitemap_url)

    artigos = []

    print(f"A extrair {len(urls)} artigos mais recentes do TUBI...\n")

    for url in urls:
        print(f"   ↪ {url}")
        artigo = extrair_detalhes_artigo_tubi(url)
        if artigo:
            artigos.append(artigo)

    with open("articles_tubi.json", "w", encoding="utf-8") as f:
        json.dump(artigos, f, ensure_ascii=False, indent=2)

    print(f"\nFicheiro 'articles_tubi.json' criado com {len(artigos)} artigos.")

if __name__ == "__main__":
    main()
