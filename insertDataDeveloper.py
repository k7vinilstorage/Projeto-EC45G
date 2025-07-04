from config import db_session

dados = {
    '2023': [12000, 19000, 15000, 22000],
    '2024': [15000, 22000, 18000, 25000],
    '2025': [18000, 24000, 21000, 28000],
}

meses_bimestres = [1, 3, 5, 7]

try:
    cursor = db_session.cursor()

    for ano_str, valores in dados.items():
        ano = int(ano_str)
        for i, quantidade in enumerate(valores):
            mes = meses_bimestres[i]
            data_bimestre = f"{ano}-{mes:02d}-01"

            cursor.execute("""
                INSERT INTO certificadora.input_sanitalpad
                (doa_donorName, doa_mark, doa_type, doa_hypoallergenic, doa_flow, doa_indication, doa_amount, doa_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                'Sistema',       
                'Marca X',        
                'Noturno',        
                True,             
                'Médio',          
                'Uso Geral',      
                quantidade,       
                data_bimestre     
            ))

    db_session.commit()
    cursor.close()
    print("Dados de doações inseridos com sucesso.")
except Exception as e:
    print(f"Ocorreu um erro: {e}")
