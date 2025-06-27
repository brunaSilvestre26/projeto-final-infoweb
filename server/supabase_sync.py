import json
import os
import re
import unicodedata
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_ANON_KEY"))

def extrair_autores_tubi(texto):
    # Regex simples para "reportagem é da X e do Y"
    match = re.search(r'(?:A )?reportagem é d[ao] ([\w\s]+?)(?: e (?:d[ao] )?([\w\s]+)| d[ao] ([\w\s]+))', texto, re.IGNORECASE)
    if match:
        # Verifica qual grupo capturou o segundo autor
        segundo_autor = match.group(2) if match.group(2) else match.group(3)
        return [match.group(1).strip(), segundo_autor.strip()]
    return ["Desconhecido"]

def slugify(texto):
    texto = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode("utf-8")
    texto = re.sub(r"[^\w\s-]", "", texto).strip().lower()
    return re.sub(r"[\s_-]+", "-", texto)

def inserir_artigo_e_relacionamentos(dados, sourceName):
    sourceId = supabase.table("source").select("id").eq("name", sourceName).execute()
    # 1. Inserir artigo
    artigo = {
        "title": dados["title"],
        "url": dados["url"],
        "image_url": dados.get("image_url"),
        "content": dados.get("content"),
        "summary": dados.get("summary"),
        "status": "approved",
        "source_id": sourceId.data[0]["id"] if sourceId.data else None,
    }

    # Verifica se já existe
    existente = supabase.table("article").select("id").eq("url", artigo["url"]).execute()
    if existente.data:
        article_id = existente.data[0]["id"]
    else:
        res = supabase.table("article").insert(artigo).execute()
        article_id = res.data[0]["id"]
        if article_id is not None:
            print(f"Artigo inserido com ID: {article_id}")

    if sourceName != "rubi":
        # 2. Inserir e associar tags (versão otimizada)
        tag_raw = dados.get("tags", [])
        # Verificar se é string ou lista
        if isinstance(tag_raw, str):
            tags_str = [tag_raw]  # Converter string para lista
        elif isinstance(tag_raw, list):
            tags_str = tag_raw
        else:
            tags_str = []

        if tags_str:
            tags_list = [t.strip() for t in tags_str[0].split(",")]
            # Criar slugs das tags a inserir
            tags_com_slug = [(tag, slugify(tag)) for tag in tags_list]

            # Extrair apenas as slugs para a consulta
            slugs_para_buscar = [slug for tag, slug in tags_com_slug]

            # Obter tags existentes por slug
            existentes = supabase.table("tag").select("id, name, slug").in_("slug", slugs_para_buscar).execute()
            tags_existentes = {tag["slug"]: tag for tag in existentes.data}

            for tag, tag_slug in tags_com_slug:
                if tag_slug in tags_existentes:
                    # Tag já existe (mesmo slug)
                    tag_id = tags_existentes[tag_slug]["id"]
                    existing_name = tags_existentes[tag_slug]["name"]
                    print(f"Tag existente: '{tag}' -> usando '{existing_name}' (ID: {tag_id})")
                else:
                    # Criar nova tag
                    novo = supabase.table("tag").insert({"name": tag, "slug": tag_slug}).execute()
                    tag_id = novo.data[0]["id"]
                    print(f"Nova tag criada: '{tag}' (slug: {tag_slug}, ID: {tag_id})")

                # Inserir relação
                articleTagsExiste = supabase.table("article_tags").select("article_id, tag_id").eq("article_id", article_id).eq("tag_id", tag_id).execute()
                if not articleTagsExiste.data:
                    print(f"Associando artigo {article_id} com tag {tag_id}")
                    supabase.table("article_tags").insert({
                        "article_id": article_id,
                        "tag_id": tag_id
                    }).execute()


    # 3. Inserir autores
    if sourceName == "tubi": # Caso TUBI
        autores = extrair_autores_tubi(dados.get("content", ""))
    else: # Caso URBIetORBI e RUBI
        autor_raw = dados.get("author")
        
        # Verificar se é string ou lista
        if isinstance(autor_raw, str):
            autores = [autor_raw]  # Converter string para lista
        elif isinstance(autor_raw, list):
            autores = autor_raw
        else:
            autores = []

    for nome in autores:
        if nome and nome.strip():  # Verificar se o nome não está vazio
            nome = nome.strip()
            autor_res = supabase.table("author").select("id").eq("name", nome).execute()
            if autor_res.data:
                autor_id = autor_res.data[0]["id"]
            else:
                autor_insert = supabase.table("author").insert({"name": nome}).execute()
                autor_id = autor_insert.data[0]["id"]

            articleAuthorsExistente = supabase.table("article_authors").select("article_id, author_id").eq("article_id", article_id).eq("author_id", autor_id).execute()
            if not articleAuthorsExistente.data:
                print(f"Associando artigo {article_id} com autor {autor_id}")
                # Criar relação artigo-autor
                supabase.table("article_authors").insert({
                    "article_id": article_id,
                    "author_id": autor_id
                }).execute()

def carregar_json_e_guardar_tudo(ficheiro="dados.json", sourceName=""):
    with open(ficheiro, "r", encoding="utf-8") as f:
        dados = json.load(f)

    if isinstance(dados, list):
        for i, artigo in enumerate(dados, 1):
            print(f"Inserindo artigo numero {i} de {len(dados)} artigos")
            inserir_artigo_e_relacionamentos(artigo, sourceName)
    else:
        inserir_artigo_e_relacionamentos(dados, sourceName)
