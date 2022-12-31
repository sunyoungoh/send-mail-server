export const mailText = (orderList, comment) => {
  !comment ? (comment = '') : (comment = `${comment}<br/><br/>`);

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDate = new Date().getDate();
  let greeting = '';
  if (todayMonth == 12) {
    greeting =
      todayDate < 30
        ? '따뜻한 연말 되세요! 🎅🏻🎄'
        : '새해에도 행복한 일만 가득하세요! 😊';
  } else {
    const monthWord = todayMonth == 1 ? '새해' : `${todayMonth}월`;
    greeting = `${monthWord}에도 행복한 일만 가득하세요! 😊`;
  }

  return `
    <div
    style="
    font-size: 14px;
    font-family: NanumGothic, 나눔고딕, sans-serif;
    line-height: 1.8;
    "
    >
    <p>안녕하세요, 영로그입니다! ✨</p>
    <p>주문해주셔서 감사합니다 🙏🏻💖</p>
    <br />
    <p><b>${orderList} </b>속지를 보내드립니다.</p>
    <br />
    ${comment}
    <p>
    사용하시다가 궁금하신 사항이나
    <br />
    불편하신 사항 있으시면
    <br />
    언제든 편하게 문의주세요!
    </p>
    <br />
    <p>
    <span>직접배송 특성상 운송장 번호가 입력되지 않아</span>
    </p>
    <p>
    <span>배송완료로 처리되지 않으므로</span>
    </p>
    <p>
    <u><b>메일을 잘 받으셨다면</b></u>
    <br />
    <u><b>구매확정과 소중한 후기</b></u>
    <br />
    <u><b>남겨주시면 감사하겠습니다! 💗</b></u>
    </p>
    <br />
    <p>${greeting}</p>
    <br />
    <p>다시 한 번 감사드립니다 🙏🏻</p>
    <br />
    <p>영로그 드림 🌷</p>
    </div>`;
};
