from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

class Memo(BaseModel):
    id: int
    content: str

memos = []

app = FastAPI()

@app.post("/memos")
def create_memo(memo:Memo):
    memos.append(memo)
    return '메모추가에 성공했습니다.'


@app.get ("/memos")
def read_memos():
    return memos

@app.put("/memos/{memo_id}")
def put_memo(req_memo:Memo):
    for memo in memos:
        if memo.id==req_memo.id:
            memo.content=req_memo.content
            return "성공했습니다"
    return '그런메모는 없습니다.'

app.mount("/", StaticFiles(directory="static", html=True), name="static")