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


@app.delete("/memos/{memo_id}")
def delete_memo(memo_id: int):
    for index, memo in enumerate(memos):  # enumerate()로 인덱스와 메모를 동시에 가져옴
        if memo.id == memo_id:  # memo의 id가 memo_id와 같은지 비교
            memos.pop(index)  # 해당 인덱스의 메모를 리스트에서 제거
            return "성공했습니다"
    return "그런 메모는 없습니다."


    
app.mount("/", StaticFiles(directory="static", html=True), name="static")