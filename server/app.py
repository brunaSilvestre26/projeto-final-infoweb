from flask import Flask, jsonify, request
from flask_cors import CORS
import scraper_tubi
import scraper_rubi
import scraper_urbietorbi
from supabase_sync import carregar_json_e_guardar_tudo

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/run-script', methods=['POST'])
def run_script():
    try:
        data = request.get_json()
        print("Dados recebidos:", data)

        if not data:
            return jsonify({'error': 'No JSON body provided'}), 400
        
        # Extract boolean flags
        tubi = data.get('tubi', False)
        rubi = data.get('rubi', False)
        urbi = data.get('urbi', False)
        
        print(f"Scraping flags - TUBI: {tubi}, RUBI: {rubi}, URBI: {urbi}")
        
        # Check what scrapers to run based on flags
        if tubi:
            print("A fazer o scraping de tubi.ubi.pt....")
            scraper_tubi.main()
            carregar_json_e_guardar_tudo("articles_tubi.json", "tubi")
        
        if rubi:
            print("A fazer o scraping de rubi.ubi.pt....")
            scraper_rubi.main()
            carregar_json_e_guardar_tudo("articles_rubi.json", "rubi")

        if urbi:
            print("A fazer o scraping de urbietorbi.ubi.pt....")
            scraper_urbietorbi.main()  
            carregar_json_e_guardar_tudo("articles_urbietorbi.json", "urbietorbi")
        
        # Check if at least one scraper was requested
        if not any([tubi, rubi, urbi]):
            return jsonify({'error': 'At least one scraper must be enabled (tubi, rubi, or urbi)'}), 400
        


        return jsonify({
            'output': 'Scraping concluído com sucesso',
            'scrapers_run': {
                'tubi': tubi,
                'rubi': rubi,
                'urbi': urbi
            },
            'error': '',
            'returncode': 0
        })
    
    except Exception as e:
        print(f"Erro ao fazer scraping: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
