const fileOptionType = {
  화이트: 'White',
  다크: 'Dark',
  블랙: 'Black',
  그레이: 'Grey',
  라이트: 'Light',
  인디핑크: 'IndiePink',
  스카이블루: 'SkyBlue',
  크림: 'Cream',
  올리브: 'Olive',
  토스트: 'Toast',
  차콜: 'Charcoal',
  캔디핑크: 'CandyPink',
  스케줄: 'Schedule',
  타임테이블: 'TimeTable',
  월요일시작: 'Mon',
  일요일시작: 'Sun',
  식단일기: 'Wellness',
  드라마: 'Drama',
  영화: 'Movie',
  버전1: 'V1',
  버전2: 'V2',
  세로형: 'Vertical',
  가로형: 'Horizontal',
  기본형: 'Basic',
  만년형: 'Undated',
  에메랄드민트: 'EmeraldMint',
};

const TranslateFromKorToEng = item => {
  if (isNaN(item)) {
    // 숫자가 아닐 때
    return item.replace(item, fileOptionType[item]);
  } else {
    return item;
  }
};

/**
 * 파일옵션 한글 -> 영어 변환
 * @param {string} itemOption - 상품옵션
 * @returns
 */
const getFileOptionArrEng = itemOption => {
  const optionArr = itemOption.split(',');
  const optionArrEng = optionArr.map(item => {
    // 세트옵션일 경우
    if (item.includes('+')) {
      const plusOption = item.split('+');
      return plusOption.map(item => TranslateFromKorToEng(item)).join('+');
    } else {
      return TranslateFromKorToEng(item);
    }
  });
  return optionArrEng;
};

export const getFileName = (itemId, itemOption) => {
  let itemName = '';
  let fileName = '';

  const fileOption = itemOption ? getFileOptionArrEng(itemOption) : '';
  const extension = fileOption == 'White+Dark' ? 'zip' : 'pdf'; // 인덱스 노트에서 사용

  switch (itemId) {
    case 5033569:
    case 6175018692:
      itemName = '2025 심플 플래너';
      fileName = `2025_Simple_Planner(${fileOption}).zip`;
      break;

    case 5033568:
    case 6173761992:
      itemName = '2025 모던 플래너';
      fileName = `2025_Modern_Planner(${fileOption}).zip`;
      break;

    case 5033567:
    case 7551229680:
      itemName =
        fileOption[0] == 'Undated'
          ? '만년형 타임라인 플래너'
          : '2025 타임라인 플래너';
      fileName =
        fileOption[1] == 'Wellness'
          ? `${fileOption[0]}_Wellness_Planner.zip`
          : `${fileOption[0]}_Timeline_Planner(${fileOption[1]}).zip`;
      break;

    case 5033566:
    case 6230373650:
      itemName = '2025 먼슬리&데일리 플래너';
      fileName = `2025_Monthly+Daily_Planner(${fileOption}).zip`;
      break;

    case 5033565:
    case 6183672844:
      itemName = '세로형 31DAYS 플래너';
      fileName = `[${fileOption[0]}]31DAYS_Planner(Vertical,${fileOption.slice(
        1
      )}).zip`;
      break;

    case 5183538:
    case 7988182711:
      itemName = '가로형 31DAYS 플래너';
      fileName = `31DAYS_Planner(Horizontal,${fileOption}).zip`;
      break;

    case 5068583:
    case 7674508068:
      itemName = '레시피북';
      fileName = `Recipe_Book(${fileOption}).zip`;
      break;

    case 5033564:
    case 6668700804:110423
    
      itemName = '세로형 인덱스 노트';
      fileName = `Index_Note(Vertical,${fileOption}).${extension}`;
      break;

    case 5033563:
    case 6711856094:
      itemName = '가로형 인덱스 노트';
      fileName = `Index_Note(Horizontal,${fileOption}).${extension}`;
      break;

    case 5033560:
    case 6907619722:
      itemName = '독서노트';
      fileName = `Reading_Journal(${fileOption}).zip`;
      break;

    case 5261964:
    case 8152103143:
      itemName = '강의노트';
      fileName = `Lecture_Notes(${fileOption}).zip`;
      break;

    case 5033558:
    case 7118280906:
      itemName = fileOption[0] == 'Movie' ? '영화노트' : '드라마노트';
      fileName = `${fileOption[0]}_Journal(${fileOption[1]}).zip`; // 영화드라마타입, 컬러
      break;

    case 5033557:
    case 6390846551:
      itemName = '먼슬리 트래커북';
      fileName = `Habit_Tracker_Book(${fileOption}).zip`;
      break;

    case 5033561:
    case 6293308097:
      itemName = '180 베이직 노트패드';
      fileName = `180_Basic_Notepad.zip`;
      break;

    case 5033559:
    case 6498685859:
      itemName = '180 체커보드 노트패드';
      fileName = `180_CheckerBoard_Notepad.zip`;
      break;

    case 5161944:
    case 7917862453:
      const personOption = itemOption.slice(0, 2) == '1인' ? 'For1' : 'For2-4';
      const stickerOption = itemOption.includes('네컷프레임스티커')
        ? '+4Cut_Frame_Sticker'
        : '';
      fileName = `Sharing_Journal(${personOption})${stickerOption}.zip`;
      itemName = itemOption.split(',').join(' ');
      break;

    case 5161943:
    case 7923245834:
      itemName = '네컷 프레임 스티커';
      fileName = `4Cut_Frame_Sticker.zip`;
      break;

    case 5234189:
    case 8097265225:
      itemName = '디데이,타임스탬프 스티커';
      fileName = `D-DAY,TIME_Sticker.zip`;
      break;

    case 5033562:
    case 6339448390:
      const years = itemOption.slice(0, 1);
      itemName = years == 3 ? '3년 다이어리' : '5년 다이어리';
      fileName = `${years}_Years_Diary(${fileOption[1]}).zip`;
      break;

    case 5413246:
    case 8457559941:
      itemName = '5분 저널';
      fileName = `5_Minute_Journal(${fileOption}).zip`;
      break;

    case 5568716:
    case 8802214105:
      itemName = 'TIL 노트';
      fileName = `TIL_Note(${fileOption}).zip`;
      break;

    case 5600165:
    case 8880782694:
      itemName = '한 줄 일기';
      fileName = `One_Line_Diary(${fileOption}).zip`;
      break;

    case 9974975533:
    case 6093224:
      itemName = '프로젝트 플래너';
      fileName = `Project_Planner.pdf`;
      break;

    case 10055162858:
    case 6138129:
      itemName = '요일 스티커';
      fileName = `Day_Of_Week_Sticker.zip`;
      break;

    case 10122818416:
    case 6183650:
      itemName = '체크리스트 노트';
      fileName = `Checklist_Note.zip`;
      break;
  }

  return { itemName, fileName };
};
