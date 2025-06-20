from app import app
from flask import render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from config import db_session
from collections import defaultdict
from matplotlib import cm
import matplotlib.colors as mcolors

@app.route("/")
@app.route("/login.html")
@app.route("/login", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        cursor = db_session.cursor()
        cursor.execute("SELECT user_username, user_password FROM certificadora.user WHERE user_username = %s", (username,))
        user = cursor.fetchone()
        
        if user and check_password_hash(user[1], password): 
            session['username'] = user[0] 
            return redirect(url_for('main'))
        else:
            error_message = "Usuário ou senha inválidos"  # Exemplo
            return render_template('login.html', error_message=error_message)
    else:
        return render_template('login.html', error_message=None)

@app.route('/logout')
def logout():
    session.clear() 
    return redirect(url_for('index'))        

@app.route("/main.html")
def main():
    if 'username' not in session:
        return redirect(url_for('index'))
    return render_template('main.html')

@app.route("/cadastroDoacao")
def CadDoaca():
    if 'username' not in session:
        return redirect(url_for('index'))
    try:
        cur = db_session.cursor()
        cur.execute("""
            SELECT 
                doa_id, doa_donorName, doa_mark, doa_type,
                doa_hypoallergenic, doa_flow, doa_indication,
                doa_amount, doa_date
            FROM certificadora.input_sanitalpad
            ORDER BY doa_date DESC
        """)
        rows = cur.fetchall()
        cur.close()

        doacoes = []
        for row in rows:
            doacoes.append({
                "id": row[0],
                "doador": row[1],
                "marca": row[2],
                "tipo": row[3],
                "Hipoalergenico": "Sim" if row[4] else "Não",
                "fluxo": row[5],
                "indicacao": row[6],
                "quantidade": row[7],
                "date": row[8].strftime('%d/%m/%Y %H:%M')
            })

        return render_template('cadDoac.html', doacoes=doacoes)
    except Exception as e:
        return render_template('cadDoac.html', doacoes=[])

@app.route("/registrar-doacao", methods=['POST'])
def registrar_doacao():
    data = request.get_json()

    try:
        cur = db_session.cursor()
        cur.execute("""
            INSERT INTO certificadora.input_sanitalpad (
                doa_donorName, doa_mark, doa_type,
                doa_hypoallergenic, doa_flow, doa_indication, doa_amount
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['doador'],
            data['marca'],
            data['tipo'],
            data['hipoalergenico'],
            data['fluxo'],
            data['indicacao'],
            data['quantidade']
        ))
        db_session.commit()
        cur.close()
        return jsonify({'success': True})
    
    except Exception as e:
        db_session.rollback()
        print("Erro ao salvar doação:", e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/getDataGraphic")
def getDataGraphic():
    try:
        db_session.rollback()

        cur = db_session.cursor()
        cur.execute("""
            SELECT 
                EXTRACT(YEAR FROM doa_date)::INT AS ano,
                CEIL(EXTRACT(MONTH FROM doa_date) / 2.0)::INT AS bimestre,
                SUM(doa_amount)::INT AS total
            FROM certificadora.input_sanitalpad
            GROUP BY ano, bimestre
            ORDER BY ano, bimestre
        """)
        dados_raw = cur.fetchall()
        cur.close()

        dados_formatados = defaultdict(lambda: [0, 0, 0, 0])
        for ano, bimestre, total in dados_raw:
            dados_formatados[ano][bimestre - 1] = total

        anos = sorted(dados_formatados.keys())
        n_anos = len(anos)

        # Gera cores dinâmicas
        def generate_colors(n):
            cmap = cm.get_cmap('Paired', n)
            cores = []
            for i in range(n):
                r, g, b, a = cmap(i)
                fill = f'rgba(242, {int(g*87)}, {int(b*116)}, 0.7)'
                border = f'rgba(242, {int(g*87)}, {int(b*116)}, 1)'
                cores.append((fill, border))
            return cores

        cores = generate_colors(n_anos)

        datasets = []
        for i, ano in enumerate(anos):
            valores = dados_formatados[ano]
            color_fill, color_border = cores[i]
            datasets.append({
                'label': str(ano),
                'data': valores,
                'backgroundColor': color_fill,
                'borderColor': color_border,
                'borderWidth': 1,
                'borderRadius': 5,
                'borderSkipped': False
            })

        return jsonify({
            'labels': ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'],
            'datasets': datasets
        })

    except Exception as e:
        db_session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


