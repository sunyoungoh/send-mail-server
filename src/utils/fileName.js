const getFileOption = itemOption => {
  let fileOption = itemOption;
  fileOption = fileOption.replace('화이트', 'White');
  fileOption = fileOption.replace('다크', 'Dark');
  fileOption = fileOption.replace('라이트', 'Light');
  fileOption = fileOption.replace('인디핑크', 'IndiePink');
  fileOption = fileOption.replace('스카이블루', 'SkyBlue');
  fileOption = fileOption.replace('크림', 'Cream');
  fileOption = fileOption.replace('올리브', 'Olive');
  fileOption = fileOption.replace('토스트', 'Toast');
  fileOption = fileOption.replace('차콜', 'Charcoal');
  fileOption = fileOption.replace('캔디핑크', 'CandyPink');
  fileOption = fileOption.replace('스케줄', 'Schedule');
  fileOption = fileOption.replace('타임테이블', 'TimeTable');
  fileOption = fileOption.replace('월요일시작', 'Mon');
  fileOption = fileOption.replace('일요일시작', 'Sun');
  fileOption = fileOption.replace('교환일기', 'Sharing_Journal');
  fileOption = fileOption.replace('네컷프레임스티커', '4Cut_Frame_Sticker');
  return fileOption;
};

export const getFileName = (itemId, itemOption) => {
  let itemName = '';
  let fileName = '';
  let fileOption = itemOption ? getFileOption(itemOption) : '';

  if (itemId == 5033569 || itemId == 6175018692) {
    itemName = '2023 심플 플래너';
    fileName = `2022+2023_Simple_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033568 || itemId == 6173761992) {
    itemName = '2023 모던 플래너';
    fileName = `2022+2023_Modern_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033567 || itemId == 7551229680) {
    itemName = '2023 타임라인 플래너';
    fileName = `2023_Timeline_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033566 || itemId == 6230373650) {
    itemName = '2023 먼슬리&데일리 플래너';
    fileName = `2023_Monthly+Daily_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033565 || itemId == 6183672844) {
    itemName = '31DAYS 플래너';
    fileName = `31DAYS_Planner(${fileOption}).zip`;
  }

  if (itemId == 5068583 || itemId == 7674508068) {
    itemName = '레시피북';
    fileName = `Recipe_Book(${fileOption}).zip`;
  }

  if (itemId == 5033564 || itemId == 6668700804) {
    itemName = '세로형 인덱스 노트';
    if (fileOption == 'White+Dark') {
      fileName = `Index_Note(Vertical,${fileOption}).zip`;
    } else {
      fileName = `Index_Note(Vertical,${fileOption}).pdf`;
    }
  }

  if (itemId == 5033563 || itemId == 6711856094) {
    itemName = '가로형 인덱스 노트';
    if (fileOption == 'White+Dark') {
      fileName = `Index_Note(Horizontal,${fileOption}).zip`;
    } else {
      fileName = `Index_Note(Horizontal,${fileOption}).pdf`;
    }
  }

  if (itemId == 5033560 || itemId == 6907619722) {
    itemName = '독서노트';
    fileName = `Reading_Journal(${fileOption}).zip`;
  }

  if (itemId == 5033558 || itemId == 7118280906) {
    itemName = '드라마노트';
    fileName = `Drama_Journal(${fileOption}).zip`;
  }

  if (itemId == 5033557 || itemId == 6390846551) {
    itemName = '먼슬리 트래커북';
    fileName = `12_Months_Goal_Tracker(${fileOption}).zip`;
  }

  if (itemId == 5033561 || itemId == 6293308097) {
    itemName = '180 베이직 노트패드';
    fileName = `180_Basic_Notepad.zip`;
  }

  if (itemId == 5033559 || itemId == 6498685859) {
    itemName = '180 체커보드 노트패드';
    fileName = `180_CheckerBoard_Notepad.zip`;
  }

  if (itemId == 5161944 || itemId == 7917862453) {
    itemName = itemOption; // 교환일기 or 교환일기+네컷프레임스티커
    fileName = `${fileOption}.zip`;
  }

  if (itemId == 5161943 || itemId == 7923245834) {
    itemName = '네컷 프레임 스티커';
    fileName = `4Cut_Frame_Sticker.zip`;
  }

  if (itemId == 5033562 || itemId == 6339448390) {
    let itemOptionYears = itemOption.slice(0, 1);
    itemName = itemOptionYears == 3 ? '3년 다이어리' : '5년 다이어리';
    fileOption = fileOption.split(',')[1]; // 컬러옵션만
    fileName = `${itemOptionYears}_Years_Diary(${fileOption}).zip`;
  }

  return { itemName: itemName, fileName: fileName };
};
