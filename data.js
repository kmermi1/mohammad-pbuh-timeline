/*
 * Dataset: 100 well-known figures from the era of Prophet Muhammad ﷺ
 * + chronological events of his life.
 *
 * Each person has:
 *   id          (string, unique, used in relationships)
 *   name        (English transliteration)
 *   arabic      (Arabic script, optional)
 *   category    (family | wife | child | grandchild | companion | caliph | opponent | ally)
 *   born        (year CE, approximate, null if unknown)
 *   died        (year CE, approximate, null if unknown)
 *   description (1–3 sentence summary)
 *
 * Relationships are listed separately so the graph can render edges.
 * Relationship types: parent, child, spouse, sibling, uncle, aunt, cousin,
 *   adopted, nursed_by, companion, close_companion, ally, opponent,
 *   father_in_law, mother_in_law, son_in_law, daughter_in_law.
 *
 * Edit this file freely — add, remove, or correct entries.
 */

const PEOPLE = [
  // ── The Prophet ﷺ ───────────────────────────────────────────────
  { id: "muhammad", name: "Muhammad ﷺ", arabic: "محمد", category: "prophet", born: 570, died: 632,
    description: "Prophet of Islam, born in Mecca in the Year of the Elephant; received revelation at age 40 and led the Muslim community until his death in Medina in 632 CE." },

  // ── Parents & Grandparents ──────────────────────────────────────
  { id: "abdullah", name: "Abdullah ibn Abd al-Muttalib", arabic: "عبد الله", category: "family", born: 545, died: 570,
    description: "Father of the Prophet ﷺ. Died on a trading journey to Yathrib (Medina) before his son was born." },
  { id: "aminah", name: "Aminah bint Wahb", arabic: "آمنة", category: "family", born: 549, died: 576,
    description: "Mother of the Prophet ﷺ, from the Banu Zuhrah clan. Died when he was about six years old." },
  { id: "abdulmuttalib", name: "Abd al-Muttalib", arabic: "عبد المطلب", category: "family", born: 497, died: 578,
    description: "Paternal grandfather of the Prophet ﷺ and chief of the Banu Hashim clan; took care of him for two years after his mother's death." },
  { id: "wahb", name: "Wahb ibn Abd Manaf", arabic: "وهب", category: "family", born: null, died: null,
    description: "Maternal grandfather of the Prophet ﷺ, chief of the Banu Zuhrah." },

  // ── Wet nurses & early caretakers ───────────────────────────────
  { id: "halimah", name: "Halimah al-Sa'diyah", arabic: "حليمة السعدية", category: "family", born: null, died: null,
    description: "Bedouin wet nurse from Banu Sa'd who raised the Prophet ﷺ in the desert during his first four years." },
  { id: "thuwaybah", name: "Thuwaybah", arabic: "ثويبة", category: "family", born: null, died: 626,
    description: "Freed slave of Abu Lahab who briefly nursed the Prophet ﷺ as an infant." },
  { id: "ummayman", name: "Umm Ayman (Barakah)", arabic: "بركة", category: "companion", born: null, died: 634,
    description: "Ethiopian freedwoman who served the Prophet's ﷺ household from his infancy; he called her 'my mother after my mother.'" },

  // ── Uncles ──────────────────────────────────────────────────────
  { id: "abutalib", name: "Abu Talib", arabic: "أبو طالب", category: "family", born: 535, died: 619,
    description: "Paternal uncle who raised the Prophet ﷺ after his grandfather's death and protected him through the Meccan persecution; died in the Year of Sorrow." },
  { id: "hamza", name: "Hamza ibn Abd al-Muttalib", arabic: "حمزة", category: "family", born: 568, died: 625,
    description: "Paternal uncle and milk-brother of the Prophet ﷺ; converted to Islam early and became a great warrior. Martyred at the Battle of Uhud." },
  { id: "abbas", name: "Al-Abbas ibn Abd al-Muttalib", arabic: "العباس", category: "family", born: 568, died: 653,
    description: "Paternal uncle who later embraced Islam; ancestor of the Abbasid caliphs." },
  { id: "abulahab", name: "Abu Lahab", arabic: "أبو لهب", category: "opponent", born: 549, died: 624,
    description: "Paternal uncle of the Prophet ﷺ and one of his fiercest opponents; the chapter Al-Masad in the Qur'an was revealed about him." },
  { id: "zubayrabd", name: "Az-Zubayr ibn Abd al-Muttalib", arabic: "الزبير", category: "family", born: null, died: null,
    description: "Paternal uncle, a poet and chief of the Banu Hashim before Abu Talib." },

  // ── Aunts ───────────────────────────────────────────────────────
  { id: "safiyya_aunt", name: "Safiyyah bint Abd al-Muttalib", arabic: "صفية", category: "family", born: 569, died: 640,
    description: "Paternal aunt; mother of Zubayr ibn al-Awwam. Famously defended the fortress at Khandaq." },
  { id: "atikah", name: "Atikah bint Abd al-Muttalib", arabic: "عاتكة", category: "family", born: null, died: null,
    description: "Paternal aunt, known for a prophetic dream warning Quraysh before the Battle of Badr." },

  // ── Wives ───────────────────────────────────────────────────────
  { id: "khadijah", name: "Khadijah bint Khuwaylid", arabic: "خديجة", category: "wife", born: 555, died: 619,
    description: "First wife of the Prophet ﷺ and the first person to accept Islam. A successful merchant of Mecca; mother of all his children except Ibrahim." },
  { id: "sawda", name: "Sawda bint Zam'a", arabic: "سودة", category: "wife", born: 596, died: 674,
    description: "The Prophet's ﷺ second wife, married after Khadijah's death; a widow of an early Muslim emigrant to Abyssinia." },
  { id: "aisha", name: "Aisha bint Abi Bakr", arabic: "عائشة", category: "wife", born: 614, died: 678,
    description: "Daughter of Abu Bakr; a major narrator of hadith and one of the most learned figures of early Islam." },
  { id: "hafsa", name: "Hafsa bint Umar", arabic: "حفصة", category: "wife", born: 605, died: 665,
    description: "Daughter of Umar ibn al-Khattab; entrusted with the original written compilation of the Qur'an after the Prophet's ﷺ death." },
  { id: "zaynabkhuzayma", name: "Zaynab bint Khuzayma", arabic: "زينب بنت خزيمة", category: "wife", born: 595, died: 625,
    description: "Known as 'Umm al-Masakin' (mother of the poor) for her generosity. Died only months after marrying the Prophet ﷺ." },
  { id: "ummsalama", name: "Umm Salama (Hind bint Abi Umayya)", arabic: "أم سلمة", category: "wife", born: 596, died: 683,
    description: "Married the Prophet ﷺ after her first husband, Abu Salama, died of wounds from Uhud. Known for her wisdom; advised the Prophet at Hudaybiyyah." },
  { id: "zaynabjahsh", name: "Zaynab bint Jahsh", arabic: "زينب بنت جحش", category: "wife", born: 590, died: 641,
    description: "Cousin of the Prophet ﷺ and former wife of his adopted son Zayd ibn Harithah; her marriage is referenced in Surah Al-Ahzab." },
  { id: "juwayriya", name: "Juwayriya bint al-Harith", arabic: "جويرية", category: "wife", born: 605, died: 670,
    description: "Daughter of the chief of Banu Mustaliq; her marriage led to the release of her tribe's captives by the Muslims." },
  { id: "ummhabiba", name: "Umm Habiba (Ramla bint Abi Sufyan)", arabic: "أم حبيبة", category: "wife", born: 591, died: 666,
    description: "Daughter of Abu Sufyan; emigrated to Abyssinia with her first husband, who later apostatized. Married the Prophet ﷺ by proxy through the Negus." },
  { id: "safiyya_wife", name: "Safiyya bint Huyayy", arabic: "صفية", category: "wife", born: 610, died: 670,
    description: "Daughter of the Jewish chief of Banu Nadir; freed and married after the conquest of Khaybar." },
  { id: "maymuna", name: "Maymuna bint al-Harith", arabic: "ميمونة", category: "wife", born: 594, died: 671,
    description: "The Prophet's ﷺ last wife, married during the 'Umrah al-Qada (628 CE). Aunt of Khalid ibn al-Walid and Ibn Abbas." },
  { id: "maria", name: "Maria al-Qibtiyya", arabic: "مارية القبطية", category: "wife", born: 605, died: 637,
    description: "Coptic Christian from Egypt, sent as a gift by the Muqawqis; mother of the Prophet's ﷺ son Ibrahim." },

  // ── Children ────────────────────────────────────────────────────
  { id: "qasim", name: "Qasim ibn Muhammad", arabic: "القاسم", category: "child", born: 598, died: 601,
    description: "First child of the Prophet ﷺ and Khadijah; died in infancy. The Prophet's kunya 'Abu al-Qasim' refers to him." },
  { id: "zaynab_d", name: "Zaynab bint Muhammad", arabic: "زينب", category: "child", born: 599, died: 629,
    description: "Eldest daughter of the Prophet ﷺ; married her cousin Abu al-As ibn al-Rabi." },
  { id: "ruqayyah", name: "Ruqayyah bint Muhammad", arabic: "رقية", category: "child", born: 601, died: 624,
    description: "Daughter of the Prophet ﷺ; married Uthman ibn Affan and emigrated with him to Abyssinia, then Medina." },
  { id: "ummkulthum_d", name: "Umm Kulthum bint Muhammad", arabic: "أم كلثوم", category: "child", born: 603, died: 630,
    description: "Daughter of the Prophet ﷺ; married Uthman ibn Affan after Ruqayyah's death (earning him the title 'Dhu al-Nurayn')." },
  { id: "fatimah", name: "Fatimah bint Muhammad", arabic: "فاطمة", category: "child", born: 605, died: 632,
    description: "Youngest and most beloved daughter of the Prophet ﷺ; wife of Ali and mother of Hasan and Husayn. Died six months after her father." },
  { id: "abdullah_son", name: "Abdullah ibn Muhammad", arabic: "عبد الله", category: "child", born: 611, died: 613,
    description: "Son of the Prophet ﷺ and Khadijah; died in infancy. Also called 'al-Tayyib' and 'al-Tahir.'" },
  { id: "ibrahim", name: "Ibrahim ibn Muhammad", arabic: "إبراهيم", category: "child", born: 630, died: 632,
    description: "Son of the Prophet ﷺ and Maria al-Qibtiyya; died at about 18 months old. A solar eclipse on the day of his death was seen by some as a sign — the Prophet rejected this interpretation." },

  // ── Grandchildren ───────────────────────────────────────────────
  { id: "hasan", name: "Al-Hasan ibn Ali", arabic: "الحسن", category: "grandchild", born: 624, died: 670,
    description: "Eldest grandson of the Prophet ﷺ; briefly the fifth caliph before abdicating to Mu'awiya in the Year of Unity." },
  { id: "husayn", name: "Al-Husayn ibn Ali", arabic: "الحسين", category: "grandchild", born: 626, died: 680,
    description: "Second grandson of the Prophet ﷺ; martyred at the Battle of Karbala." },
  { id: "zaynab_g", name: "Zaynab bint Ali", arabic: "زينب", category: "grandchild", born: 627, died: 681,
    description: "Granddaughter of the Prophet ﷺ; survived Karbala and became a powerful voice for the family of the Prophet." },
  { id: "ummkulthum_g", name: "Umm Kulthum bint Ali", arabic: "أم كلثوم", category: "grandchild", born: 630, died: 680,
    description: "Granddaughter of the Prophet ﷺ; daughter of Ali and Fatimah." },
  { id: "usama", name: "Usama ibn Zayd", arabic: "أسامة", category: "companion", born: 612, died: 674,
    description: "Son of Zayd ibn Harithah and Umm Ayman; deeply loved by the Prophet ﷺ, who appointed him commander of an army at age 18." },

  // ── The Four Rightly-Guided Caliphs ────────────────────────────
  { id: "abubakr", name: "Abu Bakr al-Siddiq", arabic: "أبو بكر", category: "caliph", born: 573, died: 634,
    description: "Closest friend of the Prophet ﷺ, first adult male to embrace Islam, and the first caliph of Islam (632–634)." },
  { id: "umar", name: "Umar ibn al-Khattab", arabic: "عمر", category: "caliph", born: 584, died: 644,
    description: "Second caliph (634–644); during his rule the Islamic state expanded into Persia, Syria, and Egypt." },
  { id: "uthman", name: "Uthman ibn Affan", arabic: "عثمان", category: "caliph", born: 576, died: 656,
    description: "Third caliph (644–656); compiled the standard text of the Qur'an. Married two of the Prophet's daughters, earning the title Dhu al-Nurayn." },
  { id: "ali", name: "Ali ibn Abi Talib", arabic: "علي", category: "caliph", born: 600, died: 661,
    description: "Cousin and son-in-law of the Prophet ﷺ, fourth caliph (656–661), and the first male child to accept Islam." },

  // ── The Ten Promised Paradise (remaining six) ───────────────────
  { id: "talha", name: "Talha ibn Ubaydullah", arabic: "طلحة", category: "companion", born: 596, died: 656,
    description: "One of the ten companions promised paradise; shielded the Prophet ﷺ with his own body at Uhud, losing the use of a hand." },
  { id: "zubayr", name: "Az-Zubayr ibn al-Awwam", arabic: "الزبير بن العوام", category: "companion", born: 594, died: 656,
    description: "Cousin of the Prophet ﷺ (son of Safiyyah); one of the ten promised paradise and the first to draw a sword in defense of Islam." },
  { id: "abdurrahman", name: "Abdur Rahman ibn Awf", arabic: "عبد الرحمن بن عوف", category: "companion", born: 580, died: 654,
    description: "One of the ten promised paradise; a successful merchant who gave enormous wealth in charity." },
  { id: "sadwaqqas", name: "Sa'd ibn Abi Waqqas", arabic: "سعد بن أبي وقاص", category: "companion", born: 595, died: 674,
    description: "One of the ten promised paradise; maternal uncle of the Prophet ﷺ and the commander who led the Muslims to victory at Qadisiyyah." },
  { id: "saidzayd", name: "Sa'id ibn Zayd", arabic: "سعيد بن زيد", category: "companion", born: 593, died: 671,
    description: "One of the ten promised paradise; cousin and brother-in-law of Umar ibn al-Khattab." },
  { id: "abuubaida", name: "Abu Ubaidah ibn al-Jarrah", arabic: "أبو عبيدة", category: "companion", born: 583, died: 639,
    description: "One of the ten promised paradise; called by the Prophet ﷺ 'the trustworthy one of this nation' and a key commander in the conquest of Syria." },

  // ── Other major male companions ─────────────────────────────────
  { id: "bilal", name: "Bilal ibn Rabah", arabic: "بلال", category: "companion", born: 580, died: 640,
    description: "Ethiopian freedman who became the first muezzin of Islam. Tortured for his faith in Mecca; bought and freed by Abu Bakr." },
  { id: "salman", name: "Salman al-Farsi", arabic: "سلمان الفارسي", category: "companion", born: 568, died: 656,
    description: "Persian seeker of truth who travelled from Zoroastrianism through Christianity to find the Prophet ﷺ in Medina. Suggested the trench at Khandaq." },
  { id: "abudharr", name: "Abu Dharr al-Ghifari", arabic: "أبو ذر", category: "companion", born: 568, died: 652,
    description: "Early convert known for his austere life and outspoken defense of the poor." },
  { id: "muadh", name: "Mu'adh ibn Jabal", arabic: "معاذ بن جبل", category: "companion", born: 603, died: 639,
    description: "Renowned for his knowledge of fiqh; sent by the Prophet ﷺ to teach Islam in Yemen." },
  { id: "musab", name: "Mus'ab ibn Umayr", arabic: "مصعب بن عمير", category: "companion", born: 585, died: 625,
    description: "First ambassador of Islam, sent to teach the people of Yathrib (Medina) before the Hijra. Martyred at Uhud." },
  { id: "saadmuadh", name: "Sa'd ibn Mu'adh", arabic: "سعد بن معاذ", category: "companion", born: 591, died: 627,
    description: "Chief of the Aws tribe in Medina; his conversion brought most of his tribe into Islam. Wounded at Khandaq and died of his wound." },
  { id: "saadubada", name: "Sa'd ibn Ubadah", arabic: "سعد بن عبادة", category: "companion", born: null, died: 636,
    description: "Chief of the Khazraj tribe; one of the twelve representatives at the Second Pledge of Aqaba." },
  { id: "ibnmasud", name: "Abdullah ibn Mas'ud", arabic: "ابن مسعود", category: "companion", born: 594, died: 653,
    description: "Sixth person to embrace Islam; a major reciter and teacher of the Qur'an." },
  { id: "ibnabbas", name: "Abdullah ibn Abbas", arabic: "ابن عباس", category: "companion", born: 619, died: 687,
    description: "Cousin of the Prophet ﷺ (son of Al-Abbas); known as 'the interpreter of the Qur'an' for his deep tafsir knowledge." },
  { id: "ibnumar", name: "Abdullah ibn Umar", arabic: "ابن عمر", category: "companion", born: 610, died: 693,
    description: "Son of Umar ibn al-Khattab; one of the most prolific narrators of hadith and a careful follower of the Prophet's ﷺ example." },
  { id: "khalid", name: "Khalid ibn al-Walid", arabic: "خالد بن الوليد", category: "companion", born: 592, died: 642,
    description: "Initially fought against Muslims at Uhud, then converted before Mecca's conquest. Titled 'Sayf Allah' (Sword of God) by the Prophet ﷺ." },
  { id: "amribnal_as", name: "Amr ibn al-As", arabic: "عمرو بن العاص", category: "companion", born: 585, died: 664,
    description: "Skilled diplomat and general; converted just before the conquest of Mecca and later conquered Egypt." },
  { id: "anas", name: "Anas ibn Malik", arabic: "أنس بن مالك", category: "companion", born: 612, died: 712,
    description: "Served the Prophet ﷺ for ten years as a young attendant in Medina; one of the longest-lived companions." },
  { id: "jafar", name: "Ja'far ibn Abi Talib", arabic: "جعفر", category: "family", born: 590, died: 629,
    description: "Brother of Ali and cousin of the Prophet ﷺ; led the first hijra to Abyssinia. Martyred at Mu'tah; nicknamed 'Dhu al-Janahayn' (the two-winged)." },
  { id: "aqil", name: "Aqil ibn Abi Talib", arabic: "عقيل", category: "family", born: 580, died: 670,
    description: "Brother of Ali and Ja'far; captured at Badr and later embraced Islam. Known as a master of Arab genealogy." },
  { id: "zayd", name: "Zayd ibn Harithah", arabic: "زيد بن حارثة", category: "family", born: 581, died: 629,
    description: "Freed slave and adopted son of the Prophet ﷺ; the only companion mentioned by name in the Qur'an. Martyred at Mu'tah." },
  { id: "ammar", name: "Ammar ibn Yasir", arabic: "عمار", category: "companion", born: 570, died: 657,
    description: "Early convert tortured in Mecca with his parents; the Prophet ﷺ said paradise longed for him." },
  { id: "yasir", name: "Yasir ibn Amir", arabic: "ياسر", category: "companion", born: null, died: 615,
    description: "Father of Ammar; one of the very first martyrs of Islam, killed under torture by Abu Jahl." },
  { id: "sumayyah", name: "Sumayyah bint Khabbat", arabic: "سمية", category: "companion", born: null, died: 615,
    description: "Mother of Ammar; the first martyr of Islam, killed by Abu Jahl for refusing to renounce her faith." },
  { id: "khabbab", name: "Khabbab ibn al-Aratt", arabic: "خباب", category: "companion", born: 586, died: 657,
    description: "Early convert and blacksmith; severely tortured for his faith in Mecca." },
  { id: "suhayb", name: "Suhayb ar-Rumi", arabic: "صهيب الرومي", category: "companion", born: 587, died: 659,
    description: "'The Roman' — Arab raised among the Byzantines; gave up his entire wealth to be allowed to emigrate to Medina." },
  { id: "abuayyub", name: "Abu Ayyub al-Ansari", arabic: "أبو أيوب الأنصاري", category: "companion", born: null, died: 674,
    description: "Hosted the Prophet ﷺ in his home when he first arrived in Medina." },
  { id: "ubayy", name: "Ubayy ibn Ka'b", arabic: "أبي بن كعب", category: "companion", born: null, died: 656,
    description: "One of the Prophet's ﷺ chief scribes and Qur'an reciters; called 'the master of reciters.'" },
  { id: "zaydthabit", name: "Zayd ibn Thabit", arabic: "زيد بن ثابت", category: "companion", born: 610, died: 665,
    description: "Personal scribe of the Prophet ﷺ; led the compilation of the Qur'an under Abu Bakr and Uthman." },
  { id: "hudhayfa", name: "Hudhayfah ibn al-Yaman", arabic: "حذيفة", category: "companion", born: null, died: 657,
    description: "Keeper of the Prophet's ﷺ secrets, especially about the hypocrites of Medina." },
  { id: "hassan", name: "Hassan ibn Thabit", arabic: "حسان بن ثابت", category: "companion", born: 563, died: 674,
    description: "Poet of the Prophet ﷺ; his verses defended Islam against the hostile poets of Quraysh." },
  { id: "abuhurayra", name: "Abu Hurairah", arabic: "أبو هريرة", category: "companion", born: 603, died: 681,
    description: "Late convert (7 AH) who became one of the most prolific narrators of hadith." },
  { id: "tufayl", name: "Tufayl ibn Amr ad-Dawsi", arabic: "الطفيل", category: "companion", born: null, died: 633,
    description: "Chief of the Daws tribe; brought his entire tribe to Islam." },
  { id: "adi", name: "Adi ibn Hatim", arabic: "عدي بن حاتم", category: "companion", born: null, died: 687,
    description: "Son of the legendary pre-Islamic Arab Hatim al-Ta'i; embraced Islam after fleeing to Syria and meeting the Prophet ﷺ." },
  { id: "kab_ahbar", name: "Ka'b al-Ahbar", arabic: "كعب الأحبار", category: "companion", born: null, died: 652,
    description: "Yemeni Jewish scholar who embraced Islam after the Prophet's ﷺ death; a major early source on Biblical lore." },

  // ── Female companions ───────────────────────────────────────────
  { id: "asma", name: "Asma bint Abi Bakr", arabic: "أسماء", category: "companion", born: 595, died: 692,
    description: "Daughter of Abu Bakr; brought food to the Prophet ﷺ and her father in the cave during the Hijra. Known as 'Dhat al-Nitaqayn' (the one of two belts)." },
  { id: "ummsulaym", name: "Umm Sulaym bint Milhan", arabic: "أم سليم", category: "companion", born: null, died: 650,
    description: "Mother of Anas ibn Malik; one of the earliest female Ansar to embrace Islam." },
  { id: "nusayba", name: "Nusaybah bint Ka'b (Umm Ammarah)", arabic: "نسيبة", category: "companion", born: null, died: 634,
    description: "Heroine of Uhud who fought to defend the Prophet ﷺ when the Muslims were routed, sustaining many wounds." },
  { id: "rufayda", name: "Rufayda al-Aslamiyya", arabic: "رفيدة", category: "companion", born: null, died: null,
    description: "First Muslim nurse; ran a tent-hospital outside the Prophet's ﷺ mosque to treat the wounded." },
  { id: "khansa", name: "Al-Khansa bint Amr", arabic: "الخنساء", category: "companion", born: 575, died: 645,
    description: "Among the most celebrated poets in Arabic history; embraced Islam and lost four sons at the Battle of Qadisiyyah." },
  { id: "fatimakhattab", name: "Fatimah bint al-Khattab", arabic: "فاطمة بنت الخطاب", category: "companion", born: null, died: null,
    description: "Sister of Umar ibn al-Khattab; her secret faith was the catalyst for Umar's conversion." },

  // ── Opponents in Mecca ──────────────────────────────────────────
  { id: "abujahl", name: "Abu Jahl (Amr ibn Hisham)", arabic: "أبو جهل", category: "opponent", born: 570, died: 624,
    description: "Chief antagonist of the Prophet ﷺ in Mecca; called 'Pharaoh of this nation.' Killed at Badr." },
  { id: "abusufyan", name: "Abu Sufyan ibn Harb", arabic: "أبو سفيان", category: "opponent", born: 565, died: 653,
    description: "Leader of Quraysh and commander at Uhud and Khandaq; embraced Islam at the conquest of Mecca." },
  { id: "hind", name: "Hind bint Utbah", arabic: "هند", category: "opponent", born: null, died: 636,
    description: "Wife of Abu Sufyan; led the Meccan women at Uhud where her uncle Hamza was killed. Embraced Islam at the conquest of Mecca." },
  { id: "utbah", name: "Utbah ibn Rabi'ah", arabic: "عتبة", category: "opponent", born: null, died: 624,
    description: "A senior Qurayshi leader who tried to negotiate with the Prophet ﷺ; killed in single combat at Badr." },
  { id: "shayba", name: "Shayba ibn Rabi'ah", arabic: "شيبة", category: "opponent", born: null, died: 624,
    description: "Brother of Utbah and a senior Qurayshi leader; killed in single combat at Badr." },
  { id: "walid", name: "Al-Walid ibn al-Mughirah", arabic: "الوليد", category: "opponent", born: null, died: 622,
    description: "Wealthy chief of Makhzum; father of Khalid ibn al-Walid and an arch-opponent of the early Muslims." },
  { id: "umayya", name: "Umayyah ibn Khalaf", arabic: "أمية", category: "opponent", born: null, died: 624,
    description: "Master of Bilal; tortured him relentlessly. Killed at Badr." },
  { id: "uqba", name: "Uqbah ibn Abi Mu'ayt", arabic: "عقبة", category: "opponent", born: null, died: 624,
    description: "Notorious for attempting to strangle the Prophet ﷺ while he prayed. Executed after Badr." },
  { id: "nadr", name: "An-Nadr ibn al-Harith", arabic: "النضر", category: "opponent", born: null, died: 624,
    description: "Storyteller of Quraysh who mocked the Qur'an by reciting Persian legends. Executed after Badr." },
  { id: "ummjamil", name: "Umm Jamil bint Harb", arabic: "أم جميل", category: "opponent", born: null, died: null,
    description: "Wife of Abu Lahab and sister of Abu Sufyan; mentioned in Surah al-Masad as 'the carrier of firewood.'" },
  { id: "musaylimah", name: "Musaylimah al-Kadhdhab", arabic: "مسيلمة", category: "opponent", born: null, died: 632,
    description: "Chief of Banu Hanifa in Yamamah; claimed prophethood. Killed during the Ridda wars under Abu Bakr." },

  // ── Jewish tribes and figures of Medina ────────────────────────
  { id: "huyayy", name: "Huyayy ibn Akhtab", arabic: "حيي", category: "opponent", born: null, died: 627,
    description: "Chief of the Banu Nadir; instigated the alliance against Medina at Khandaq. Executed after Banu Qurayza's siege." },
  { id: "kab_ashraf", name: "Ka'b ibn al-Ashraf", arabic: "كعب بن الأشراف", category: "opponent", born: null, died: 624,
    description: "Poet of Banu Nadir who incited Quraysh against the Muslims after Badr." },
  { id: "abdullahsalam", name: "Abdullah ibn Salam", arabic: "عبد الله بن سلام", category: "companion", born: null, died: 663,
    description: "Prominent rabbi of Banu Qaynuqa who embraced Islam upon meeting the Prophet ﷺ in Medina." },
  { id: "mukhayriq", name: "Mukhayriq", arabic: "مخيريق", category: "ally", born: null, died: 625,
    description: "Jewish scholar who fought and died alongside the Muslims at Uhud, leaving his wealth to the Prophet ﷺ." },

  // ── Allies and non-Muslim figures ──────────────────────────────
  { id: "waraqah", name: "Waraqah ibn Nawfal", arabic: "ورقة", category: "ally", born: null, died: 610,
    description: "Cousin of Khadijah, a Christian scholar of Mecca; confirmed Muhammad's ﷺ first revelation and recognised him as a prophet." },
  { id: "negus", name: "An-Najashi (Negus Ashama)", arabic: "النجاشي", category: "ally", born: null, died: 631,
    description: "Christian king of Aksum (Abyssinia) who gave refuge to the first Muslim emigrants and famously wept on hearing Surah Maryam." },
  { id: "heraclius", name: "Heraclius", arabic: "هرقل", category: "ally", born: 575, died: 641,
    description: "Byzantine emperor who received the Prophet's ﷺ letter inviting him to Islam; treated the messenger with respect." },
  { id: "muqawqis", name: "Al-Muqawqis", arabic: "المقوقس", category: "ally", born: null, died: 642,
    description: "Christian ruler of Egypt; received the Prophet's ﷺ letter and sent gifts including Maria al-Qibtiyya." },
  { id: "khosrau", name: "Khosrau II", arabic: "كسرى", category: "opponent", born: 570, died: 628,
    description: "Sasanian emperor who tore up the Prophet's ﷺ letter; the Prophet ﷺ then said his empire would be torn apart." },
  { id: "muthim", name: "Mut'im ibn Adi", arabic: "مطعم بن عدي", category: "ally", born: null, died: 624,
    description: "Qurayshi chief who, though not a Muslim, gave the Prophet ﷺ protection upon his return from Ta'if." },
  { id: "abubasir", name: "Abu Basir Utbah ibn Asid", arabic: "أبو بصير", category: "companion", born: null, died: 629,
    description: "Companion whose return to Mecca was demanded under Hudaybiyyah; he formed an outlaw band that pressured Quraysh into amending the treaty." },
  { id: "suhayl", name: "Suhayl ibn Amr", arabic: "سهيل بن عمرو", category: "opponent", born: 556, died: 639,
    description: "Eloquent Qurayshi who negotiated the Treaty of Hudaybiyyah for Mecca; later embraced Islam at the conquest of Mecca." },
  { id: "urwa", name: "Urwah ibn Mas'ud", arabic: "عروة بن مسعود", category: "companion", born: null, died: 630,
    description: "Chief of Ta'if; sent as a Qurayshi envoy to Hudaybiyyah, later embraced Islam and was martyred preaching to his tribe." },
  { id: "abulas", name: "Abu al-As ibn al-Rabi", arabic: "أبو العاص", category: "family", born: null, died: 634,
    description: "Husband of the Prophet's ﷺ daughter Zaynab; fought against the Muslims at Badr, later embraced Islam." },
  { id: "habibsahmi", name: "Hatib ibn Abi Balta'a", arabic: "حاطب", category: "companion", born: null, died: 650,
    description: "Companion who carried the Prophet's ﷺ letter to Muqawqis; later sent secret intelligence to Quraysh and was forgiven." },
  { id: "ikrimah", name: "Ikrimah ibn Abi Jahl", arabic: "عكرمة", category: "companion", born: 598, died: 636,
    description: "Son of Abu Jahl; fierce opponent who fled the conquest of Mecca, then returned, embraced Islam, and died as a martyr in Syria." },
  { id: "khalidsaid", name: "Khalid ibn Sa'id ibn al-As", arabic: "خالد بن سعيد", category: "companion", born: null, died: 634,
    description: "Among the very first to embrace Islam, fifth or so; emigrated to Abyssinia." },
  { id: "fadl", name: "Al-Fadl ibn Abbas", arabic: "الفضل بن العباس", category: "family", born: 618, died: 639,
    description: "Cousin of the Prophet ﷺ; rode behind him during the Farewell Pilgrimage and helped wash his body after his death." }
];

