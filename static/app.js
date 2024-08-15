async function editMemo(event) {
  console.log(event.target); //<button data-id="15464435">수정하기</button>
  console.log(event.target.dataset.id); //15464435

  const id = event.target.dataset.id;
  const editInput = prompt("수정할 값을 입력하세요");
  console.log(editInput);

  //서버로 요청을 보낸다.
  const res = await fetch(`/memos/${id}`, {
    method: "PUT", // 데이터 수정을 위해서는 PUT 요청
    headers: {
      "Content-type": "application/json", // 보낼 데이터가 JSON 형식임을 알림
    },
    body: JSON.stringify({
      // 보낼 데이터를 JSON 형식으로 변환
      id,
      content: editInput, // 사용자가 입력한 메모 내용
    }),
  });
  readMemo();
}

function displayMemo(memo) {
  const ul = document.querySelector("#ul");
  const li = document.createElement("li");
  const editBtn = document.createElement("button");

  li.innerText = `[id:${memo.id}] ${memo.content}`;
  editBtn.innerText = "수정하기";
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id; //wordle게임 만들 때 data-id = 00 이런식으로 작성했던것을 javascript에서 넣는 것

  ul.appendChild(li);
  li.appendChild(editBtn);
}

async function readMemo() {
  const res = await fetch("/memos"); // 기본적으로 GET 요청이기 때문에 POST 방식 지정할 필요 없음
  const jsonRes = await res.json();
  console.log("서버에서 가져온 메모 목록:", jsonRes); // 서버에서 받은 메모 목록 확인
  const ul = document.querySelector("#ul");
  ul.innerHTML = ""; //초기화 시켜줘야 메모가 반복적으로 들어가는 것을 방지한다.
  jsonRes.forEach(displayMemo); //jsonRes 배열의 각각의 원소에 함수를 실행한다. (forEach)
}

async function createMemo(value) {
  // POST 요청을 보내서 새로운 메모를 서버에 저장함
  const res = await fetch("/memos", {
    method: "POST", // POST 요청 (서버에 데이터를 보내기 위한 요청)
    headers: {
      "Content-type": "application/json", // 보낼 데이터가 JSON 형식임을 알림
    },
    body: JSON.stringify({
      // 보낼 데이터를 JSON 형식으로 변환
      id: new Date().getTime(),
      content: value, // 사용자가 입력한 메모 내용
    }),
  });

  // 서버로부터 응답을 받으면 JSON 형식으로 변환
  const jsonRes = await res.json();
  console.log("서버 응답:", jsonRes); // 서버로부터 받은 응답을 콘솔에 출력

  // 메모 목록 다시 읽기 (추가된 메모 확인)
  readMemo();
}

function handleSubmit(event) {
  event.preventDefault(); // 폼이 제출될 때 페이지가 새로고침되지 않도록 막음
  console.log("폼 제출됨");

  const input = document.querySelector("#memo-input"); // 입력창을 찾음
  createMemo(input.value); // 사용자가 입력한 메모 내용을 서버로 보냄
  input.value = ""; // 메모 제출 후 입력창을 비움
}

const form = document.querySelector("#memo-form"); // 폼을 찾음
form.addEventListener("submit", handleSubmit); // 폼이 제출될 때 handleSubmit 함수 실행

readMemo(); //맨처음 서버에 있는 데이터값을 불러와야하니까 readMemo실행
