export const mailText = (itemInfo, month) => {
  return `<div style="font-size:14px; font-family:NanumGothic,나눔고딕,sans-serif;">
    <div style="font-size:14px; font-family:Gulim,굴림,sans-serif;">
        <div style="font-size: 10pt; font-family: Gulim, sans-serif;">
            <div>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-variant-ligatures: no-common-ligatures; font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">안녕하세요,&nbsp;</span>
                    <span
                        style="font-variant-ligatures: no-common-ligatures; font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">영로그입니다!
                        ✨</span><span style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span>
                </p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">주문해주셔서 감사합니다
                        🙏🏻💖</span><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-stretch: normal; line-height: 1.8;">
                    <font style="font-family: NanumGothic, 나눔고딕, sans-serif;"><span
                            style="font-variant-ligatures: no-common-ligatures; font-size: 14px;"><b>${itemInfo}</b></span>
                    </font><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px; font-weight: bold; font-variant-ligatures: no-common-ligatures;"> 파일</span><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px; font-variant-ligatures: no-common-ligatures;">을
                        보내드립니다.</span>
                    <font face="Helvetica" style="font-size: 12px;"><span
                            style="font-size: 14px; font-family: NanumGothic, 나눔고딕, sans-serif;">&nbsp;</span></font>
                    <span style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span>
                </p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-variant-ligatures: no-common-ligatures; font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">사용하시다가
                        궁금하신 사항이나</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-variant-ligatures: no-common-ligatures; font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">불편하신
                        사항 있으시면</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-variant-ligatures: no-common-ligatures; font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">언제든
                        편하게 문의주세요!</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">직접배송 특성상 운송장 번호가 입력되지
                        않아</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">배송완료로 처리되지 않으므로</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><u><span
                            style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;"><b>메일을 잘
                                받으셨다면</b></span></u></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><u><span
                            style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;"><b>구매확정과 소중한
                                후기</b></span></u></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><u><span
                            style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;"><b>남겨주시면
                                감사하겠습니다!</b></span></u><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">💗</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: arial, sans-serif; font-size: 10pt;"><span
                            style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">${month}월에도 행복한 일만 가득하세요!
                            😊&nbsp;</span><span
                            style="font-size: 14px; font-family: NanumGothic, 나눔고딕, sans-serif;">&nbsp;</span></span><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-variant-ligatures: no-common-ligatures; font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">다시
                        한 번 감사드립니다 🙏🏻</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">&nbsp;</span></p>
                <p style="font-family: Helvetica; font-size: 14px; font-stretch: normal; line-height: 1.8;"><span
                        style="font-variant-ligatures: no-common-ligatures; font-family: NanumGothic, 나눔고딕, sans-serif; font-size: 14px;">영로그
                        드림 🌷</span></p>
            </div>
        </div>
    </div>
</div>`;
};