// ── RELATIONSHIPS ───────────────────────────────────────────────────
// Each entry: { source, target, type }
const RELATIONSHIPS = [
  // Parents and grandparents of the Prophet ﷺ
  { source: "abdullah", target: "muhammad", type: "parent" },
  { source: "aminah", target: "muhammad", type: "parent" },
  { source: "abdulmuttalib", target: "abdullah", type: "parent" },
  { source: "abdulmuttalib", target: "abutalib", type: "parent" },
  { source: "abdulmuttalib", target: "hamza", type: "parent" },
  { source: "abdulmuttalib", target: "abbas", type: "parent" },
  { source: "abdulmuttalib", target: "abulahab", type: "parent" },
  { source: "abdulmuttalib", target: "zubayrabd", type: "parent" },
  { source: "abdulmuttalib", target: "safiyya_aunt", type: "parent" },
  { source: "abdulmuttalib", target: "atikah", type: "parent" },
  { source: "wahb", target: "aminah", type: "parent" },

  // Wet nurses
  { source: "halimah", target: "muhammad", type: "nursed_by" },
  { source: "thuwaybah", target: "muhammad", type: "nursed_by" },
  { source: "thuwaybah", target: "hamza", type: "nursed_by" },
  { source: "ummayman", target: "muhammad", type: "nursed_by" },

  // Uncles → Prophet (cousin/uncle relationships for the Banu Hashim core)
  { source: "abutalib", target: "muhammad", type: "uncle" },
  { source: "hamza", target: "muhammad", type: "uncle" },
  { source: "abbas", target: "muhammad", type: "uncle" },
  { source: "abulahab", target: "muhammad", type: "uncle" },
  { source: "zubayrabd", target: "muhammad", type: "uncle" },
  { source: "safiyya_aunt", target: "muhammad", type: "aunt" },
  { source: "atikah", target: "muhammad", type: "aunt" },

  // Children of the uncles → cousins of the Prophet
  { source: "abutalib", target: "ali", type: "parent" },
  { source: "abutalib", target: "jafar", type: "parent" },
  { source: "abutalib", target: "aqil", type: "parent" },
  { source: "abbas", target: "ibnabbas", type: "parent" },
  { source: "abbas", target: "fadl", type: "parent" },
  { source: "safiyya_aunt", target: "zubayr", type: "parent" },
  { source: "abulahab", target: "ummjamil", type: "spouse" },

  // Cousins of the Prophet
  { source: "ali", target: "muhammad", type: "cousin" },
  { source: "jafar", target: "muhammad", type: "cousin" },
  { source: "aqil", target: "muhammad", type: "cousin" },
  { source: "ibnabbas", target: "muhammad", type: "cousin" },
  { source: "fadl", target: "muhammad", type: "cousin" },
  { source: "zubayr", target: "muhammad", type: "cousin" },
  { source: "zaynabjahsh", target: "muhammad", type: "cousin" },

  // Wives → Prophet
  { source: "khadijah", target: "muhammad", type: "spouse" },
  { source: "sawda", target: "muhammad", type: "spouse" },
  { source: "aisha", target: "muhammad", type: "spouse" },
  { source: "hafsa", target: "muhammad", type: "spouse" },
  { source: "zaynabkhuzayma", target: "muhammad", type: "spouse" },
  { source: "ummsalama", target: "muhammad", type: "spouse" },
  { source: "zaynabjahsh", target: "muhammad", type: "spouse" },
  { source: "juwayriya", target: "muhammad", type: "spouse" },
  { source: "ummhabiba", target: "muhammad", type: "spouse" },
  { source: "safiyya_wife", target: "muhammad", type: "spouse" },
  { source: "maymuna", target: "muhammad", type: "spouse" },
  { source: "maria", target: "muhammad", type: "spouse" },

  // Children of the Prophet
  { source: "muhammad", target: "qasim", type: "parent" },
  { source: "muhammad", target: "zaynab_d", type: "parent" },
  { source: "muhammad", target: "ruqayyah", type: "parent" },
  { source: "muhammad", target: "ummkulthum_d", type: "parent" },
  { source: "muhammad", target: "fatimah", type: "parent" },
  { source: "muhammad", target: "abdullah_son", type: "parent" },
  { source: "muhammad", target: "ibrahim", type: "parent" },
  { source: "khadijah", target: "qasim", type: "parent" },
  { source: "khadijah", target: "zaynab_d", type: "parent" },
  { source: "khadijah", target: "ruqayyah", type: "parent" },
  { source: "khadijah", target: "ummkulthum_d", type: "parent" },
  { source: "khadijah", target: "fatimah", type: "parent" },
  { source: "khadijah", target: "abdullah_son", type: "parent" },
  { source: "maria", target: "ibrahim", type: "parent" },

  // Marriages of the Prophet's daughters
  { source: "ali", target: "fatimah", type: "spouse" },
  { source: "uthman", target: "ruqayyah", type: "spouse" },
  { source: "uthman", target: "ummkulthum_d", type: "spouse" },
  { source: "abulas", target: "zaynab_d", type: "spouse" },

  // Grandchildren
  { source: "ali", target: "hasan", type: "parent" },
  { source: "ali", target: "husayn", type: "parent" },
  { source: "ali", target: "zaynab_g", type: "parent" },
  { source: "ali", target: "ummkulthum_g", type: "parent" },
  { source: "fatimah", target: "hasan", type: "parent" },
  { source: "fatimah", target: "husayn", type: "parent" },
  { source: "fatimah", target: "zaynab_g", type: "parent" },
  { source: "fatimah", target: "ummkulthum_g", type: "parent" },

  // Caliphs as in-laws / close companions
  { source: "abubakr", target: "muhammad", type: "close_companion" },
  { source: "umar", target: "muhammad", type: "close_companion" },
  { source: "uthman", target: "muhammad", type: "close_companion" },
  { source: "ali", target: "muhammad", type: "close_companion" },
  { source: "abubakr", target: "aisha", type: "parent" },
  { source: "umar", target: "hafsa", type: "parent" },
  { source: "abubakr", target: "asma", type: "parent" },
  { source: "umar", target: "ibnumar", type: "parent" },
  { source: "umar", target: "fatimakhattab", type: "sibling" },
  { source: "saidzayd", target: "fatimakhattab", type: "spouse" },

  // Zayd & Usama
  { source: "muhammad", target: "zayd", type: "adopted" },
  { source: "zayd", target: "usama", type: "parent" },
  { source: "ummayman", target: "usama", type: "parent" },
  { source: "ummayman", target: "zayd", type: "spouse" },
  { source: "zayd", target: "zaynabjahsh", type: "spouse" },

  // Anas served the Prophet
  { source: "ummsulaym", target: "anas", type: "parent" },
  { source: "anas", target: "muhammad", type: "companion" },

  // Ammar family
  { source: "yasir", target: "ammar", type: "parent" },
  { source: "sumayyah", target: "ammar", type: "parent" },
  { source: "yasir", target: "sumayyah", type: "spouse" },

  // The "Ten Promised Paradise" — companions of the Prophet
  { source: "talha", target: "muhammad", type: "close_companion" },
  { source: "zubayr", target: "muhammad", type: "close_companion" },
  { source: "abdurrahman", target: "muhammad", type: "close_companion" },
  { source: "sadwaqqas", target: "muhammad", type: "close_companion" },
  { source: "saidzayd", target: "muhammad", type: "close_companion" },
  { source: "abuubaida", target: "muhammad", type: "close_companion" },

  // Other key companions
  { source: "bilal", target: "muhammad", type: "close_companion" },
  { source: "salman", target: "muhammad", type: "close_companion" },
  { source: "abudharr", target: "muhammad", type: "companion" },
  { source: "muadh", target: "muhammad", type: "companion" },
  { source: "musab", target: "muhammad", type: "companion" },
  { source: "saadmuadh", target: "muhammad", type: "companion" },
  { source: "saadubada", target: "muhammad", type: "companion" },
  { source: "ibnmasud", target: "muhammad", type: "close_companion" },
  { source: "ibnabbas", target: "muhammad", type: "companion" },
  { source: "ibnumar", target: "muhammad", type: "companion" },
  { source: "khalid", target: "muhammad", type: "companion" },
  { source: "amribnal_as", target: "muhammad", type: "companion" },
  { source: "ammar", target: "muhammad", type: "companion" },
  { source: "khabbab", target: "muhammad", type: "companion" },
  { source: "suhayb", target: "muhammad", type: "companion" },
  { source: "abuayyub", target: "muhammad", type: "companion" },
  { source: "ubayy", target: "muhammad", type: "companion" },
  { source: "zaydthabit", target: "muhammad", type: "companion" },
  { source: "hudhayfa", target: "muhammad", type: "companion" },
  { source: "hassan", target: "muhammad", type: "companion" },
  { source: "abuhurayra", target: "muhammad", type: "companion" },
  { source: "tufayl", target: "muhammad", type: "companion" },
  { source: "adi", target: "muhammad", type: "companion" },
  { source: "kab_ahbar", target: "muhammad", type: "companion" },
  { source: "asma", target: "muhammad", type: "companion" },
  { source: "ummsulaym", target: "muhammad", type: "companion" },
  { source: "nusayba", target: "muhammad", type: "companion" },
  { source: "rufayda", target: "muhammad", type: "companion" },
  { source: "khansa", target: "muhammad", type: "companion" },
  { source: "abdullahsalam", target: "muhammad", type: "companion" },
  { source: "khalidsaid", target: "muhammad", type: "companion" },
  { source: "abubasir", target: "muhammad", type: "companion" },
  { source: "habibsahmi", target: "muhammad", type: "companion" },
  { source: "ikrimah", target: "muhammad", type: "companion" },

  // Khalid is son of Walid (opponent → ally line)
  { source: "walid", target: "khalid", type: "parent" },

  // Ikrimah is son of Abu Jahl
  { source: "abujahl", target: "ikrimah", type: "parent" },

  // Abu Sufyan's family
  { source: "abusufyan", target: "hind", type: "spouse" },
  { source: "abusufyan", target: "ummhabiba", type: "parent" },
  { source: "abusufyan", target: "muhammad", type: "opponent" },
  { source: "hind", target: "muhammad", type: "opponent" },

  // Mecca's opponents
  { source: "abujahl", target: "muhammad", type: "opponent" },
  { source: "utbah", target: "muhammad", type: "opponent" },
  { source: "shayba", target: "muhammad", type: "opponent" },
  { source: "walid", target: "muhammad", type: "opponent" },
  { source: "umayya", target: "muhammad", type: "opponent" },
  { source: "uqba", target: "muhammad", type: "opponent" },
  { source: "nadr", target: "muhammad", type: "opponent" },
  { source: "ummjamil", target: "muhammad", type: "opponent" },
  { source: "musaylimah", target: "muhammad", type: "opponent" },
  { source: "kab_ashraf", target: "muhammad", type: "opponent" },
  { source: "huyayy", target: "muhammad", type: "opponent" },
  { source: "khosrau", target: "muhammad", type: "opponent" },

  // Family connections among opponents
  { source: "utbah", target: "shayba", type: "sibling" },
  { source: "utbah", target: "hind", type: "parent" },
  { source: "huyayy", target: "safiyya_wife", type: "parent" },

  // Allies / non-Muslim friendly figures
  { source: "waraqah", target: "muhammad", type: "ally" },
  { source: "negus", target: "muhammad", type: "ally" },
  { source: "heraclius", target: "muhammad", type: "ally" },
  { source: "muqawqis", target: "muhammad", type: "ally" },
  { source: "muthim", target: "muhammad", type: "ally" },
  { source: "mukhayriq", target: "muhammad", type: "ally" },
  { source: "suhayl", target: "muhammad", type: "opponent" },
  { source: "urwa", target: "muhammad", type: "ally" },

  // Khadijah's relatives
  { source: "waraqah", target: "khadijah", type: "cousin" },

  // Khalid ibn al-Walid is nephew of Maymuna
  { source: "maymuna", target: "khalid", type: "aunt" },
  { source: "maymuna", target: "ibnabbas", type: "aunt" },

  // Fatimah bint al-Khattab brought Umar to Islam
  { source: "fatimakhattab", target: "umar", type: "sibling" },

  // Sa'd ibn Abi Waqqas is maternal uncle of the Prophet
  { source: "sadwaqqas", target: "muhammad", type: "uncle" }
];

