from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

conexao_inicial = sqlite3.connect("banco.db")
cursor_inicial = conexao_inicial.cursor()

cursor_inicial.execute("""CREATE TABLE IF NOT EXISTS votos 
                       (
                        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        numero_candidato INTEGER 
                       )""")

conexao_inicial.commit()
conexao_inicial.close()  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Voto(BaseModel):
    numero_candidato: int

@app.post("/receber")
def receber_voto(usuario: Voto):

    print(f"Python recebeu voto de número: {usuario.numero_candidato}")

    conexao = sqlite3.connect("banco.db")
    cursor = conexao.cursor()

    try:
        cursor.execute(
            "INSERT INTO votos (numero_candidato) VALUES (?)",
            (usuario.numero_candidato,) 
        )
        conexao.commit()
        resposta = {"status": "Sucesso", "mensagem": f"{usuario.numero_candidato} foi salvo!"}

    finally:
        conexao.close()

    return resposta

@app.get("/listar")
def listar_cadastro():

    conexao = sqlite3.connect("banco.db")
    conexao.row_factory = sqlite3.Row
    cursor = conexao.cursor()

    cursor.execute("""SELECT * FROM votos""")
    votos = cursor.fetchall()

    conexao.close()

    return votos

@app.post("/reset")
def resetar_banco():
    import sqlite3
    try:
        # Conecta ao banco de dados (o mesmo arquivo que você já usa)
        conn = sqlite3.connect("banco.db")
        cursor = conn.cursor()
        
        # Executa a limpeza
        cursor.execute("DELETE FROM votos;")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='votos';")
        
        # Salva as alterações e fecha a conexão
        conn.commit()
        conn.close()
        
        return {"mensagem": "Banco de dados resetado com sucesso! Tudo zerado."}
    except Exception as e:
        return {"mensagem": f"Erro ao resetar o banco: {str(e)}"}