// ── TIMELINE EVENTS ─────────────────────────────────────────────────
const EVENTS = [
  { year: 570, age: 0, title: "Year of the Elephant", body: "Muhammad ﷺ is born in Mecca on a Monday in the month of Rabi' al-Awwal, in the year Abrahah's army attempts to destroy the Ka'bah and is repelled. His father Abdullah had already passed away a few months earlier." },
  { year: 576, age: 6, title: "Death of his mother", body: "Aminah dies at Abwa while returning from a visit to her family in Yathrib. Muhammad ﷺ is brought back to Mecca by Umm Ayman." },
  { year: 578, age: 8, title: "Death of his grandfather", body: "Abd al-Muttalib dies and the Prophet ﷺ enters the household of his uncle Abu Talib, who would protect him for the next four decades." },
  { year: 583, age: 12, title: "Journey to Syria with Abu Talib", body: "The young Muhammad ﷺ accompanies his uncle on a trading caravan to Bostra, where the Christian monk Bahira reportedly recognises signs of prophethood in him." },
  { year: 595, age: 25, title: "Marriage to Khadijah", body: "After leading a successful trading caravan to Syria on her behalf, Muhammad ﷺ marries Khadijah bint Khuwaylid, who was about 15 years his elder. Their marriage lasts 25 years until her death." },
  { year: 605, age: 35, title: "Rebuilding of the Ka'bah", body: "After a flood damages the Ka'bah, Quraysh rebuilds it. A dispute over who should place the Black Stone is resolved when Muhammad ﷺ has the chiefs lift it together on a cloak." },
  { year: 610, age: 40, title: "The First Revelation", body: "In the cave of Hira on Mount Nur, the angel Jibril appears and commands him to 'Read!' The first verses of Surah al-'Alaq are revealed. Khadijah and Waraqah ibn Nawfal confirm the experience." },
  { year: 613, age: 43, title: "Public preaching begins", body: "After three years of preaching privately, the Prophet ﷺ openly calls Quraysh to Islam from Mount Safa. Most of the leaders, including his uncle Abu Lahab, reject him." },
  { year: 615, age: 45, title: "First Migration to Abyssinia", body: "A small group of persecuted Muslims, led by Ja'far ibn Abi Talib, emigrate across the Red Sea and find protection under the Christian king An-Najashi." },
  { year: 616, age: 46, title: "Conversion of Umar and Hamza", body: "Hamza ibn Abd al-Muttalib and then Umar ibn al-Khattab embrace Islam within days of each other, dramatically strengthening the small Muslim community." },
  { year: 617, age: 47, title: "Boycott of Banu Hashim", body: "Quraysh imposes a total social and economic boycott on the Prophet's clan, confining them to a valley for nearly three years. The boycott pact ends when it is found eaten by worms except for the name of God." },
  { year: 619, age: 49, title: "The Year of Sorrow", body: "Abu Talib dies, followed soon after by Khadijah. The Prophet ﷺ loses both his protector and his closest companion in a single year." },
  { year: 619, age: 49, title: "Journey to Ta'if", body: "Seeking a new base of support, the Prophet ﷺ travels to Ta'if but is mocked and stoned. He returns to Mecca only after Mut'im ibn Adi extends his personal protection." },
  { year: 620, age: 50, title: "Al-Isra wal-Mi'raj", body: "The Prophet ﷺ is taken on a night journey from Mecca to Jerusalem and ascended through the heavens. The five daily prayers are prescribed." },
  { year: 621, age: 51, title: "First Pledge of Aqaba", body: "Twelve men from Yathrib pledge allegiance to the Prophet ﷺ at Aqaba. Mus'ab ibn Umayr is sent to teach Islam in their city." },
  { year: 622, age: 52, title: "The Hijra to Medina", body: "Pursued by Qurayshi assassins, the Prophet ﷺ and Abu Bakr hide in the Cave of Thawr, then travel north. The Islamic calendar begins from this migration to Yathrib, renamed al-Madina." },
  { year: 623, age: 53, title: "Constitution of Medina", body: "The Prophet ﷺ establishes a pact between the Muhajirun, the Ansar, and the Jewish tribes of Medina, defining one of the earliest written constitutions." },
  { year: 624, age: 54, title: "Battle of Badr", body: "313 Muslims defeat a Meccan force of about a thousand. Abu Jahl is killed; many Qurayshi leaders are captured or slain." },
  { year: 625, age: 55, title: "Battle of Uhud", body: "The Muslims are defeated after archers abandon their post. Hamza is martyred and the Prophet ﷺ is wounded. Mus'ab ibn Umayr also dies." },
  { year: 627, age: 57, title: "Battle of the Trench (Khandaq)", body: "On Salman al-Farsi's advice, the Muslims dig a trench to defend Medina from a coalition of Quraysh and allied tribes. The siege fails after a storm scatters the besieging army." },
  { year: 628, age: 58, title: "Treaty of Hudaybiyyah", body: "The Prophet ﷺ sets out for the Lesser Pilgrimage but is barred from Mecca. The resulting ten-year truce, seen as a setback at first, opens Arabia to the message of Islam." },
  { year: 628, age: 58, title: "Letters to kings", body: "The Prophet ﷺ sends envoys with letters to Heraclius, Khosrau, the Negus, and the Muqawqis, inviting them to Islam." },
  { year: 629, age: 59, title: "Battle of Khaybar", body: "The Muslims capture the Jewish fortresses of Khaybar; Safiyya bint Huyayy is freed and married to the Prophet ﷺ." },
  { year: 629, age: 59, title: "Battle of Mu'tah", body: "A Muslim force meets the Byzantines on the Syrian frontier. Zayd ibn Harithah, Ja'far ibn Abi Talib, and Abdullah ibn Rawahah are all martyred; Khalid ibn al-Walid takes command and saves the army." },
  { year: 630, age: 60, title: "Conquest of Mecca", body: "After Quraysh breaks Hudaybiyyah, the Prophet ﷺ enters Mecca almost without bloodshed and clears the Ka'bah of idols. He grants general amnesty to most of his former enemies." },
  { year: 630, age: 60, title: "Battle of Hunayn and siege of Ta'if", body: "The newly Muslim Meccans join an expedition that defeats the Hawazin tribes at Hunayn and then unsuccessfully besieges Ta'if. Ta'if accepts Islam the following year." },
  { year: 631, age: 61, title: "Year of Delegations", body: "Tribes from across the Arabian peninsula send delegations to Medina to embrace Islam. The Prophet ﷺ sends teachers throughout Arabia." },
  { year: 632, age: 62, title: "The Farewell Pilgrimage", body: "The Prophet ﷺ leads about 124,000 pilgrims in the Hajj and delivers his Farewell Sermon at Arafat, declaring the completion of his message." },
  { year: 632, age: 63, title: "Death of the Prophet ﷺ", body: "After a short illness, the Prophet ﷺ passes away on Monday in Rabi' al-Awwal 11 AH, in the apartment of Aisha. Abu Bakr is chosen as the first caliph." }
];
