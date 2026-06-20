(() => {
  "use strict";

  const LOGICAL_W = 960;
  const LOGICAL_H = 640;
  const TILE = 32;
  const SAVE_KEY = "akari-pilgrimage-save-v1";
  const SETTINGS_KEY = "akari-pilgrimage-settings-v1";
  const VERSION = 1;

  const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  const DIR_ORDER = ["down", "left", "right", "up"];
  const ELEMENT_LABEL = {
    neutral: "無",
    fire: "火",
    ice: "氷",
    light: "光",
    storm: "雷",
  };

  const STATUS_LABEL = {
    poison: "毒",
    sleep: "睡眠",
    guard: "防御",
  };

  const TEXT = {
    ui: {
      newGame: "はじめから",
      continue: "つづきから",
      load: "ロード",
      save: "セーブ",
      close: "閉じる",
      back: "戻る",
      next: "次へ",
      yes: "はい",
      no: "いいえ",
      menu: "メニュー",
      items: "所持品",
      status: "ステータス",
      equip: "装備",
      formation: "隊列",
      settings: "設定",
      buy: "買う",
      sell: "売る",
      inn: "宿",
      gold: "G",
      attack: "攻撃",
      skill: "特技",
      item: "道具",
      guard: "防御",
      run: "にげる",
      target: "対象",
      empty: "何もありません。",
      noSave: "セーブデータがありません。新しく始められます。",
      brokenSave: "セーブデータを読み込めませんでした。新しく始められます。",
      saved: "セーブしました。",
      loaded: "ロードしました。",
      audioOn: "音 ON",
      audioOff: "音 OFF",
      volume: "音量",
      reducedMotion: "演出控えめ",
      on: "ON",
      off: "OFF",
      hp: "HP",
      mp: "MP",
      exp: "EXP",
      level: "Lv",
      weapon: "武器",
      armor: "防具",
      skills: "習得",
      use: "使う",
      owned: "所持",
      price: "価格",
      sellPrice: "売値",
      notEnoughGold: "所持金が足りません。",
      cannotSell: "これは売れません。",
      fullHp: "今は使う必要がありません。",
      gameOver: "全滅しました。",
      revive: "灯丘の里で目を覚ましました。",
      clear: "クリア",
    },
    title: {
      name: "灯晶の巡礼",
      subtitle: "失われた星灯りを取り戻す、三人の小さな旅。",
    },
    intro: [
      { speaker: "語り", text: "夜を守る灯晶が、黒曜塔へ奪われた。" },
      { speaker: "エルナ", text: "里の灯が細っている。長老に話を聞こう。" },
    ],
    endingShared: [
      { speaker: "語り", text: "星喰いの鏡は砕け、灯晶は夜空へ還った。" },
      { speaker: "語り", text: "港へ分けた青い灯は、迷う船と旅人を照らし続けた。" },
      { speaker: "ミオ", text: "ひとつの灯を守るより、分け合った灯のほうが遠くまで届くんだね。" },
    ],
    endingKept: [
      { speaker: "語り", text: "星喰いの鏡は砕け、灯晶は里へ戻った。" },
      { speaker: "語り", text: "蓄えられた青い灯は、長い冬の夜をしのぐ力になった。" },
      { speaker: "カイ", text: "選んだ道に迷いはない。次は、分けられるだけ強くなろう。" },
    ],
  };

  const COLORS = {
    grass: 0x4b8c54,
    grass2: 0x3f7a4a,
    path: 0xb99b62,
    stone: 0x7e8790,
    floor: 0x5b6370,
    wall: 0x26303c,
    tree: 0x1f5c3b,
    water: 0x2d6f9f,
    roof: 0x874c3f,
    wood: 0x8a603c,
    cave: 0x3a3942,
    caveFloor: 0x61606a,
    tower: 0x2c2d39,
    towerFloor: 0x46495c,
    switchOff: 0x5d5966,
    switchOn: 0xe5c76b,
  };

  const TILE_INFO = {
    g: { color: COLORS.grass, alt: COLORS.grass2, blocked: false, encounter: true },
    p: { color: COLORS.path, blocked: false, encounter: false },
    s: { color: COLORS.stone, blocked: false, encounter: false },
    f: { color: COLORS.floor, blocked: false, encounter: false },
    c: { color: COLORS.caveFloor, blocked: false, encounter: true },
    d: { color: COLORS.towerFloor, blocked: false, encounter: true },
    t: { color: COLORS.tree, blocked: true, encounter: false },
    w: { color: COLORS.water, blocked: true, encounter: false },
    r: { color: COLORS.roof, blocked: true, encounter: false },
    x: { color: COLORS.cave, blocked: true, encounter: false },
    b: { color: COLORS.wall, blocked: true, encounter: false },
    m: { color: COLORS.wall, blocked: true, encounter: false },
    q: { color: COLORS.switchOff, blocked: false, encounter: false },
    o: { color: COLORS.tower, blocked: true, encounter: false },
  };

  const ITEMS = {
    herb: {
      name: "若葉の薬",
      type: "consumable",
      price: 18,
      desc: "味方1人のHPを35回復。",
      use: { kind: "healHp", power: 35 },
    },
    highHerb: {
      name: "陽だまり薬",
      type: "consumable",
      price: 55,
      desc: "味方1人のHPを75回復。",
      use: { kind: "healHp", power: 75 },
    },
    tonic: {
      name: "月露の小瓶",
      type: "consumable",
      price: 34,
      desc: "味方1人のMPを18回復。",
      use: { kind: "healMp", power: 18 },
    },
    antidote: {
      name: "清め草",
      type: "consumable",
      price: 22,
      desc: "毒を治す。",
      use: { kind: "cure", status: "poison" },
    },
    wakeBell: {
      name: "目覚め鈴",
      type: "consumable",
      price: 24,
      desc: "睡眠を治す。",
      use: { kind: "cure", status: "sleep" },
    },
    smoke: {
      name: "煙玉",
      type: "consumable",
      price: 38,
      desc: "戦闘から離脱する。ボスには無効。",
      use: { kind: "escape" },
    },
    pilgrimBlade: {
      name: "巡礼の短剣",
      type: "equipment",
      slot: "weapon",
      starter: true,
      price: 0,
      sellable: false,
      allowed: ["elna"],
      stats: { atk: 4 },
      desc: "エルナの古い短剣。",
    },
    watchSpear: {
      name: "見張り槍",
      type: "equipment",
      slot: "weapon",
      starter: true,
      price: 0,
      sellable: false,
      allowed: ["kai"],
      stats: { atk: 5 },
      desc: "カイの使い慣れた槍。",
    },
    tideRod: {
      name: "潮読みの杖",
      type: "equipment",
      slot: "weapon",
      starter: true,
      price: 0,
      sellable: false,
      allowed: ["mio"],
      stats: { atk: 2, mag: 5 },
      desc: "ミオの灯読み用の杖。",
    },
    ironBlade: {
      name: "黒鉄の刃",
      type: "equipment",
      slot: "weapon",
      price: 130,
      allowed: ["elna", "kai"],
      stats: { atk: 8 },
      desc: "素直で扱いやすい武器。",
    },
    emberSpear: {
      name: "火継ぎ槍",
      type: "equipment",
      slot: "weapon",
      price: 220,
      allowed: ["kai"],
      stats: { atk: 10, mag: 2 },
      element: "fire",
      desc: "通常攻撃に火属性を帯びる。",
    },
    moonRod: {
      name: "月澄みの杖",
      type: "equipment",
      slot: "weapon",
      price: 210,
      allowed: ["mio"],
      stats: { atk: 3, mag: 9 },
      element: "ice",
      desc: "氷の術を強める杖。",
    },
    starEdge: {
      name: "星縁の刃",
      type: "equipment",
      slot: "weapon",
      price: 0,
      sellable: false,
      allowed: ["elna"],
      stats: { atk: 13, mag: 5 },
      element: "light",
      desc: "星喰いの結界を裂く短剣。",
    },
    cotton: {
      name: "旅布の服",
      type: "equipment",
      slot: "armor",
      starter: true,
      price: 0,
      sellable: false,
      allowed: ["elna", "kai", "mio"],
      stats: { def: 2 },
      desc: "軽い旅装。",
    },
    leather: {
      name: "硬革の上着",
      type: "equipment",
      slot: "armor",
      price: 95,
      allowed: ["elna", "kai"],
      stats: { def: 5, hp: 5 },
      desc: "探索向きの防具。",
    },
    chain: {
      name: "鎖編みの胸当て",
      type: "equipment",
      slot: "armor",
      price: 180,
      allowed: ["elna", "kai"],
      stats: { def: 8, hp: 10, spd: -1 },
      desc: "重いが頼れる防具。",
    },
    tideCloak: {
      name: "潮灯の外套",
      type: "equipment",
      slot: "armor",
      price: 0,
      sellable: false,
      allowed: ["elna", "mio"],
      stats: { def: 5, mag: 3, mp: 6 },
      desc: "港の灯を分けた証。",
    },
    robe: {
      name: "星読みのローブ",
      type: "equipment",
      slot: "armor",
      price: 170,
      allowed: ["mio"],
      stats: { def: 4, mag: 5, mp: 8 },
      desc: "術者向きの防具。",
    },
    oldKey: {
      name: "古い鍵",
      type: "key",
      price: 0,
      sellable: false,
      desc: "雫の洞窟の奥扉を開ける。",
    },
    blueCrystal: {
      name: "青の灯晶",
      type: "key",
      price: 0,
      sellable: false,
      desc: "水脈の灯を宿す結晶。",
    },
    starHerb: {
      name: "星露草",
      type: "key",
      price: 0,
      sellable: false,
      desc: "夜だけ淡く光る薬草。",
    },
  };

  const SKILLS = {
    heal: {
      name: "灯癒",
      mp: 4,
      kind: "heal",
      target: "ally",
      power: 34,
      element: "light",
      desc: "HPを回復。",
    },
    strongerHeal: {
      name: "星灯癒",
      mp: 8,
      kind: "heal",
      target: "ally",
      power: 68,
      element: "light",
      desc: "HPを大きく回復。",
    },
    spark: {
      name: "雷灯",
      mp: 6,
      kind: "damage",
      target: "enemy",
      power: 29,
      element: "storm",
      stat: "mag",
      desc: "雷属性の術。",
    },
    fireSlash: {
      name: "火打ち",
      mp: 5,
      kind: "damage",
      target: "enemy",
      power: 28,
      element: "fire",
      stat: "atk",
      desc: "火属性の一撃。",
    },
    iceNeedle: {
      name: "氷針",
      mp: 5,
      kind: "damage",
      target: "enemy",
      power: 27,
      element: "ice",
      stat: "mag",
      desc: "氷属性の術。",
    },
    sleepMist: {
      name: "眠り霞",
      mp: 5,
      kind: "status",
      target: "enemy",
      status: "sleep",
      chance: 0.66,
      turns: 2,
      element: "ice",
      desc: "敵を眠らせる。",
    },
    starRay: {
      name: "星光",
      mp: 7,
      kind: "damage",
      target: "enemy",
      power: 34,
      element: "light",
      stat: "mag",
      desc: "光属性の術。",
    },
    poisonFang: {
      name: "毒の裂き目",
      mp: 0,
      kind: "damageStatus",
      target: "ally",
      power: 17,
      element: "neutral",
      stat: "atk",
      status: "poison",
      chance: 0.42,
      turns: 5,
      desc: "毒を伴う攻撃。",
    },
    sleepGaze: {
      name: "眠りの鏡面",
      mp: 0,
      kind: "status",
      target: "ally",
      status: "sleep",
      chance: 0.52,
      turns: 2,
      element: "light",
      desc: "睡眠を誘う。",
    },
    obsidianRay: {
      name: "黒曜の光",
      mp: 0,
      kind: "damage",
      target: "ally",
      power: 28,
      element: "light",
      stat: "mag",
      desc: "光属性の攻撃。",
    },
  };

  const ACTORS = {
    elna: {
      name: "エルナ",
      color: 0xffd56d,
      base: { hp: 44, mp: 14, atk: 9, def: 7, mag: 8, spd: 8 },
      growth: { hp: 10, mp: 4, atk: 3, def: 2, mag: 2, spd: 1 },
      start: { weapon: "pilgrimBlade", armor: "cotton" },
      learns: [
        { level: 2, skill: "heal" },
        { level: 4, skill: "spark" },
      ],
    },
    kai: {
      name: "カイ",
      color: 0x87c7ff,
      base: { hp: 56, mp: 8, atk: 12, def: 10, mag: 3, spd: 5 },
      growth: { hp: 12, mp: 2, atk: 3, def: 3, mag: 1, spd: 1 },
      start: { weapon: "watchSpear", armor: "cotton" },
      learns: [
        { level: 3, skill: "fireSlash" },
      ],
    },
    mio: {
      name: "ミオ",
      color: 0xd9a5ff,
      base: { hp: 38, mp: 26, atk: 5, def: 5, mag: 13, spd: 9 },
      growth: { hp: 8, mp: 6, atk: 1, def: 2, mag: 3, spd: 1 },
      start: { weapon: "tideRod", armor: "cotton" },
      learns: [
        { level: 1, skill: "heal" },
        { level: 1, skill: "iceNeedle" },
        { level: 4, skill: "sleepMist" },
        { level: 5, skill: "starRay" },
        { level: 6, skill: "strongerHeal" },
      ],
    },
  };

  const ENEMIES = {
    dew: {
      name: "露影",
      color: 0x81d3f7,
      level: 1,
      hp: 22,
      atk: 7,
      def: 3,
      mag: 3,
      spd: 4,
      exp: 8,
      gold: 8,
      weak: { fire: 1.35, light: 1.2 },
      res: { ice: 0.7 },
      actions: [{ type: "attack", weight: 1 }],
    },
    thorn: {
      name: "棘の残響",
      color: 0x8fcf73,
      level: 2,
      hp: 28,
      atk: 8,
      def: 4,
      mag: 4,
      spd: 7,
      exp: 11,
      gold: 10,
      weak: { fire: 1.45 },
      actions: [
        { type: "attack", weight: 4 },
        { type: "skill", skill: "poisonFang", weight: 1 },
      ],
    },
    caveShade: {
      name: "洞の薄影",
      color: 0x9787c9,
      level: 3,
      hp: 36,
      atk: 11,
      def: 6,
      mag: 6,
      spd: 7,
      exp: 17,
      gold: 14,
      weak: { light: 1.45, storm: 1.25 },
      res: { ice: 0.75 },
      actions: [
        { type: "attack", weight: 3 },
        { type: "skill", skill: "sleepGaze", weight: 1 },
      ],
    },
    ore: {
      name: "鉱脈の番片",
      color: 0xa9a9a9,
      level: 3,
      hp: 44,
      atk: 12,
      def: 9,
      mag: 4,
      spd: 3,
      exp: 18,
      gold: 18,
      weak: { storm: 1.55 },
      res: { neutral: 0.85, fire: 0.8 },
      actions: [{ type: "attack", weight: 1 }],
    },
    tideKeeper: {
      name: "潮鍵の番人",
      color: 0x5ab1d3,
      level: 4,
      hp: 132,
      atk: 15,
      def: 9,
      mag: 7,
      spd: 6,
      exp: 72,
      gold: 85,
      boss: true,
      weak: { storm: 1.65, light: 1.25 },
      res: { ice: 0.7 },
      actions: [
        { type: "attack", weight: 4 },
        { type: "skill", skill: "poisonFang", weight: 1 },
      ],
    },
    mask: {
      name: "塔の仮面",
      color: 0xd0b277,
      level: 5,
      hp: 58,
      atk: 16,
      def: 8,
      mag: 12,
      spd: 8,
      exp: 26,
      gold: 24,
      weak: { ice: 1.45, light: 1.2 },
      res: { fire: 0.75 },
      actions: [
        { type: "attack", weight: 2 },
        { type: "skill", skill: "sleepGaze", weight: 1 },
      ],
    },
    obsidian: {
      name: "黒曜兵",
      color: 0x6d7485,
      level: 5,
      hp: 66,
      atk: 18,
      def: 12,
      mag: 7,
      spd: 5,
      exp: 29,
      gold: 28,
      weak: { fire: 1.35, storm: 1.3 },
      res: { neutral: 0.85 },
      actions: [{ type: "attack", weight: 1 }],
    },
    finalMirror: {
      name: "星喰いの鏡",
      color: 0xeeecff,
      level: 7,
      hp: 310,
      atk: 21,
      def: 13,
      mag: 17,
      spd: 7,
      exp: 0,
      gold: 0,
      boss: true,
      final: true,
      weak: {},
      res: { neutral: 0.9 },
      actions: [
        { type: "attack", weight: 3 },
        { type: "skill", skill: "sleepGaze", weight: 1 },
        { type: "skill", skill: "obsidianRay", weight: 2 },
      ],
    },
  };

  const ENCOUNTERS = {
    field: [
      { enemies: ["dew", "dew"], weight: 4 },
      { enemies: ["thorn"], weight: 3 },
      { enemies: ["dew", "thorn"], weight: 2 },
    ],
    cave: [
      { enemies: ["caveShade"], weight: 3 },
      { enemies: ["dew", "ore"], weight: 3 },
      { enemies: ["caveShade", "ore"], weight: 2 },
    ],
    tower: [
      { enemies: ["mask"], weight: 3 },
      { enemies: ["obsidian"], weight: 3 },
      { enemies: ["mask", "obsidian"], weight: 2 },
    ],
    midBoss: [{ enemies: ["tideKeeper"], weight: 1 }],
    final: [{ enemies: ["finalMirror"], weight: 1 }],
  };

  const SHOPS = {
    lumina: {
      name: "灯丘の道具屋",
      items: ["herb", "tonic", "antidote", "smoke", "leather", "ironBlade"],
    },
    port: {
      name: "塩風の市",
      items: ["herb", "highHerb", "tonic", "wakeBell", "antidote", "smoke", "chain", "robe", "emberSpear", "moonRod"],
    },
  };

  const DOM = {};
  let app;
  let root;
  let mapLayer;
  let entityLayer;
  let playerLayer;
  let battleLayer;
  let playerSprite;
  let followerSprites = [];
  let mode = "boot";
  let game = null;
  let dialogue = null;
  let battle = null;
  let moving = null;
  let mapDirty = false;
  let toastTimer = 0;
  let deferredFieldAction = null;
  let pressed = new Set();
  let audio;
  let settings = loadSettings();

  function createMaps() {
    return {
      lumina: mapDef({
        id: "lumina",
        name: "灯丘の里",
        kind: "town",
        rows: [
          "tttttttttttttttttttttttttttttt",
          "tggggggggggggggggggggggggggggt",
          "tgggssssssggggggggssssssgggggt",
          "tgggsrrrrsgggpgggggsrrrrsggggt",
          "tgggsrrrrsgggpgggggsrrrrsggggt",
          "tgggssssssgggpppgggssssssggggt",
          "tggggggggggggpgggggggggggggggt",
          "tggggggggppppppppppggggggggggt",
          "tggssssggpggggggggpggssssggggt",
          "tggrrrrggpggggggggpggrrrrggggt",
          "tggrrrrggpgggssgggpggrrrrggggt",
          "tggssssggppppssppppggssssggggt",
          "tggggggggggggppggggggggggggggt",
          "tgggggwwwwwggppggwwwwwgggggggt",
          "tgggggwwwwwggppggwwwwwgggggggt",
          "tggggggggggggppggggggggggggggt",
          "tggggggggggggppggggggggggggggt",
          "tggggggggggggppggggggggggggggt",
          "tggggggggggggppggggggggggggggt",
          "tttttttttttttppptttttttttttttt",
        ],
        events: [
          evt("elder", "npc", 14, 7, "elder", true),
          evt("kai", "npc", 11, 8, "kai", true),
          evt("shop_lumina", "npc", 6, 5, "shop:lumina", true, { label: "店" }),
          evt("inn_lumina", "npc", 23, 5, "inn:lumina", true, { label: "宿" }),
          evt("save_lumina", "save", 16, 10, "save", false),
          evt("side_lumina", "npc", 5, 12, "sidequest", true),
          evt("chest_lumina", "chest", 23, 12, "chest:lumina", true, { item: "herb", qty: 2 }),
          evt("to_world_from_lumina", "transition", 14, 19, "transition:world", false, { to: { map: "world", x: 7, y: 13 } }),
          evt("to_world_from_lumina2", "transition", 15, 19, "transition:world", false, { to: { map: "world", x: 7, y: 13 } }),
          evt("to_world_from_lumina3", "transition", 16, 19, "transition:world", false, { to: { map: "world", x: 7, y: 13 } }),
        ],
      }),
      port: mapDef({
        id: "port",
        name: "塩風の港",
        kind: "town",
        rows: [
          "tttttttttttttttttttttttttttttt",
          "tgggggggggggggggggggggggwwwwwt",
          "tggssssssggggggggssssgggwwwwwt",
          "tggrrrrrsgggppgggsrrrsggwwwwwt",
          "tggrrrrrsgggppgggsrrrsggwwwwwt",
          "tggssssssgggppgggssssgggwwwwwt",
          "tgggggggggggppggggggggggwwwwwt",
          "tggggggpppppppppppppggggwwwwwt",
          "tggsssspgsssssssggpgggggwwwwwt",
          "tggrrrrpgsrrrrrsggpgggggwwwwwt",
          "tggrrrrpgsrrrrrsggpppppppppppt",
          "tggsssspgsssssssggggggggwwwwwt",
          "tggggggpggggggggggggggggwwwwwt",
          "tggggggpggggggssssggggggwwwwwt",
          "tggggggpggggggrrrrggggggwwwwwt",
          "tggggggpppppppssssppppppwwwwwt",
          "tgggggggggggggggggggggggwwwwwt",
          "tgggggggggggggggggggggggwwwwwt",
          "tgggggggggggggggggggggggwwwwwt",
          "tttttttttttttppptttttttttttttt",
        ],
        events: [
          evt("mayor", "npc", 14, 9, "mayor", true),
          evt("mio", "npc", 24, 10, "mio", true),
          evt("shop_port", "npc", 7, 9, "shop:port", true, { label: "市" }),
          evt("inn_port", "npc", 14, 15, "inn:port", true, { label: "宿" }),
          evt("save_port", "save", 18, 13, "save", false),
          evt("port_sailor", "npc", 23, 15, "sailor", true),
          evt("to_world_from_port", "transition", 14, 19, "transition:world", false, { to: { map: "world", x: 24, y: 14 } }),
          evt("to_world_from_port2", "transition", 15, 19, "transition:world", false, { to: { map: "world", x: 24, y: 14 } }),
          evt("to_world_from_port3", "transition", 16, 19, "transition:world", false, { to: { map: "world", x: 24, y: 14 } }),
        ],
      }),
      world: mapDef({
        id: "world",
        name: "星風の道",
        kind: "field",
        encounter: "field",
        rate: 0.055,
        rows: [
          "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
          "mggggggggggggggggggggggggggggm",
          "mgggggtttgggggggggggggtttggggm",
          "mgggtttttggggggggggggtttttgggm",
          "mgggtttttggggggwwggggtttttgggm",
          "mgggggtttgggggwwwwggggtttggggm",
          "mggggggggggggwwwwwwggggggggggm",
          "mgggggpppppppppppppppppggggggm",
          "mgggggpggggggwwwwggggpgggggggm",
          "mgggggpggmmmmgwwgmmmmgpggggggm",
          "mgggggpggmccmgwwgmccmgpggggggm",
          "mgggggpppmmmmgwwgmmmmpppgggggm",
          "mggggggpgggggggggggggpgggggggm",
          "mggggggpggggttttgggggpgggggggm",
          "mggggggpppppppppppppppgggggggm",
          "mgggggggggggttttgggggggggggggm",
          "mggggggggggggggggggggggggggggm",
          "mggggggggggggggggggggggggggggm",
          "mggggggggggggggggggggggggggggm",
          "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
        ],
        events: [
          evt("world_lumina", "transition", 7, 13, "transition:lumina", false, { to: { map: "lumina", x: 15, y: 18 }, label: "里" }),
          evt("world_cave", "transition", 10, 7, "transition:cave", false, { to: { map: "cave", x: 3, y: 18 }, label: "洞" }),
          evt("world_port", "transition", 24, 14, "transition:port", false, { to: { map: "port", x: 15, y: 18 }, label: "港" }),
          evt("world_tower", "transition", 21, 7, "transition:tower", false, { to: { map: "tower", x: 15, y: 18 }, label: "塔" }),
        ],
      }),
      cave: mapDef({
        id: "cave",
        name: "雫の洞窟",
        kind: "dungeon",
        encounter: "cave",
        rate: 0.08,
        rows: [
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          "xxccccccccxxxxxxxccccccccccxx",
          "xxcxxxxxxcxxxxxxxcxxxxxxxxcxx",
          "xxcxxxxxxccccccccccccccxxxcxx",
          "xxcxxccccccxxxxxxcccccxxxccxx",
          "xxcxxcxxxxcxxxxxxcxxxccccccxx",
          "xxccccccccccccccccccccccccccxx",
          "xxccccccccccccqcccccxxxxxxccxx",
          "xxcxxxxxxxcxxxxxxcxxxxxxxccxx",
          "xxccccccccccccccccccccccccccxx",
          "xxcxxxxxxxxxxxxxxcxxxxxxxxccxx",
          "xxcxxxxccccccccxxcxxxxxxxxccxx",
          "xxcxxxxccccccccccccccccccccxx",
          "xxcxxxxcxxxxxxxxxxxxxxxxxxxcxx",
          "xxccccccxxxxxxxxxxxxxxxxxxxcxx",
          "xxccccccccccccccccccccccccccxx",
          "xxccccccccccccccccccccccccccxx",
          "xxcxxxxxxxxxxxxxxxxxxxxxxxxcxx",
          "xxccccccccccccccccccccccccccxx",
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        ],
        events: [
          evt("cave_exit", "transition", 3, 18, "transition:world", false, { to: { map: "world", x: 10, y: 8 } }),
          evt("chest_key", "chest", 6, 4, "chest:key", true, { item: "oldKey", qty: 1 }),
          evt("chest_starherb", "chest", 9, 12, "chest:starHerb", true, { item: "starHerb", qty: 1 }),
          evt("cave_rock", "rock", 9, 7, "rock:cave", true),
          evt("cave_switch", "switch", 14, 7, "switch:cave", false),
          evt("cave_gate", "gate", 16, 7, "gate:cave", true),
          evt("cave_door", "door", 21, 3, "door:cave", true),
          evt("midboss", "boss", 22, 3, "boss:mid", true),
        ],
      }),
      tower: mapDef({
        id: "tower",
        name: "黒曜塔",
        kind: "dungeon",
        encounter: "tower",
        rate: 0.085,
        rows: [
          "oooooooooooooooooooooooooooooo",
          "ooddddddddddddddddddddddddddoo",
          "oodoooooodoooooooodoooooooodoo",
          "oodoodddddddddddddddddddooddoo",
          "oodoodoooooodoooodoooooodoodoo",
          "oodddddooooddddddddoooodddddoo",
          "oooooodoooodoooooodoooodoooooo",
          "ooddddddddddooooodddddddddddoo",
          "oodoooooooddddddddddooooooodoo",
          "oodddddddddoooooddddddddddddoo",
          "oooooooddooddddddddoooooooddoo",
          "oodddddddoodooooooddddddddddoo",
          "oodoooooodddddddddddooooooodoo",
          "ooddddddddddooooodddddddddddoo",
          "oodoooooddddddddddddddoooooodo",
          "ooddddddddooooooooodddddddddoo",
          "oodoooooodddddddddddooooooodoo",
          "ooddddddddddddddddddddddddddoo",
          "ooddddddddddddddddddddddddddoo",
          "oooooooooooooodddooooooooooooo",
        ],
        events: [
          evt("tower_exit", "transition", 15, 19, "transition:world", false, { to: { map: "world", x: 21, y: 8 } }),
          evt("chest_starEdge", "chest", 5, 3, "chest:starEdge", true, { item: "starEdge", qty: 1 }),
          evt("chest_tower_heal", "chest", 25, 15, "chest:towerHeal", true, { item: "highHerb", qty: 2 }),
          evt("final_boss", "boss", 15, 1, "boss:final", true),
        ],
      }),
    };
  }

  function mapDef(def) {
    const rows = def.rows.map((row) => row.replaceAll(" ", "x").padEnd(30, "x").slice(0, 30));
    return { ...def, rows, width: 30, height: 20 };
  }

  function evt(id, type, x, y, action, solid, extra = {}) {
    return { id, type, x, y, action, solid, ...extra };
  }

  const MAPS = createMaps();

  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.timer = 0;
      this.step = 0;
      this.current = "";
      this.enabled = Boolean(settings.audioOn);
      this.volume = Number(settings.volume ?? 0.35);
      this.tracks = {
        field: [392, 440, 494, 587, 494, 440, 392, 330, 392, 494, 523, 494],
        battle: [196, 247, 262, 330, 294, 247, 220, 247, 330, 392, 330, 294],
        ending: [330, 392, 440, 523, 587, 523, 440, 392, 330, 392, 494, 523],
      };
    }

    ensure() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.enabled ? this.volume * 0.22 : 0;
      this.master.connect(this.ctx.destination);
    }

    resume() {
      this.ensure();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    }

    setEnabled(value) {
      this.enabled = value;
      settings.audioOn = value;
      saveSettings();
      this.ensure();
      if (!this.ctx) return;
      this.resume();
      this.master.gain.setTargetAtTime(value ? this.volume * 0.22 : 0, this.ctx.currentTime, 0.03);
      if (value && this.current) this.startLoop();
      if (!value) this.stopLoop();
    }

    setVolume(value) {
      this.volume = Math.max(0, Math.min(1, value));
      settings.volume = this.volume;
      saveSettings();
      if (this.master && this.enabled) {
        this.master.gain.setTargetAtTime(this.volume * 0.22, this.ctx.currentTime, 0.03);
      }
    }

    playBgm(name) {
      this.current = name;
      if (!this.enabled) return;
      this.ensure();
      this.resume();
      this.startLoop();
    }

    stopLoop() {
      if (this.timer) window.clearInterval(this.timer);
      this.timer = 0;
      this.step = 0;
    }

    startLoop() {
      this.stopLoop();
      if (!this.ctx || !this.current) return;
      this.timer = window.setInterval(() => this.note(), this.current === "battle" ? 210 : 310);
      this.note();
    }

    note() {
      if (!this.ctx || !this.enabled) return;
      const track = this.tracks[this.current] || this.tracks.field;
      const freq = track[this.step % track.length];
      this.step += 1;
      this.tone(freq, this.current === "battle" ? 0.11 : 0.08, this.current === "battle" ? "square" : "triangle", 0.16);
      if (this.step % 4 === 0) this.tone(freq / 2, 0.04, "sine", 0.32);
    }

    tone(freq, gain, type, duration) {
      if (!this.ctx || !this.master) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(gain, now + 0.018);
      env.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(env).connect(this.master);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    sfx(name) {
      if (!this.enabled) return;
      this.ensure();
      this.resume();
      const table = {
        attack: [190, 0.08, "square", 0.08],
        hit: [110, 0.1, "sawtooth", 0.09],
        heal: [660, 0.08, "sine", 0.2],
        level: [523, 0.08, "triangle", 0.14],
        cursor: [740, 0.035, "sine", 0.04],
        chest: [880, 0.08, "triangle", 0.18],
        bad: [140, 0.08, "sawtooth", 0.14],
      };
      const p = table[name] || table.cursor;
      this.tone(p[0], p[1], p[2], p[3]);
      if (name === "level") window.setTimeout(() => this.tone(784, 0.08, "triangle", 0.16), 90);
    }
  }

  document.addEventListener("DOMContentLoaded", boot);

  async function boot() {
    cacheDom();
    buildTouchControls();
    audio = new AudioEngine();
    if (!window.PIXI) {
      DOM.title.innerHTML = "";
      DOM.title.append(el("div", { className: "title-card" }, [
        el("h1", {}, TEXT.title.name),
        el("p", {}, "PixiJS を読み込めませんでした。ネットワークを確認してください。"),
      ]));
      return;
    }
    app = new PIXI.Application();
    await app.init({
      resizeTo: window,
      backgroundColor: 0x07090e,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });
    DOM.pixi.appendChild(app.canvas);
    root = new PIXI.Container();
    mapLayer = new PIXI.Container();
    entityLayer = new PIXI.Container();
    playerLayer = new PIXI.Container();
    battleLayer = new PIXI.Container();
    root.addChild(mapLayer, entityLayer, playerLayer, battleLayer);
    app.stage.addChild(root);
    playerSprite = makeHeroSprite(0xffd56d);
    playerLayer.addChild(playerSprite);
    for (let i = 0; i < 2; i += 1) {
      const sprite = makeHeroSprite(i === 0 ? 0x87c7ff : 0xd9a5ff, true);
      followerSprites.push(sprite);
      playerLayer.addChild(sprite);
    }
    window.addEventListener("resize", fitStage);
    fitStage();
    app.ticker.add(update);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", (e) => pressed.delete(e.key));
    document.addEventListener("pointerdown", () => audio?.resume(), { passive: true });
    drawTitleVisual();
    showTitle();
    exposeDebug();
  }

  function cacheDom() {
    DOM.shell = byId("game-shell");
    DOM.pixi = byId("pixi-root");
    DOM.hud = byId("hud");
    DOM.title = byId("title-screen");
    DOM.dialogue = byId("dialogue");
    DOM.menu = byId("menu");
    DOM.battle = byId("battle-ui");
    DOM.touch = byId("touch-controls");
    DOM.toast = byId("toast");
    DOM.fade = byId("fade");
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "style") node.style.cssText = value;
      else if (key.startsWith("aria")) node.setAttribute(key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), value);
      else node[key] = value;
    });
    const list = Array.isArray(children) ? children : [children];
    list.filter((child) => child !== null && child !== undefined).forEach((child) => {
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    });
    return node;
  }

  function makeButton(label, onClick, options = {}) {
    const btn = el("button", { type: "button" }, label);
    if (options.disabled) btn.disabled = true;
    if (options.title) btn.title = options.title;
    btn.addEventListener("click", () => {
      audio?.sfx("cursor");
      onClick?.();
    });
    return btn;
  }

  function focusFirst(container) {
    window.setTimeout(() => {
      const target = container.querySelector("button:not(:disabled), input:not(:disabled)");
      target?.focus({ preventScroll: true });
    }, 0);
  }

  function buildTouchControls() {
    const pad = el("div", { className: "touch-pad" });
    const layout = [
      ["", ""],
    ];
    const cells = [
      ["blank", ""],
      ["up", "▲"],
      ["blank", ""],
      ["left", "◀"],
      ["blank", ""],
      ["right", "▶"],
      ["blank", ""],
      ["down", "▼"],
      ["blank", ""],
    ];
    cells.forEach(([dir, label]) => {
      const btn = makeButton(label, () => dir && moveByDir(dir), { disabled: !dir });
      if (!dir) btn.classList.add("blank");
      pad.append(btn);
    });
    const actions = el("div", { className: "touch-actions" }, [
      makeButton("A", primaryAction),
      makeButton("B", cancelAction),
    ]);
    DOM.touch.append(pad, actions);
  }

  function fitStage() {
    if (!app || !root) return;
    const w = app.renderer.width / app.renderer.resolution;
    const h = app.renderer.height / app.renderer.resolution;
    const scale = Math.min(w / LOGICAL_W, h / LOGICAL_H);
    root.scale.set(scale);
    root.x = Math.floor((w - LOGICAL_W * scale) / 2);
    root.y = Math.floor((h - LOGICAL_H * scale) / 2);
  }

  function drawTitleVisual() {
    if (!mapLayer) return;
    battleLayer.visible = false;
    entityLayer.visible = false;
    playerLayer.visible = false;
    mapLayer.removeChildren();
    const g = new PIXI.Graphics();
    g.rect(0, 0, LOGICAL_W, LOGICAL_H).fill(0x0a0d14);
    for (let i = 0; i < 90; i += 1) {
      const x = (i * 137) % LOGICAL_W;
      const y = (i * 73) % 420;
      const a = 0.25 + ((i * 17) % 50) / 100;
      g.circle(x, y, 1 + (i % 3) * 0.8).fill({ color: 0xf4dfa2, alpha: a });
    }
    g.circle(LOGICAL_W / 2, 290, 80).fill({ color: 0xf2d279, alpha: 0.16 });
    g.poly([480, 190, 528, 300, 480, 410, 432, 300]).fill({ color: 0xf2d279, alpha: 0.55 });
    g.poly([480, 225, 508, 300, 480, 375, 452, 300]).fill({ color: 0xffffff, alpha: 0.32 });
    g.rect(0, 430, LOGICAL_W, 210).fill(0x111722);
    mapLayer.addChild(g);
  }

  function showTitle(message = "") {
    mode = "title";
    audio?.playBgm("field");
    hideAllPanels();
    DOM.title.classList.remove("hidden");
    DOM.hud.innerHTML = "";
    const hasSave = Boolean(localStorage.getItem(SAVE_KEY));
    const card = el("div", { className: "title-card" }, [
      el("h1", {}, TEXT.title.name),
      el("p", {}, TEXT.title.subtitle),
      message ? el("p", { className: "small" }, message) : null,
      el("div", { className: "title-actions" }, [
        makeButton(TEXT.ui.newGame, () => {
          newGame();
        }),
        makeButton(TEXT.ui.continue, () => {
          const loaded = loadGame();
          if (!loaded) showTitle(TEXT.ui.brokenSave);
        }, { disabled: !hasSave }),
        makeButton(settings.audioOn ? TEXT.ui.audioOn : TEXT.ui.audioOff, () => {
          audio.setEnabled(!settings.audioOn);
          showTitle();
        }),
      ]),
    ]);
    DOM.title.innerHTML = "";
    DOM.title.append(card);
    focusFirst(DOM.title);
  }

  function hideAllPanels() {
    DOM.dialogue.classList.add("hidden");
    DOM.menu.classList.add("hidden");
    DOM.battle.classList.add("hidden");
  }

  function newGame() {
    settings = loadSettings();
    game = initialState();
    mode = "field";
    DOM.title.classList.add("hidden");
    renderField();
    updateHud();
    audio.playBgm("field");
    openDialogue(TEXT.intro, { onDone: () => setMode("field") });
  }

  function initialState() {
    const elna = makeActor("elna", 1);
    return {
      version: VERSION,
      player: { map: "lumina", x: 15, y: 16, dir: "down" },
      trail: [{ x: 15, y: 16 }, { x: 15, y: 16 }, { x: 15, y: 16 }],
      party: [elna],
      gold: 90,
      inventory: { herb: 3, antidote: 1 },
      flags: {
        metElder: false,
        kaiJoined: false,
        caveSwitch: false,
        caveDoor: false,
        midBossDefeated: false,
        caveCleared: false,
        portChoice: false,
        sharedLight: false,
        mioJoined: false,
        sideAccepted: false,
        sideDone: false,
        finalDefeated: false,
      },
      chests: {},
      rocks: { cave_rock: { x: 9, y: 7 } },
      defeated: {},
      steps: 0,
      encounterGrace: 10,
      lastInn: { map: "lumina", x: 15, y: 16 },
      settings,
    };
  }

  function makeActor(id, level = 1) {
    const def = ACTORS[id];
    const actor = {
      id,
      level,
      exp: 0,
      hp: 1,
      mp: 1,
      status: {},
      equip: { ...def.start },
    };
    const stats = calcActorStats(actor);
    actor.hp = stats.hp;
    actor.mp = stats.mp;
    return actor;
  }

  function calcActorStats(actor) {
    const def = ACTORS[actor.id];
    const lv = Math.max(1, actor.level) - 1;
    const stats = {};
    ["hp", "mp", "atk", "def", "mag", "spd"].forEach((key) => {
      stats[key] = def.base[key] + def.growth[key] * lv;
    });
    Object.values(actor.equip || {}).forEach((itemId) => {
      const item = ITEMS[itemId];
      if (!item?.stats) return;
      Object.entries(item.stats).forEach(([key, value]) => {
        stats[key] = (stats[key] || 0) + value;
      });
    });
    stats.hp = Math.max(1, stats.hp);
    stats.mp = Math.max(0, stats.mp);
    stats.atk = Math.max(1, stats.atk);
    stats.def = Math.max(0, stats.def);
    stats.mag = Math.max(0, stats.mag);
    stats.spd = Math.max(1, stats.spd);
    return stats;
  }

  function clampActor(actor) {
    const stats = calcActorStats(actor);
    actor.hp = Math.max(0, Math.min(actor.hp, stats.hp));
    actor.mp = Math.max(0, Math.min(actor.mp, stats.mp));
    actor.status = actor.status || {};
  }

  function actorName(actor) {
    return ACTORS[actor.id]?.name || actor.id;
  }

  function learnedSkills(actor) {
    return ACTORS[actor.id].learns
      .filter((entry) => actor.level >= entry.level)
      .map((entry) => entry.skill);
  }

  function expToNext(level) {
    return 24 + level * level * 13;
  }

  function addInventory(itemId, qty = 1) {
    game.inventory[itemId] = Math.max(0, (game.inventory[itemId] || 0) + qty);
    if (game.inventory[itemId] === 0) delete game.inventory[itemId];
  }

  function removeInventory(itemId, qty = 1) {
    const have = game.inventory[itemId] || 0;
    if (have < qty) return false;
    addInventory(itemId, -qty);
    return true;
  }

  function setMode(nextMode) {
    mode = nextMode;
    if (mode === "field") {
      hideAllPanels();
      updateHud();
      audio?.playBgm("field");
    }
  }

  function renderField() {
    if (!game) return;
    battleLayer.visible = false;
    mapLayer.visible = true;
    entityLayer.visible = true;
    playerLayer.visible = true;
    drawMap();
    drawEntities();
    updatePlayerSprites();
    updateHud();
  }

  function currentMap() {
    return MAPS[game.player.map];
  }

  function drawMap() {
    const map = currentMap();
    mapLayer.removeChildren();
    const g = new PIXI.Graphics();
    g.rect(0, 0, LOGICAL_W, LOGICAL_H).fill(0x06080c);
    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        drawTile(g, map.rows[y][x], x, y, map.id);
      }
    }
    mapLayer.addChild(g);
    if (map.id === "world") {
      labelOnMap(g, "里", 7, 12, 0xffe49c);
      labelOnMap(g, "洞", 10, 6, 0xd2d7ff);
      labelOnMap(g, "港", 24, 13, 0xb8ecff);
      labelOnMap(g, "塔", 21, 6, 0xffc9e6);
    }
  }

  function drawTile(g, tile, x, y, mapId) {
    const info = TILE_INFO[tile] || TILE_INFO.g;
    const px = x * TILE;
    const py = y * TILE;
    const alt = ((x * 17 + y * 31) % 5 === 0) && info.alt ? info.alt : info.color;
    g.rect(px, py, TILE, TILE).fill(alt);
    if (tile === "p" || tile === "s" || tile === "c" || tile === "d") {
      g.rect(px, py + TILE - 4, TILE, 4).fill({ color: 0x000000, alpha: 0.08 });
      if ((x + y) % 3 === 0) g.circle(px + 9, py + 10, 2).fill({ color: 0xffffff, alpha: 0.12 });
    }
    if (tile === "t") {
      g.circle(px + 16, py + 14, 15).fill(0x267348);
      g.rect(px + 13, py + 18, 6, 10).fill(0x5a3e2a);
    }
    if (tile === "w") {
      g.rect(px, py, TILE, TILE).fill(0x2c75a8);
      g.moveTo(px + 3, py + 12).quadraticCurveTo(px + 12, py + 7, px + 22, py + 12).stroke({ color: 0x8bd8ff, alpha: 0.32, width: 2 });
    }
    if (tile === "q") {
      const on = game?.flags?.caveSwitch;
      g.rect(px + 5, py + 5, TILE - 10, TILE - 10).fill(on ? COLORS.switchOn : COLORS.switchOff);
      g.circle(px + 16, py + 16, 6).fill(on ? 0xffffff : 0x2b2b35);
    }
    if ((tile === "x" || tile === "o" || tile === "m") && (x + y) % 2 === 0) {
      g.rect(px + 2, py + 2, TILE - 4, TILE - 4).fill({ color: 0xffffff, alpha: 0.035 });
    }
    if (tile === "r") {
      g.rect(px + 2, py + 5, TILE - 4, TILE - 7).fill(0x9d5648);
      g.moveTo(px + 2, py + 7).lineTo(px + 16, py).lineTo(px + 30, py + 7).stroke({ color: 0xf0c071, width: 2 });
    }
  }

  function labelOnMap(g, text, x, y, color) {
    g.rect(x * TILE + 6, y * TILE + 7, 20, 18).fill({ color: 0x05070b, alpha: 0.55 });
    const label = new PIXI.Text({ text, style: { fill: color, fontSize: 14, fontWeight: "700", fontFamily: "sans-serif" } });
    label.x = x * TILE + 9;
    label.y = y * TILE + 7;
    mapLayer.addChild(label);
  }

  function drawEntities() {
    entityLayer.removeChildren();
    const map = currentMap();
    map.events.forEach((event) => {
      if (!isEntityVisible(event)) return;
      const pos = entityPos(event);
      const sprite = createEntitySprite(event, pos.x, pos.y);
      entityLayer.addChild(sprite);
    });
    mapDirty = false;
  }

  function entityPos(event) {
    if (event.type === "rock" && game.rocks[event.id]) return game.rocks[event.id];
    return { x: event.x, y: event.y };
  }

  function isEntityVisible(event) {
    if (event.type === "chest" && game.chests[event.id] && event.id === "chest_starherb") return false;
    if (event.id === "kai" && game.flags.kaiJoined) return false;
    if (event.id === "mio" && game.flags.mioJoined) return false;
    if (event.id === "midboss" && game.flags.midBossDefeated) return false;
    if (event.id === "final_boss" && game.flags.finalDefeated) return false;
    if (event.type === "gate" && game.flags.caveSwitch) return false;
    return true;
  }

  function createEntitySprite(event, x, y) {
    const c = new PIXI.Container();
    c.x = x * TILE + TILE / 2;
    c.y = y * TILE + TILE / 2;
    const g = new PIXI.Graphics();
    const opened = event.type === "chest" && game.chests[event.id];
    if (event.type === "npc") {
      const color = npcColor(event.action);
      g.ellipse(0, 11, 11, 4).fill({ color: 0x000000, alpha: 0.28 });
      g.circle(0, -7, 7).fill(0xf0c8a0);
      g.roundRect(-9, 0, 18, 20, 5).fill(color);
      g.rect(-5, 14, 4, 8).fill(0x242631);
      g.rect(1, 14, 4, 8).fill(0x242631);
      if (event.label) addPixiLabel(c, event.label, -12, -30, 0xffe49c);
    } else if (event.type === "chest") {
      g.rect(-12, -4, 24, 17).fill(opened ? 0x6a5136 : 0xa76f2c);
      g.rect(-13, -10, 26, 8).fill(opened ? 0x3e3227 : 0xd89b3b);
      g.rect(-2, -5, 4, 8).fill(0xffe49c);
    } else if (event.type === "save") {
      g.poly([0, -16, 12, 0, 0, 16, -12, 0]).fill({ color: 0x8be8ff, alpha: 0.86 });
      g.poly([0, -9, 7, 0, 0, 9, -7, 0]).fill({ color: 0xffffff, alpha: 0.6 });
    } else if (event.type === "rock") {
      g.circle(0, 0, 14).fill(0x777372);
      g.circle(-5, -5, 4).fill({ color: 0xffffff, alpha: 0.08 });
      g.circle(6, 6, 5).fill({ color: 0x000000, alpha: 0.08 });
    } else if (event.type === "switch") {
      const on = game.flags.caveSwitch;
      g.rect(-12, -12, 24, 24).fill(on ? 0xe5c76b : 0x5d5966);
      g.circle(0, 0, 5).fill(on ? 0xffffff : 0x242633);
    } else if (event.type === "gate") {
      g.rect(-14, -16, 28, 32).fill(0x20242f);
      for (let i = -9; i <= 9; i += 9) g.rect(i, -15, 4, 30).fill(0xb7a369);
    } else if (event.type === "door") {
      g.rect(-13, -15, 26, 30).fill(game.flags.caveDoor ? 0x4f4437 : 0x2a2430);
      g.circle(7, 1, 2).fill(0xe5c76b);
    } else if (event.type === "boss") {
      const color = event.action === "boss:final" ? 0xe9e4ff : 0x65d0e8;
      g.ellipse(0, 12, 18, 6).fill({ color: 0x000000, alpha: 0.3 });
      g.poly([0, -22, 18, 0, 0, 22, -18, 0]).fill(color);
      g.circle(0, 0, 7).fill(0x10131d);
    } else if (event.type === "transition") {
      g.rect(-11, -7, 22, 14).fill({ color: 0x05070b, alpha: 0.35 });
      g.moveTo(-8, 0).lineTo(8, 0).stroke({ color: 0xffe49c, width: 2 });
      if (event.label) addPixiLabel(c, event.label, -11, -27, 0xf8e7b0);
    }
    c.addChild(g);
    return c;
  }

  function npcColor(action) {
    if (action === "elder") return 0xe5c76b;
    if (action === "kai") return 0x87c7ff;
    if (action === "mio") return 0xd9a5ff;
    if (action?.startsWith("shop")) return 0x78d58f;
    if (action?.startsWith("inn")) return 0xf0a872;
    if (action === "mayor") return 0xf0d084;
    return 0xc8c0a8;
  }

  function addPixiLabel(container, text, x, y, color) {
    const label = new PIXI.Text({ text, style: { fill: color, fontSize: 12, fontWeight: "700", stroke: { color: 0x000000, width: 3 } } });
    label.x = x;
    label.y = y;
    container.addChild(label);
  }

  function makeHeroSprite(color, follower = false) {
    const c = new PIXI.Container();
    const g = new PIXI.Graphics();
    g.ellipse(0, 12, follower ? 9 : 11, 4).fill({ color: 0x000000, alpha: 0.28 });
    g.circle(0, -8, follower ? 6 : 7).fill(0xf2c9a6);
    g.roundRect(follower ? -8 : -9, -1, follower ? 16 : 18, follower ? 18 : 21, 5).fill(color);
    g.rect(follower ? -5 : -6, 13, 4, 8).fill(0x20232e);
    g.rect(2, 13, 4, 8).fill(0x20232e);
    c.addChild(g);
    c.alpha = follower ? 0.8 : 1;
    return c;
  }

  function updatePlayerSprites() {
    if (!game) return;
    const p = tileCenter(game.player.x, game.player.y);
    playerSprite.x = p.x;
    playerSprite.y = p.y;
    playerSprite.visible = mode !== "title";
    const members = game.party.slice(1);
    followerSprites.forEach((sprite, i) => {
      const actor = members[i];
      sprite.visible = Boolean(actor);
      if (!actor) return;
      sprite.tint = ACTORS[actor.id].color;
      const pos = game.trail[i + 1] || game.player;
      const px = tileCenter(pos.x, pos.y);
      sprite.x = px.x;
      sprite.y = px.y;
    });
  }

  function tileCenter(x, y) {
    return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
  }

  function update(ticker) {
    if (!game) return;
    if (moving) updateMovement(ticker.deltaTime);
    if (mapDirty && mode === "field") drawEntities();
  }

  function updateMovement(delta) {
    const duration = reducedMotion() ? 1 : 7;
    moving.t += delta / duration;
    const t = Math.min(1, moving.t);
    const ease = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
    const from = tileCenter(moving.from.x, moving.from.y);
    const to = tileCenter(moving.to.x, moving.to.y);
    playerSprite.x = from.x + (to.x - from.x) * ease;
    playerSprite.y = from.y + (to.y - from.y) * ease;
    if (t >= 1) {
      game.trail.unshift({ x: moving.from.x, y: moving.from.y });
      game.trail = game.trail.slice(0, 4);
      game.player.x = moving.to.x;
      game.player.y = moving.to.y;
      moving = null;
      updatePlayerSprites();
      afterStep();
      if (deferredFieldAction) {
        const fn = deferredFieldAction;
        deferredFieldAction = null;
        fn();
      }
    }
  }

  function onKeyDown(event) {
    if (event.defaultPrevented) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " ", "Escape", "z", "Z", "x", "X", "m", "M"].includes(event.key)) {
      audio?.resume();
    }
    const active = document.activeElement;
    const typing = active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);
    if (typing) return;
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      event.preventDefault();
      moveByDir("up");
    } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      event.preventDefault();
      moveByDir("down");
    } else if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      moveByDir("left");
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      moveByDir("right");
    } else if (event.key === "Enter" || event.key === " " || event.key === "z" || event.key === "Z") {
      event.preventDefault();
      primaryAction();
    } else if (event.key === "Escape" || event.key === "x" || event.key === "X") {
      event.preventDefault();
      cancelAction();
    } else if (event.key === "m" || event.key === "M") {
      event.preventDefault();
      if (mode === "field") openMenu();
    }
    pressed.add(event.key);
  }

  function moveByDir(dir) {
    if (!game || mode !== "field" || moving) return;
    game.player.dir = dir;
    const d = DIRS[dir];
    tryMove(d.x, d.y);
  }

  function tryMove(dx, dy) {
    const nx = game.player.x + dx;
    const ny = game.player.y + dy;
    const target = getEntityAt(nx, ny);
    if (target?.type === "rock") {
      if (!pushRock(target, dx, dy)) return bump();
    }
    if (isBlocked(nx, ny)) return bump();
    moving = { from: { x: game.player.x, y: game.player.y }, to: { x: nx, y: ny }, t: 0 };
  }

  function bump() {
    audio?.sfx("bad");
    if (!reducedMotion()) {
      playerSprite.x += game.player.dir === "left" ? -2 : game.player.dir === "right" ? 2 : 0;
      playerSprite.y += game.player.dir === "up" ? -2 : game.player.dir === "down" ? 2 : 0;
      window.setTimeout(updatePlayerSprites, 55);
    }
  }

  function pushRock(rock, dx, dy) {
    const pos = entityPos(rock);
    const nx = pos.x + dx;
    const ny = pos.y + dy;
    if (isBlocked(nx, ny, { ignore: rock.id }) || getEntityAt(nx, ny, { ignore: rock.id })) return false;
    game.rocks[rock.id] = { x: nx, y: ny };
    if (nx === 14 && ny === 7 && !game.flags.caveSwitch) {
      game.flags.caveSwitch = true;
      deferredFieldAction = () => openDialogue([{ speaker: "仕掛け", text: "岩が沈み込み、奥の鉄格子が上がった。" }], { onDone: () => setMode("field") });
    }
    mapDirty = true;
    return true;
  }

  function isBlocked(x, y, opts = {}) {
    const map = currentMap();
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
    const info = TILE_INFO[map.rows[y][x]] || TILE_INFO.g;
    if (info.blocked) return true;
    const event = getEntityAt(x, y, opts);
    if (!event) return false;
    if (event.type === "transition" || event.type === "switch" || event.type === "save") return false;
    if (event.type === "gate" && game.flags.caveSwitch) return false;
    if (event.type === "door" && game.flags.caveDoor) return false;
    return Boolean(event.solid);
  }

  function getEntityAt(x, y, opts = {}) {
    const map = currentMap();
    return map.events.find((event) => {
      if (event.id === opts.ignore) return false;
      if (!isEntityVisible(event)) return false;
      const pos = entityPos(event);
      return pos.x === x && pos.y === y;
    });
  }

  function afterStep() {
    const here = getEntityAt(game.player.x, game.player.y);
    if (here?.type === "transition") {
      handleTransition(here);
      return;
    }
    if (here?.type === "save") {
      showToast("セーブ地点です。Aでセーブできます。");
    }
    game.steps += 1;
    if (game.steps % 4 === 0) applyFieldPoison();
    maybeEncounter();
    updateHud();
  }

  function applyFieldPoison() {
    let hurt = false;
    game.party.forEach((actor) => {
      if (actor.status?.poison && actor.hp > 1) {
        actor.hp = Math.max(1, actor.hp - 1);
        hurt = true;
      }
    });
    if (hurt) showToast("毒が体力を削っています。清め草か宿で治せます。");
  }

  function maybeEncounter() {
    const map = currentMap();
    if (!map.encounter || mode !== "field") return;
    if (game.encounterGrace > 0) {
      game.encounterGrace -= 1;
      return;
    }
    const tile = map.rows[game.player.y][game.player.x];
    const info = TILE_INFO[tile] || TILE_INFO.g;
    const rate = map.rate || 0;
    if (!info.encounter && tile !== "p") return;
    if (Math.random() < rate) {
      game.encounterGrace = 7;
      startBattle(map.encounter);
    }
  }

  function primaryAction() {
    if (!game) {
      if (mode === "title") newGame();
      return;
    }
    if (mode === "field") {
      const d = DIRS[game.player.dir] || DIRS.down;
      const target = getEntityAt(game.player.x + d.x, game.player.y + d.y) || getEntityAt(game.player.x, game.player.y);
      if (target) interact(target);
      else openMenu();
    } else if (mode === "dialogue") {
      advanceDialogue();
    }
  }

  function cancelAction() {
    if (mode === "field") openMenu();
    else if (mode === "menu") closeMenu();
    else if (mode === "shop") closeMenu();
    else if (mode === "dialogue") advanceDialogue();
    else if (mode === "battle" && battle?.phase !== "busy") showBattleCommands();
  }

  function interact(event) {
    if (event.type === "transition") return handleTransition(event);
    if (event.type === "save") return openSavePoint();
    if (event.type === "chest") return openChest(event);
    if (event.type === "door") return openDoor(event);
    if (event.type === "gate") return openDialogue([{ speaker: "鉄格子", text: "仕掛けで動くようだ。" }], { onDone: () => setMode("field") });
    if (event.action?.startsWith("shop:")) return openShop(event.action.split(":")[1]);
    if (event.action?.startsWith("inn:")) return openInn(event.action.split(":")[1]);
    if (event.action?.startsWith("boss:")) return startBoss(event.action);
    switch (event.action) {
      case "elder": return talkElder();
      case "kai": return talkKai();
      case "mayor": return talkMayor();
      case "mio": return talkMio();
      case "sidequest": return talkSideQuest();
      case "sailor": return talkSailor();
      default: return openDialogue([{ speaker: "旅人", text: "風が灯のにおいを運んでいる。" }], { onDone: () => setMode("field") });
    }
  }

  function handleTransition(event) {
    const to = event.to;
    if (game.player.map === "lumina" && !game.flags.metElder && to.map === "world") {
      return openDialogue([{ speaker: "里の門", text: "長老に会うまでは里を離れられない。" }], { onDone: () => setMode("field") });
    }
    if (event.id === "world_port" && !game.flags.caveCleared) {
      return openDialogue([{ speaker: "道しるべ", text: "港へ続く橋は青の灯晶が戻るまで渡れない。" }], { onDone: () => setMode("field") });
    }
    if (event.id === "world_tower" && (!game.flags.mioJoined || !game.flags.portChoice)) {
      return openDialogue([{ speaker: "黒曜塔", text: "塔の闇が道を閉ざしている。港の灯読みと話そう。" }], { onDone: () => setMode("field") });
    }
    fadeTo(() => {
      game.player.map = to.map;
      game.player.x = to.x;
      game.player.y = to.y;
      game.player.dir = "down";
      game.trail = [{ x: to.x, y: to.y }, { x: to.x, y: to.y }, { x: to.x, y: to.y }];
      game.encounterGrace = 6;
      renderField();
    });
  }

  function fadeTo(fn) {
    mode = "transition";
    DOM.fade.classList.add("on");
    window.setTimeout(() => {
      fn();
      DOM.fade.classList.remove("on");
      mode = "field";
      updateHud();
    }, reducedMotion() ? 10 : 230);
  }

  function openChest(event) {
    if (game.chests[event.id]) {
      return openDialogue([{ speaker: "宝箱", text: "中は空です。" }], { onDone: () => setMode("field") });
    }
    game.chests[event.id] = true;
    addInventory(event.item, event.qty || 1);
    audio?.sfx("chest");
    mapDirty = true;
    openDialogue([{ speaker: "宝箱", text: `${ITEMS[event.item].name}を${event.qty || 1}個手に入れた。` }], { onDone: () => setMode("field") });
  }

  function openDoor(event) {
    if (game.flags.caveDoor) return openDialogue([{ speaker: "扉", text: "扉は開いている。" }], { onDone: () => setMode("field") });
    if ((game.inventory.oldKey || 0) > 0) {
      game.flags.caveDoor = true;
      mapDirty = true;
      return openDialogue([{ speaker: "扉", text: "古い鍵で扉が開いた。" }], { onDone: () => setMode("field") });
    }
    return openDialogue([{ speaker: "扉", text: "古い鍵が必要です。洞窟の浅い場所を探そう。" }], { onDone: () => setMode("field") });
  }

  function talkElder() {
    if (!game.flags.metElder) {
      openDialogue([
        { speaker: "長老", text: "灯晶は黒曜塔へ奪われた。だが塔を開くには、雫の洞窟に眠る青の灯晶が要る。" },
        { speaker: "カイ", text: "道中は俺が守る。エルナ、一人で背負うな。" },
        { speaker: "語り", text: "カイが仲間になった。" },
      ], {
        onDone: () => {
          game.flags.metElder = true;
          joinActor("kai", 1);
          setMode("field");
          mapDirty = true;
          updateHud();
        },
      });
      return;
    }
    if (!game.flags.caveCleared) {
      return openDialogue([{ speaker: "長老", text: "雫の洞窟へ向かいなさい。岩の仕掛けは押せるものだけが道を開く。" }], { onDone: () => setMode("field") });
    }
    if (!game.flags.finalDefeated) {
      return openDialogue([{ speaker: "長老", text: "港の灯読みを訪ね、黒曜塔への道を開くのです。" }], { onDone: () => setMode("field") });
    }
    return openDialogue([{ speaker: "長老", text: "帰ってきた灯は、旅した者の心を少しだけ広く照らす。" }], { onDone: () => setMode("field") });
  }

  function talkKai() {
    openDialogue([{ speaker: "カイ", text: "長老の話を聞こう。準備ができたら俺も行く。" }], { onDone: () => setMode("field") });
  }

  function talkMayor() {
    if (!game.flags.caveCleared) {
      return openDialogue([{ speaker: "港長", text: "橋の灯が戻るまでは、港の店も半分眠ったままさ。" }], { onDone: () => setMode("field") });
    }
    if (!game.flags.portChoice) {
      return openDialogue([
        { speaker: "港長", text: "青の灯晶の力を少し灯台へ分けてくれないか。旅の蓄えに使う道もある。" },
      ], {
        options: [
          {
            label: "灯台へ分ける",
            action: () => {
              game.flags.portChoice = true;
              game.flags.sharedLight = true;
              addInventory("tideCloak", 1);
              openDialogue([
                { speaker: "港長", text: "ありがとう。海の道も君たちを覚えているだろう。" },
                { speaker: "語り", text: `${ITEMS.tideCloak.name}を受け取った。` },
              ], { onDone: () => setMode("field") });
            },
          },
          {
            label: "旅に温存する",
            action: () => {
              game.flags.portChoice = true;
              game.flags.sharedLight = false;
              game.gold += 280;
              openDialogue([
                { speaker: "港長", text: "それもまた責任ある選択だ。旅費を持っていけ。" },
                { speaker: "語り", text: "280Gを受け取った。" },
              ], { onDone: () => setMode("field") });
            },
          },
        ],
      });
    }
    return openDialogue([{ speaker: "港長", text: game.flags.sharedLight ? "灯台の灯は穏やかだ。君たちの選択のおかげだ。" : "蓄えた灯で、塔への旅を終えてくれ。" }], { onDone: () => setMode("field") });
  }

  function talkMio() {
    if (!game.flags.caveCleared) {
      return openDialogue([{ speaker: "ミオ", text: "青い灯が戻れば、塔の闇の流れが読めるはず。" }], { onDone: () => setMode("field") });
    }
    if (!game.flags.mioJoined) {
      return openDialogue([
        { speaker: "ミオ", text: "黒曜塔の鏡は、色を変える結界をまとう。火には氷、氷には火、闇には光。" },
        { speaker: "ミオ", text: "灯読みとして同行する。三つの灯で、あの鏡を割ろう。" },
        { speaker: "語り", text: "ミオが仲間になった。" },
      ], {
        onDone: () => {
          game.flags.mioJoined = true;
          joinActor("mio", Math.max(3, averageLevel()));
          setMode("field");
          mapDirty = true;
          updateHud();
        },
      });
    } else {
      openDialogue([{ speaker: "ミオ", text: "鏡面の表示を見て。弱点を突くと、相手の大技を止められる。" }], { onDone: () => setMode("field") });
    }
  }

  function talkSideQuest() {
    if (game.flags.sideDone) {
      return openDialogue([{ speaker: "薬師", text: "星露草のおかげで、眠り病の子も朝を迎えられたよ。" }], { onDone: () => setMode("field") });
    }
    if (!game.flags.sideAccepted) {
      return openDialogue([
        { speaker: "薬師", text: "雫の洞窟に星露草がある。見つけたら分けてくれないか。" },
      ], {
        options: [
          { label: "引き受ける", action: () => {
            game.flags.sideAccepted = true;
            openDialogue([{ speaker: "薬師", text: "ありがとう。青白く光る草だ、宝箱にしまわれているはず。" }], { onDone: () => setMode("field") });
          } },
          { label: "今は急ぐ", action: () => openDialogue([{ speaker: "薬師", text: "無理は言わない。必要になったら声をかけて。" }], { onDone: () => setMode("field") }) },
        ],
      });
    }
    if ((game.inventory.starHerb || 0) > 0) {
      return openDialogue([{ speaker: "薬師", text: "その光、星露草だね。譲ってくれるかい。" }], {
        options: [
          { label: "渡す", action: () => {
            removeInventory("starHerb", 1);
            addInventory("wakeBell", 2);
            game.gold += 80;
            game.flags.sideDone = true;
            game.party.forEach((actor) => gainExp(actor, 18, false));
            openDialogue([
              { speaker: "薬師", text: "助かった。これは少ないけれどお礼だ。" },
              { speaker: "語り", text: "目覚め鈴2個、80G、経験値18を受け取った。" },
            ], { onDone: () => setMode("field") });
          } },
          { label: "まだ持つ", action: () => openDialogue([{ speaker: "薬師", text: "わかった。必要ならまた来て。" }], { onDone: () => setMode("field") }) },
        ],
      });
    }
    return openDialogue([{ speaker: "薬師", text: "星露草は洞窟の仕掛けの近くにあるらしい。" }], { onDone: () => setMode("field") });
  }

  function talkSailor() {
    openDialogue([{ speaker: "船乗り", text: game.flags.sharedLight ? "灯台が生き返った。今夜の潮はやさしい。" : "塔へ行くなら、眠り対策の鈴を持っていけ。" }], { onDone: () => setMode("field") });
  }

  function joinActor(id, level) {
    if (game.party.some((actor) => actor.id === id)) return;
    const actor = makeActor(id, level);
    game.party.push(actor);
    game.party = game.party.slice(0, 3);
    game.trail = [{ x: game.player.x, y: game.player.y }, { x: game.player.x, y: game.player.y }, { x: game.player.x, y: game.player.y }];
  }

  function averageLevel() {
    return Math.round(game.party.reduce((sum, actor) => sum + actor.level, 0) / Math.max(1, game.party.length));
  }

  function openDialogue(lines, opts = {}) {
    mode = "dialogue";
    dialogue = {
      lines: Array.isArray(lines) ? lines : [{ speaker: "", text: String(lines) }],
      index: 0,
      options: opts.options || null,
      onDone: opts.onDone || null,
    };
    DOM.dialogue.classList.remove("hidden");
    renderDialogue();
  }

  function renderDialogue() {
    if (!dialogue) return;
    DOM.dialogue.innerHTML = "";
    const line = dialogue.lines[dialogue.index] || { speaker: "", text: "" };
    DOM.dialogue.append(
      line.speaker ? el("div", { className: "speaker" }, line.speaker) : null,
      el("div", { className: "dialogue-text" }, line.text),
    );
    const actions = el("div", { className: "dialogue-actions" });
    const isLast = dialogue.index >= dialogue.lines.length - 1;
    if (isLast && dialogue.options) {
      dialogue.options.forEach((option) => actions.append(makeButton(option.label, option.action)));
    } else {
      actions.append(makeButton(isLast ? TEXT.ui.close : TEXT.ui.next, advanceDialogue));
    }
    DOM.dialogue.append(actions);
    focusFirst(DOM.dialogue);
  }

  function advanceDialogue() {
    if (!dialogue) return;
    if (dialogue.index < dialogue.lines.length - 1) {
      dialogue.index += 1;
      renderDialogue();
      return;
    }
    if (dialogue.options) return;
    const done = dialogue.onDone;
    dialogue = null;
    DOM.dialogue.classList.add("hidden");
    if (done) done();
    else setMode("field");
  }

  function openMenu(view = "root", context = {}) {
    mode = "menu";
    hideAllPanels();
    DOM.menu.classList.remove("hidden");
    renderMenu(view, context);
  }

  function closeMenu() {
    DOM.menu.classList.add("hidden");
    DOM.battle.classList.add("hidden");
    setMode("field");
  }

  function renderMenu(view, context = {}) {
    DOM.menu.innerHTML = "";
    const title = el("h2", { className: "panel-title" }, [
      titleForView(view),
      el("span", { className: "panel-sub" }, `${game.gold}${TEXT.ui.gold}`),
    ]);
    DOM.menu.append(title);
    if (view !== "root") {
      DOM.menu.append(el("div", { className: "button-row" }, [makeButton(TEXT.ui.back, () => renderMenu("root"))]));
    }
    if (view === "root") renderMenuRoot();
    if (view === "items") renderInventory(context);
    if (view === "status") renderStatus();
    if (view === "equip") renderEquip(context);
    if (view === "formation") renderFormation();
    if (view === "save") renderSaveMenu();
    if (view === "settings") renderSettings();
    focusFirst(DOM.menu);
  }

  function titleForView(view) {
    const names = {
      root: TEXT.ui.menu,
      items: TEXT.ui.items,
      status: TEXT.ui.status,
      equip: TEXT.ui.equip,
      formation: TEXT.ui.formation,
      save: TEXT.ui.save,
      settings: TEXT.ui.settings,
    };
    return names[view] || TEXT.ui.menu;
  }

  function renderMenuRoot() {
    DOM.menu.append(el("div", { className: "menu-nav" }, [
      makeButton(TEXT.ui.items, () => renderMenu("items")),
      makeButton(TEXT.ui.status, () => renderMenu("status")),
      makeButton(TEXT.ui.equip, () => renderMenu("equip")),
      makeButton(TEXT.ui.formation, () => renderMenu("formation")),
      makeButton(TEXT.ui.save, () => renderMenu("save")),
      makeButton(TEXT.ui.settings, () => renderMenu("settings")),
      makeButton(TEXT.ui.close, closeMenu),
    ]));
  }

  function renderInventory(context = {}) {
    const entries = Object.entries(game.inventory).filter(([, qty]) => qty > 0);
    if (!entries.length) {
      DOM.menu.append(el("p", {}, TEXT.ui.empty));
      return;
    }
    const grid = el("div", { className: "content-grid" });
    entries.forEach(([itemId, qty]) => {
      const item = ITEMS[itemId];
      const card = el("div", { className: "info-card" }, [
        el("h3", {}, item.name),
        el("div", { className: "item-line" }, [el("span", {}, item.desc), el("strong", {}, `x${qty}`)]),
      ]);
      if (item.type === "consumable" && item.use.kind !== "escape") {
        card.append(makeButton(TEXT.ui.use, () => renderMenu("items", { useItem: itemId })));
      }
      if (context.useItem === itemId) {
        card.append(el("div", { className: "grid-buttons" }, game.party.map((actor, index) => makeButton(actorName(actor), () => useItemField(itemId, index)))));
      }
      grid.append(card);
    });
    DOM.menu.append(grid);
  }

  function useItemField(itemId, actorIndex) {
    const item = ITEMS[itemId];
    const actor = game.party[actorIndex];
    if (!item || !actor || !removeInventory(itemId, 1)) return;
    const used = applyItemEffect(item, actor, false);
    if (!used) {
      addInventory(itemId, 1);
      showToast(TEXT.ui.fullHp);
    } else {
      audio?.sfx(item.use.kind === "cure" ? "level" : "heal");
      showToast(`${actorName(actor)}に${item.name}を使った。`);
    }
    renderMenu("items");
    updateHud();
  }

  function renderStatus() {
    const grid = el("div", { className: "content-grid" });
    game.party.forEach((actor) => {
      const stats = calcActorStats(actor);
      const skills = learnedSkills(actor).map((id) => SKILLS[id].name).join(" / ") || "なし";
      grid.append(el("div", { className: "info-card" }, [
        el("h3", {}, `${actorName(actor)} ${TEXT.ui.level}${actor.level}`),
        meterLine("HP", actor.hp, stats.hp, "hp"),
        meterLine("MP", actor.mp, stats.mp, "mp"),
        statLine("ATK", stats.atk),
        statLine("DEF", stats.def),
        statLine("MAG", stats.mag),
        statLine("SPD", stats.spd),
        statLine(TEXT.ui.exp, `${actor.exp}/${expToNext(actor.level)}`),
        statLine("状態", statusText(actor.status) || "正常"),
        el("p", { className: "small" }, `${TEXT.ui.skills}: ${skills}`),
      ]));
    });
    DOM.menu.append(grid);
  }

  function meterLine(label, current, max, cls) {
    const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, current / max));
    return el("div", {}, [
      el("div", { className: "stat-line" }, [el("span", {}, label), el("strong", {}, `${current}/${max}`)]),
      el("div", { className: `meter ${cls}` }, el("span", { style: `width:${ratio * 100}%` })),
    ]);
  }

  function statLine(label, value) {
    return el("div", { className: "stat-line" }, [el("span", {}, label), el("strong", {}, value)]);
  }

  function renderEquip(context = {}) {
    const selected = context.actor ?? 0;
    const actor = game.party[selected] || game.party[0];
    const before = calcActorStats(actor);
    DOM.menu.append(el("div", { className: "menu-nav" }, game.party.map((member, index) => makeButton(actorName(member), () => renderMenu("equip", { actor: index })))));
    DOM.menu.append(el("div", { className: "content-grid" }, [
      equipSlotCard(actor, "weapon", before),
      equipSlotCard(actor, "armor", before),
      el("div", { className: "info-card" }, [
        el("h3", {}, "能力"),
        statLine("HP", before.hp),
        statLine("MP", before.mp),
        statLine("ATK", before.atk),
        statLine("DEF", before.def),
        statLine("MAG", before.mag),
        statLine("SPD", before.spd),
      ]),
    ]));
  }

  function equipSlotCard(actor, slot, before) {
    const current = ITEMS[actor.equip[slot]];
    const card = el("div", { className: "info-card" }, [
      el("h3", {}, `${slot === "weapon" ? TEXT.ui.weapon : TEXT.ui.armor}: ${current?.name || "なし"}`),
      el("p", { className: "small" }, current?.desc || ""),
    ]);
    Object.entries(game.inventory)
      .filter(([itemId, qty]) => qty > 0 && ITEMS[itemId]?.type === "equipment" && ITEMS[itemId].slot === slot && ITEMS[itemId].allowed.includes(actor.id))
      .forEach(([itemId]) => {
        const item = ITEMS[itemId];
        const after = previewEquip(actor, slot, itemId);
        const delta = ["hp", "mp", "atk", "def", "mag", "spd"]
          .map((key) => {
            const d = after[key] - before[key];
            return d ? `${key.toUpperCase()}${d > 0 ? "+" : ""}${d}` : "";
          })
          .filter(Boolean)
          .join(" ");
        card.append(makeButton(`${item.name} ${delta}`, () => equipItem(actor, slot, itemId)));
      });
    return card;
  }

  function previewEquip(actor, slot, itemId) {
    const clone = JSON.parse(JSON.stringify(actor));
    clone.equip[slot] = itemId;
    return calcActorStats(clone);
  }

  function equipItem(actor, slot, itemId) {
    if (!removeInventory(itemId, 1)) return;
    const old = actor.equip[slot];
    if (old && !ITEMS[old]?.starter) addInventory(old, 1);
    actor.equip[slot] = itemId;
    clampActor(actor);
    audio?.sfx("level");
    renderMenu("equip", { actor: game.party.indexOf(actor) });
    updateHud();
  }

  function renderFormation() {
    const grid = el("div", { className: "content-grid" });
    game.party.forEach((actor, index) => {
      grid.append(el("div", { className: "info-card" }, [
        el("h3", {}, `${index + 1}. ${actorName(actor)}`),
        makeButton("上へ", () => moveFormation(index, -1), { disabled: index === 0 }),
        makeButton("下へ", () => moveFormation(index, 1), { disabled: index === game.party.length - 1 }),
      ]));
    });
    DOM.menu.append(grid);
  }

  function moveFormation(index, delta) {
    const next = index + delta;
    if (next < 0 || next >= game.party.length) return;
    const temp = game.party[index];
    game.party[index] = game.party[next];
    game.party[next] = temp;
    updatePlayerSprites();
    renderMenu("formation");
  }

  function renderSaveMenu() {
    DOM.menu.append(el("div", { className: "content-grid" }, [
      el("div", { className: "info-card" }, [
        el("h3", {}, TEXT.ui.save),
        el("p", {}, `${currentMap().name} / ${game.gold}${TEXT.ui.gold}`),
        makeButton(TEXT.ui.save, () => {
          saveGame();
          showToast(TEXT.ui.saved);
          renderMenu("save");
        }),
      ]),
      el("div", { className: "info-card" }, [
        el("h3", {}, TEXT.ui.load),
        makeButton(TEXT.ui.load, () => {
          if (!loadGame()) showToast(TEXT.ui.brokenSave);
        }),
      ]),
    ]));
  }

  function renderSettings() {
    const audioLabel = settings.audioOn ? TEXT.ui.audioOn : TEXT.ui.audioOff;
    const wrap = el("div", { className: "content-grid" });
    const card = el("div", { className: "info-card" }, [
      el("h3", {}, TEXT.ui.settings),
      makeButton(audioLabel, () => {
        audio.setEnabled(!settings.audioOn);
        renderMenu("settings");
      }),
      el("label", { className: "stat-line" }, [
        el("span", {}, TEXT.ui.volume),
        el("input", { type: "range", min: "0", max: "1", step: "0.05", value: String(settings.volume ?? 0.35), oninput: (e) => audio.setVolume(Number(e.target.value)) }),
      ]),
      makeButton(`${TEXT.ui.reducedMotion}: ${settings.reducedMotion ? TEXT.ui.on : TEXT.ui.off}`, () => {
        settings.reducedMotion = !settings.reducedMotion;
        saveSettings();
        renderMenu("settings");
      }),
    ]);
    wrap.append(card);
    DOM.menu.append(wrap);
  }

  function openSavePoint() {
    saveGame();
    openDialogue([{ speaker: "セーブ灯", text: "進行をセーブしました。" }], { onDone: () => setMode("field") });
  }

  function openShop(shopId, tab = "buy") {
    mode = "shop";
    hideAllPanels();
    DOM.menu.classList.remove("hidden");
    const shop = SHOPS[shopId];
    DOM.menu.innerHTML = "";
    DOM.menu.append(el("h2", { className: "panel-title" }, [
      shop.name,
      el("span", { className: "panel-sub" }, `${game.gold}${TEXT.ui.gold}`),
    ]));
    DOM.menu.append(el("div", { className: "menu-nav" }, [
      makeButton(TEXT.ui.buy, () => openShop(shopId, "buy")),
      makeButton(TEXT.ui.sell, () => openShop(shopId, "sell")),
      makeButton(TEXT.ui.close, closeMenu),
    ]));
    const grid = el("div", { className: "content-grid" });
    if (tab === "buy") {
      shop.items.forEach((itemId) => {
        const item = ITEMS[itemId];
        grid.append(el("div", { className: "info-card" }, [
          el("h3", {}, item.name),
          el("p", {}, item.desc),
          statLine(TEXT.ui.price, `${item.price}${TEXT.ui.gold}`),
          makeButton(TEXT.ui.buy, () => {
            if (game.gold < item.price) return showToast(TEXT.ui.notEnoughGold);
            game.gold -= item.price;
            addInventory(itemId, 1);
            audio?.sfx("chest");
            updateHud();
            openShop(shopId, "buy");
          }),
        ]));
      });
    } else {
      Object.entries(game.inventory).filter(([, qty]) => qty > 0).forEach(([itemId, qty]) => {
        const item = ITEMS[itemId];
        const sellable = item.sellable !== false && item.type !== "key" && item.price > 0;
        const price = Math.max(1, Math.floor(item.price / 2));
        grid.append(el("div", { className: "info-card" }, [
          el("h3", {}, `${item.name} x${qty}`),
          el("p", {}, item.desc),
          statLine(TEXT.ui.sellPrice, sellable ? `${price}${TEXT.ui.gold}` : TEXT.ui.cannotSell),
          makeButton(TEXT.ui.sell, () => {
            if (!sellable) return showToast(TEXT.ui.cannotSell);
            if (removeInventory(itemId, 1)) {
              game.gold += price;
              audio?.sfx("chest");
              updateHud();
            }
            openShop(shopId, "sell");
          }, { disabled: !sellable }),
        ]));
      });
      if (!grid.children.length) grid.append(el("p", {}, TEXT.ui.empty));
    }
    DOM.menu.append(grid);
    focusFirst(DOM.menu);
  }

  function openInn(town) {
    const cost = town === "port" ? 42 : 24;
    openDialogue([{ speaker: TEXT.ui.inn, text: `${cost}Gで休みますか。` }], {
      options: [
        { label: TEXT.ui.yes, action: () => {
          if (game.gold < cost) {
            return openDialogue([{ speaker: TEXT.ui.inn, text: TEXT.ui.notEnoughGold }], { onDone: () => setMode("field") });
          }
          game.gold -= cost;
          healParty(true);
          game.lastInn = { map: game.player.map, x: game.player.x, y: game.player.y };
          audio?.sfx("heal");
          openDialogue([{ speaker: TEXT.ui.inn, text: "体力と状態異常が回復しました。" }], { onDone: () => setMode("field") });
        } },
        { label: TEXT.ui.no, action: () => openDialogue([{ speaker: TEXT.ui.inn, text: "またどうぞ。" }], { onDone: () => setMode("field") }) },
      ],
    });
  }

  function healParty(fullStatus = false) {
    game.party.forEach((actor) => {
      const stats = calcActorStats(actor);
      actor.hp = stats.hp;
      actor.mp = stats.mp;
      if (fullStatus) actor.status = {};
    });
    updateHud();
  }

  function updateHud() {
    if (!game || mode === "title") return;
    DOM.hud.innerHTML = "";
    const chips = [
      `${currentMap().name}`,
      `${game.gold}${TEXT.ui.gold}`,
      ...game.party.map((actor) => {
        const stats = calcActorStats(actor);
        return `${actorName(actor)} Lv${actor.level} HP ${actor.hp}/${stats.hp}`;
      }),
    ];
    chips.forEach((text) => DOM.hud.append(el("div", { className: "hud-chip" }, text)));
  }

  function showToast(text) {
    DOM.toast.textContent = text;
    DOM.toast.classList.remove("hidden");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => DOM.toast.classList.add("hidden"), 2200);
  }

  function startBoss(action) {
    if (action === "boss:mid") {
      if (!game.flags.caveDoor) return openDialogue([{ speaker: "番人", text: "閉じた扉の向こうから、水音だけが聞こえる。" }], { onDone: () => setMode("field") });
      startBattle("midBoss", {
        bossId: "midboss",
        onWin: () => {
          game.flags.midBossDefeated = true;
          game.flags.caveCleared = true;
          addInventory("blueCrystal", 1);
          mapDirty = true;
          openDialogue([
            { speaker: "語り", text: "潮鍵の番人はほどけ、青の灯晶が手に残った。" },
            { speaker: "カイ", text: "これで港へ渡れる。次は灯読みを探そう。" },
          ], { onDone: () => setMode("field") });
        },
      });
      return;
    }
    if (action === "boss:final") {
      startBattle("final", {
        bossId: "final_boss",
        onWin: () => {
          game.flags.finalDefeated = true;
          mapDirty = true;
          showEnding();
        },
      });
    }
  }

  function startBattle(encounterId, options = {}) {
    mode = "battle";
    hideAllPanels();
    DOM.battle.classList.remove("hidden");
    const encounter = weightedPick(ENCOUNTERS[encounterId]);
    const enemies = encounter.enemies.map((id, index) => makeEnemy(id, index));
    battle = {
      encounterId,
      enemies,
      log: [],
      queue: [],
      active: null,
      phase: "busy",
      round: 0,
      boss: enemies.some((enemy) => enemy.def.boss),
      finalAura: "ice",
      finalCharge: 0,
      onWin: options.onWin || null,
    };
    game.party.forEach((actor) => {
      actor.guarding = false;
      clampActor(actor);
    });
    drawBattleScene();
    audio?.playBgm("battle");
    addBattleLog(`${enemyGroupName(enemies)}が現れた。`);
    window.setTimeout(nextTurn, reducedMotion() ? 30 : 420);
  }

  function makeEnemy(id, index) {
    const def = ENEMIES[id];
    return {
      type: "enemy",
      id,
      index,
      name: def.name,
      def,
      hp: def.hp,
      maxHp: def.hp,
      mp: 0,
      status: {},
      guarding: false,
      alive: true,
    };
  }

  function enemyGroupName(enemies) {
    const counts = {};
    enemies.forEach((enemy) => counts[enemy.name] = (counts[enemy.name] || 0) + 1);
    return Object.entries(counts).map(([name, qty]) => qty > 1 ? `${name}x${qty}` : name).join("、");
  }

  function weightedPick(entries) {
    const total = entries.reduce((sum, entry) => sum + (entry.weight || 1), 0);
    let r = Math.random() * total;
    for (const entry of entries) {
      r -= entry.weight || 1;
      if (r <= 0) return entry;
    }
    return entries[0];
  }

  function drawBattleScene() {
    battleLayer.removeChildren();
    battleLayer.visible = true;
    mapLayer.visible = false;
    entityLayer.visible = false;
    playerLayer.visible = false;
    const g = new PIXI.Graphics();
    const bg = battle.encounterId === "final" ? 0x161422 : battle.encounterId === "midBoss" ? 0x102634 : 0x1a2330;
    g.rect(0, 0, LOGICAL_W, LOGICAL_H).fill(bg);
    g.rect(0, 440, LOGICAL_W, 200).fill({ color: 0x05070b, alpha: 0.35 });
    for (let i = 0; i < 12; i += 1) {
      g.circle((i * 83) % LOGICAL_W, 80 + ((i * 47) % 250), 2 + (i % 4)).fill({ color: 0xf7e3a0, alpha: 0.18 });
    }
    battleLayer.addChild(g);
    updateBattleSprites();
  }

  function updateBattleSprites() {
    if (!battle) return;
    while (battleLayer.children.length > 1) battleLayer.removeChildAt(1);
    game.party.forEach((actor, index) => {
      const sprite = makeBattleActor(actor, index);
      sprite.x = 140 + index * 105;
      sprite.y = 330 + index * 38;
      battleLayer.addChild(sprite);
    });
    battle.enemies.forEach((enemy, index) => {
      if (enemy.hp <= 0) return;
      const sprite = makeBattleEnemy(enemy, index);
      sprite.x = 620 + (index % 2) * 120;
      sprite.y = 235 + Math.floor(index / 2) * 105 + (index % 2) * 26;
      battleLayer.addChild(sprite);
    });
  }

  function makeBattleActor(actor, index) {
    const c = new PIXI.Container();
    const g = new PIXI.Graphics();
    const stats = calcActorStats(actor);
    g.ellipse(0, 34, 28, 7).fill({ color: 0x000000, alpha: 0.32 });
    g.circle(0, -10, 15).fill(0xf2c9a6);
    g.roundRect(-20, 5, 40, 44, 8).fill(ACTORS[actor.id].color);
    if (battle?.active?.kind === "actor" && battle.active.index === index) {
      g.circle(0, -10, 24).stroke({ color: 0xffe49c, width: 3 });
    }
    c.addChild(g);
    addPixiLabel(c, `${actorName(actor)} ${actor.hp}/${stats.hp}`, -42, 48, 0xffffff);
    const st = statusText(actor.status);
    if (st) addPixiLabel(c, st, -28, 65, 0xffd0a6);
    return c;
  }

  function makeBattleEnemy(enemy, index) {
    const c = new PIXI.Container();
    const g = new PIXI.Graphics();
    const pulse = enemy.def.final ? 1 + Math.sin(performance.now() / 220) * 0.04 : 1;
    g.ellipse(0, 50, 48, 10).fill({ color: 0x000000, alpha: 0.35 });
    if (enemy.def.final) {
      g.poly([0, -58 * pulse, 48, 0, 0, 58 * pulse, -48, 0]).fill(enemy.def.color);
      g.poly([0, -35, 28, 0, 0, 35, -28, 0]).fill({ color: 0x17141f, alpha: 0.92 });
      g.circle(0, 0, 12).fill(auraColor(battle.finalAura));
    } else if (enemy.def.boss) {
      g.poly([0, -50, 44, -10, 32, 42, -32, 42, -44, -10]).fill(enemy.def.color);
      g.circle(0, -12, 12).fill(0x102030);
    } else {
      g.circle(0, 0, 35).fill(enemy.def.color);
      g.circle(-12, -8, 7).fill(0x10131d);
      g.circle(12, -8, 7).fill(0x10131d);
    }
    if (battle?.active?.kind === "enemy" && battle.active.index === index) {
      g.circle(0, 0, 52).stroke({ color: 0xffe49c, width: 3 });
    }
    c.addChild(g);
    const hpText = `${enemy.name} ${enemy.hp}/${enemy.maxHp}`;
    addPixiLabel(c, hpText, -52, 60, 0xffffff);
    const status = statusText(enemy.status);
    if (status) addPixiLabel(c, status, -32, 78, 0xffd0a6);
    if (enemy.def.final) addPixiLabel(c, finalAuraText(), -58, -84, 0xffe49c);
    return c;
  }

  function auraColor(aura) {
    if (aura === "ice") return 0x8cc7ff;
    if (aura === "fire") return 0xff8b54;
    return 0xfff0a0;
  }

  function finalAuraText() {
    const weak = finalWeakElement();
    const aura = battle.finalAura === "light" ? "闇" : ELEMENT_LABEL[battle.finalAura];
    return `結界:${aura} / 弱点:${ELEMENT_LABEL[weak]}`;
  }

  function finalWeakElement() {
    if (battle.finalAura === "ice") return "fire";
    if (battle.finalAura === "fire") return "ice";
    return "light";
  }

  function nextTurn() {
    if (!battle || mode !== "battle") return;
    if (checkBattleEnd()) return;
    if (!battle.queue.length) {
      battle.round += 1;
      game.party.forEach((actor) => actor.guarding = false);
      if (battle.encounterId === "final") addBattleLog(finalAuraText());
      battle.queue = buildTurnQueue();
    }
    const unit = battle.queue.shift();
    battle.active = unit;
    updateBattleSprites();
    if (!unitAlive(unit)) return nextTurn();
    const subject = unitSubject(unit);
    const statusStop = applyTurnStatus(unit, subject);
    renderBattlePanel();
    if (statusStop) {
      window.setTimeout(nextTurn, reducedMotion() ? 40 : 580);
      return;
    }
    if (unit.kind === "actor") {
      battle.phase = "command";
      showBattleCommands();
    } else {
      battle.phase = "busy";
      renderBattlePanel();
      window.setTimeout(() => enemyAct(unit), reducedMotion() ? 60 : 650);
    }
  }

  function buildTurnQueue() {
    const queue = [];
    game.party.forEach((actor, index) => {
      if (actor.hp > 0) queue.push({ kind: "actor", index, spd: calcActorStats(actor).spd + Math.random() * 2 });
    });
    battle.enemies.forEach((enemy, index) => {
      if (enemy.hp > 0) queue.push({ kind: "enemy", index, spd: enemy.def.spd + Math.random() * 2 });
    });
    return queue.sort((a, b) => b.spd - a.spd);
  }

  function unitSubject(unit) {
    return unit.kind === "actor" ? game.party[unit.index] : battle.enemies[unit.index];
  }

  function unitAlive(unit) {
    const subject = unitSubject(unit);
    return subject && subject.hp > 0;
  }

  function applyTurnStatus(unit, subject) {
    if (!subject.status) subject.status = {};
    if (subject.status.poison) {
      const maxHp = unit.kind === "actor" ? calcActorStats(subject).hp : subject.maxHp;
      const dmg = Math.max(3, Math.floor(maxHp * 0.07));
      damageUnit(subject, dmg);
      subject.status.poison -= 1;
      addBattleLog(`${displayName(subject)}は毒で${dmg}ダメージ。`);
      floatText(unit, `-${dmg}`, 0xa7ef82);
      if (subject.status.poison <= 0) delete subject.status.poison;
      if (subject.hp <= 0) return true;
    }
    if (subject.status.sleep) {
      subject.status.sleep -= 1;
      addBattleLog(`${displayName(subject)}は眠っている。`);
      if (subject.status.sleep <= 0) {
        delete subject.status.sleep;
        addBattleLog(`${displayName(subject)}は目を覚ました。`);
      }
      return true;
    }
    return false;
  }

  function showBattleCommands() {
    if (!battle || !battle.active || battle.active.kind !== "actor") return;
    battle.phase = "command";
    renderBattlePanel("commands");
  }

  function renderBattlePanel(view = "commands", context = {}) {
    if (!battle) return;
    DOM.battle.innerHTML = "";
    const active = battle.active ? unitSubject(battle.active) : null;
    const log = el("div", { className: "battle-log" }, [
      el("div", { className: "turn-label" }, active ? `手番: ${displayName(active)}` : "手番"),
      ...battle.log.slice(-4).map((line) => el("div", {}, line)),
    ]);
    const commands = el("div", { className: "command-grid" });
    if (battle.phase === "command" && active) {
      if (view === "commands") {
        commands.append(
          makeButton(TEXT.ui.attack, () => renderBattlePanel("target", { action: { type: "attack" } })),
          makeButton(TEXT.ui.skill, () => renderBattlePanel("skills")),
          makeButton(TEXT.ui.item, () => renderBattlePanel("items")),
          makeButton(TEXT.ui.guard, () => playerGuard()),
          makeButton(TEXT.ui.run, () => playerRun(), { disabled: battle.boss }),
        );
      } else if (view === "skills") {
        const actor = active;
        const skillIds = learnedSkills(actor);
        if (!skillIds.length) commands.append(el("p", {}, TEXT.ui.empty));
        skillIds.forEach((skillId) => {
          const skill = SKILLS[skillId];
          commands.append(makeButton(`${skill.name} ${skill.mp}MP`, () => {
            const targetView = skill.target === "ally" ? "allyTarget" : "target";
            renderBattlePanel(targetView, { action: { type: "skill", skillId } });
          }, { disabled: actor.mp < skill.mp }));
        });
        commands.append(makeButton(TEXT.ui.back, showBattleCommands));
      } else if (view === "items") {
        const items = Object.entries(game.inventory).filter(([id, qty]) => qty > 0 && ITEMS[id].type === "consumable");
        if (!items.length) commands.append(el("p", {}, TEXT.ui.empty));
        items.forEach(([itemId, qty]) => {
          const item = ITEMS[itemId];
          commands.append(makeButton(`${item.name} x${qty}`, () => {
            if (item.use.kind === "escape") useBattleItem(itemId, null);
            else renderBattlePanel("allyTarget", { action: { type: "item", itemId } });
          }));
        });
        commands.append(makeButton(TEXT.ui.back, showBattleCommands));
      } else if (view === "target") {
        aliveEnemies().forEach((enemy) => commands.append(makeButton(`${enemy.name} ${enemy.hp}/${enemy.maxHp}`, () => playerAction(context.action, enemy))));
        commands.append(makeButton(TEXT.ui.back, showBattleCommands));
      } else if (view === "allyTarget") {
        game.party.forEach((actor) => {
          const stats = calcActorStats(actor);
          commands.append(makeButton(`${actorName(actor)} ${actor.hp}/${stats.hp}`, () => {
            if (context.action.type === "item") useBattleItem(context.action.itemId, actor);
            else playerAction(context.action, actor);
          }, { disabled: actor.hp <= 0 && context.action?.type !== "item" }));
        });
        commands.append(makeButton(TEXT.ui.back, showBattleCommands));
      }
    } else {
      commands.append(el("div", {}, battleSummary()));
    }
    DOM.battle.append(log, commands);
    focusFirst(DOM.battle);
  }

  function battleSummary() {
    const party = game.party.map((actor) => `${actorName(actor)}:${actor.hp}`).join("  ");
    const enemies = aliveEnemies().map((enemy) => `${enemy.name}:${enemy.hp}`).join("  ") || "なし";
    return `${party}\n敵: ${enemies}`;
  }

  function aliveEnemies() {
    return battle.enemies.filter((enemy) => enemy.hp > 0);
  }

  function playerGuard() {
    const actor = unitSubject(battle.active);
    actor.guarding = true;
    addBattleLog(`${actorName(actor)}は身を固めた。`);
    audio?.sfx("cursor");
    endPlayerTurn();
  }

  function playerRun() {
    battle.phase = "busy";
    if (battle.boss) {
      addBattleLog("逃げ道がない。");
      return endPlayerTurn();
    }
    if (Math.random() < 0.72) {
      addBattleLog("戦闘から離脱した。");
      audio?.sfx("cursor");
      window.setTimeout(endBattleToField, reducedMotion() ? 40 : 550);
    } else {
      addBattleLog("回り込まれた。");
      endPlayerTurn();
    }
    renderBattlePanel();
  }

  function playerAction(action, target) {
    const actor = unitSubject(battle.active);
    battle.phase = "busy";
    if (action.type === "attack") performAttack(actor, target, false);
    if (action.type === "skill") performSkill(actor, target, action.skillId, false);
    endPlayerTurn();
  }

  function useBattleItem(itemId, target) {
    const item = ITEMS[itemId];
    battle.phase = "busy";
    if (!removeInventory(itemId, 1)) return showBattleCommands();
    if (item.use.kind === "escape") {
      if (battle.boss) {
        addInventory(itemId, 1);
        addBattleLog("煙は結界に散らされた。");
      } else {
        addBattleLog("煙に紛れて離脱した。");
        window.setTimeout(endBattleToField, reducedMotion() ? 40 : 480);
        return renderBattlePanel();
      }
    } else {
      const used = applyItemEffect(item, target, true);
      if (!used) {
        addInventory(itemId, 1);
        addBattleLog("今は効果がない。");
      } else {
        addBattleLog(`${displayName(target)}に${item.name}を使った。`);
        audio?.sfx(item.use.kind === "cure" ? "level" : "heal");
      }
    }
    endPlayerTurn();
  }

  function applyItemEffect(item, actor, inBattle) {
    const stats = calcActorStats(actor);
    if (item.use.kind === "healHp") {
      if (actor.hp >= stats.hp) return false;
      actor.hp = Math.min(stats.hp, actor.hp + item.use.power);
      if (inBattle) floatText({ kind: "actor", index: game.party.indexOf(actor) }, `+${item.use.power}`, 0x78d58f);
      return true;
    }
    if (item.use.kind === "healMp") {
      if (actor.mp >= stats.mp) return false;
      actor.mp = Math.min(stats.mp, actor.mp + item.use.power);
      return true;
    }
    if (item.use.kind === "cure") {
      if (!actor.status?.[item.use.status]) return false;
      delete actor.status[item.use.status];
      return true;
    }
    return false;
  }

  function endPlayerTurn() {
    updateBattleSprites();
    renderBattlePanel();
    window.setTimeout(nextTurn, reducedMotion() ? 50 : 620);
  }

  function enemyAct(unit) {
    if (!battle || mode !== "battle") return;
    const enemy = unitSubject(unit);
    if (!enemy || enemy.hp <= 0) return nextTurn();
    if (enemy.def.final && enemy.stagger) {
      enemy.stagger = 0;
      battle.finalAura = nextAura(battle.finalAura);
      battle.finalCharge = 0;
      addBattleLog(`${enemy.name}の鏡面が割れ、結界が変わった。`);
      updateBattleSprites();
      renderBattlePanel();
      return window.setTimeout(nextTurn, reducedMotion() ? 40 : 700);
    }
    const targets = game.party.filter((actor) => actor.hp > 0);
    const target = targets.sort((a, b) => (a.hp / calcActorStats(a).hp) - (b.hp / calcActorStats(b).hp))[0];
    if (!target) return checkBattleEnd();
    if (enemy.def.final) {
      battle.finalCharge += 1;
      if (battle.finalCharge >= 3) {
        addBattleLog(`${enemy.name}は星喰いを放った。`);
        targets.forEach((actor) => {
          const dmg = Math.max(18, Math.floor(enemy.def.mag * 1.45 + 12 - calcActorStats(actor).def * 0.35));
          damageUnit(actor, actor.guarding ? Math.floor(dmg / 2) : dmg);
          floatText({ kind: "actor", index: game.party.indexOf(actor) }, `-${dmg}`, 0xff7f7f);
        });
        battle.finalCharge = 0;
        audio?.sfx("hit");
        updateBattleSprites();
        renderBattlePanel();
        return window.setTimeout(nextTurn, reducedMotion() ? 60 : 800);
      }
    }
    const action = weightedPick(enemy.def.actions);
    if (action.type === "skill") performSkill(enemy, target, action.skill, true);
    else performAttack(enemy, target, true);
    updateBattleSprites();
    renderBattlePanel();
    window.setTimeout(nextTurn, reducedMotion() ? 60 : 700);
  }

  function nextAura(aura) {
    if (aura === "ice") return "fire";
    if (aura === "fire") return "light";
    return "ice";
  }

  function performAttack(subject, target, isEnemy) {
    const weapon = !isEnemy ? ITEMS[subject.equip.weapon] : null;
    const element = weapon?.element || "neutral";
    const dmg = calcDamage(subject, target, { power: 10, element, stat: "atk", physical: true }, isEnemy);
    const crit = !isEnemy && Math.random() < 0.1;
    const final = crit ? Math.floor(dmg * 1.65) : dmg;
    damageUnit(target, final);
    audio?.sfx("attack");
    addBattleLog(`${displayName(subject)}の攻撃。${crit ? "会心！" : ""}${displayName(target)}に${final}ダメージ。`);
    floatText(unitRef(target), `-${final}`, crit ? 0xffe49c : 0xffffff);
  }

  function performSkill(subject, target, skillId, isEnemy) {
    const skill = SKILLS[skillId];
    if (!skill) return;
    if (!isEnemy) {
      if (subject.mp < skill.mp) {
        addBattleLog("MPが足りない。");
        return;
      }
      subject.mp -= skill.mp;
    }
    if (skill.kind === "heal") {
      const stats = calcActorStats(target);
      const amount = Math.floor(skill.power + getStat(subject, "mag") * 1.2 + Math.random() * 8);
      target.hp = Math.min(stats.hp, target.hp + amount);
      addBattleLog(`${displayName(subject)}の${skill.name}。${displayName(target)}のHPが${amount}回復。`);
      floatText(unitRef(target), `+${amount}`, 0x78d58f);
      audio?.sfx("heal");
      return;
    }
    if (skill.kind === "status") {
      const chance = statusChance(subject, target, skill, isEnemy);
      if (Math.random() < chance) {
        target.status[skill.status] = Math.max(target.status[skill.status] || 0, skill.turns);
        addBattleLog(`${displayName(subject)}の${skill.name}。${displayName(target)}は${STATUS_LABEL[skill.status]}になった。`);
        floatText(unitRef(target), STATUS_LABEL[skill.status], 0xffd0a6);
      } else {
        addBattleLog(`${displayName(subject)}の${skill.name}。しかし効かなかった。`);
      }
      audio?.sfx("cursor");
      return;
    }
    const dmg = calcDamage(subject, target, skill, isEnemy);
    damageUnit(target, dmg);
    const weak = elementMultiplier(target, skill.element) > 1.01;
    addBattleLog(`${displayName(subject)}の${skill.name}。${displayName(target)}に${dmg}ダメージ${weak ? "。弱点！" : "。"}`);
    floatText(unitRef(target), `-${dmg}`, weak ? 0xffe49c : 0xffffff);
    audio?.sfx("hit");
    if (skill.kind === "damageStatus" && target.hp > 0 && Math.random() < statusChance(subject, target, skill, isEnemy)) {
      target.status[skill.status] = Math.max(target.status[skill.status] || 0, skill.turns);
      addBattleLog(`${displayName(target)}は${STATUS_LABEL[skill.status]}になった。`);
    }
  }

  function calcDamage(subject, target, skill, isEnemy) {
    const atk = getStat(subject, skill.stat || "atk");
    const def = getStat(target, "def");
    const level = isEnemy ? subject.def.level : subject.level;
    let base = Math.max(2, Math.floor(atk * 1.25 + skill.power + level * 1.8 - def * 0.72 + Math.random() * 6));
    const mult = elementMultiplier(target, skill.element || "neutral");
    if (target.guarding) base = Math.floor(base / 2);
    base = Math.floor(base * mult);
    if (target.def?.final && skill.element === finalWeakElement()) {
      target.stagger = 1;
      battle.finalCharge = 0;
      addBattleLog("結界の弱点を突いた。大技の気配が散る。");
    }
    return Math.max(1, base);
  }

  function elementMultiplier(target, element) {
    if (!element || element === "neutral") return target.def?.res?.neutral || 1;
    if (target.def?.final) {
      return element === finalWeakElement() ? 1.75 : element === "neutral" ? 0.9 : 0.72;
    }
    const weak = target.def?.weak?.[element];
    const res = target.def?.res?.[element];
    return weak || res || 1;
  }

  function statusChance(subject, target, skill, isEnemy) {
    if (target.def?.boss && skill.status === "sleep") return 0.12;
    const mag = getStat(subject, "mag");
    const spd = getStat(target, "spd");
    return Math.max(0.12, Math.min(0.88, skill.chance + (mag - spd) * 0.015));
  }

  function getStat(unit, key) {
    if (unit.def) return unit.def[key] || 0;
    return calcActorStats(unit)[key] || 0;
  }

  function damageUnit(unit, amount) {
    unit.hp = Math.max(0, unit.hp - amount);
    if (unit.hp <= 0) {
      unit.hp = 0;
      unit.status = {};
    }
  }

  function displayName(unit) {
    return unit.def ? unit.name : actorName(unit);
  }

  function unitRef(unit) {
    if (unit.def) return { kind: "enemy", index: battle.enemies.indexOf(unit) };
    return { kind: "actor", index: game.party.indexOf(unit) };
  }

  function floatText(ref, text, color) {
    if (!battleLayer || reducedMotion()) return;
    const label = new PIXI.Text({ text, style: { fill: color, fontSize: 24, fontWeight: "800", stroke: { color: 0x000000, width: 4 } } });
    const pos = ref.kind === "enemy"
      ? { x: 620 + (ref.index % 2) * 120, y: 170 + Math.floor(ref.index / 2) * 105 + (ref.index % 2) * 26 }
      : { x: 140 + ref.index * 105, y: 285 + ref.index * 38 };
    label.anchor.set(0.5);
    label.x = pos.x;
    label.y = pos.y;
    battleLayer.addChild(label);
    let life = 0;
    const tick = (ticker) => {
      life += ticker.deltaTime;
      label.y -= ticker.deltaTime * 0.7;
      label.alpha = Math.max(0, 1 - life / 45);
      if (life >= 45) {
        app.ticker.remove(tick);
        label.destroy();
      }
    };
    app.ticker.add(tick);
  }

  function addBattleLog(line) {
    battle.log.push(line);
    battle.log = battle.log.slice(-8);
    renderBattlePanel();
  }

  function checkBattleEnd() {
    if (battle.enemies.every((enemy) => enemy.hp <= 0)) {
      winBattle();
      return true;
    }
    if (game.party.every((actor) => actor.hp <= 0)) {
      loseBattle();
      return true;
    }
    return false;
  }

  function winBattle() {
    battle.phase = "busy";
    const exp = battle.enemies.reduce((sum, enemy) => sum + enemy.def.exp, 0);
    const gold = battle.enemies.reduce((sum, enemy) => sum + enemy.def.gold, 0);
    game.gold += gold;
    const levelMessages = [];
    game.party.forEach((actor) => {
      if (actor.hp > 0) levelMessages.push(...gainExp(actor, exp, true));
      delete actor.status.sleep;
      actor.guarding = false;
    });
    addBattleLog(`勝利。${exp}EXP、${gold}Gを得た。`);
    updateBattleSprites();
    renderBattlePanel();
    const done = battle.onWin;
    const lines = [{ speaker: "戦闘", text: `勝利。${exp}EXP、${gold}Gを得た。` }, ...levelMessages.map((text) => ({ speaker: "成長", text }))];
    battle = null;
    window.setTimeout(() => {
      endBattleVisual();
      if (done) done();
      else openDialogue(lines, { onDone: () => setMode("field") });
    }, reducedMotion() ? 40 : 760);
  }

  function gainExp(actor, amount, withMessages = true) {
    const messages = [];
    actor.exp += amount;
    while (actor.exp >= expToNext(actor.level)) {
      const beforeSkills = new Set(learnedSkills(actor));
      actor.exp -= expToNext(actor.level);
      actor.level += 1;
      const stats = calcActorStats(actor);
      actor.hp = stats.hp;
      actor.mp = stats.mp;
      audio?.sfx("level");
      const newSkills = learnedSkills(actor).filter((skill) => !beforeSkills.has(skill));
      messages.push(`${actorName(actor)}はLv${actor.level}になった。`);
      newSkills.forEach((skill) => messages.push(`${actorName(actor)}は${SKILLS[skill].name}を覚えた。`));
    }
    clampActor(actor);
    return withMessages ? messages : [];
  }

  function loseBattle() {
    const last = game.lastInn || { map: "lumina", x: 15, y: 16 };
    game.gold = Math.floor(game.gold / 2);
    game.player.map = last.map;
    game.player.x = last.x;
    game.player.y = last.y;
    game.trail = [{ x: last.x, y: last.y }, { x: last.x, y: last.y }, { x: last.x, y: last.y }];
    game.party.forEach((actor) => {
      const stats = calcActorStats(actor);
      actor.hp = Math.max(1, Math.floor(stats.hp / 2));
      actor.mp = Math.max(0, Math.floor(stats.mp / 2));
      actor.status = {};
      actor.guarding = false;
    });
    addBattleLog(TEXT.ui.gameOver);
    battle = null;
    window.setTimeout(() => {
      endBattleVisual();
      renderField();
      openDialogue([
        { speaker: "語り", text: TEXT.ui.gameOver },
        { speaker: "語り", text: TEXT.ui.revive },
      ], { onDone: () => setMode("field") });
    }, reducedMotion() ? 40 : 760);
  }

  function endBattleToField() {
    battle = null;
    endBattleVisual();
    game.encounterGrace = 9;
    renderField();
    setMode("field");
  }

  function endBattleVisual() {
    DOM.battle.classList.add("hidden");
    battleLayer.visible = false;
    mapLayer.visible = true;
    entityLayer.visible = true;
    playerLayer.visible = true;
    renderField();
  }

  function statusText(status = {}) {
    return Object.entries(status)
      .filter(([, turns]) => turns > 0)
      .map(([key, turns]) => `${STATUS_LABEL[key] || key}${turns}`)
      .join(" ");
  }

  function showEnding() {
    mode = "ending";
    audio?.playBgm("ending");
    const lines = (game.flags.sharedLight ? TEXT.endingShared : TEXT.endingKept).slice();
    if (game.flags.sideDone) lines.push({ speaker: "薬師", text: "里の朝にも、小さな救いが残った。" });
    lines.push({ speaker: TEXT.ui.clear, text: "灯晶の巡礼 完" });
    openDialogue(lines, {
      onDone: () => {
        saveGame();
        showTitle("クリアデータをセーブしました。");
      },
    });
  }

  function saveGame() {
    if (!game) return false;
    game.settings = settings;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
      saveSettings();
      return true;
    } catch (err) {
      console.warn("Save failed", err);
      showToast("セーブに失敗しました。ブラウザの保存容量を確認してください。");
      return false;
    }
  }

  function loadGame() {
    let raw = null;
    try {
      raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        showToast(TEXT.ui.noSave);
        return false;
      }
      const parsed = JSON.parse(raw);
      const loaded = sanitizeSave(parsed);
      if (!loaded) throw new Error("invalid save");
      game = loaded;
      settings = { ...settings, ...(loaded.settings || {}) };
      saveSettings();
      DOM.title.classList.add("hidden");
      mode = "field";
      renderField();
      setMode("field");
      showToast(TEXT.ui.loaded);
      return true;
    } catch (err) {
      showToast(TEXT.ui.brokenSave);
      return false;
    }
  }

  function sanitizeSave(data) {
    if (!data || data.version !== VERSION || !MAPS[data.player?.map]) return null;
    const fresh = initialState();
    const safe = {
      ...fresh,
      ...data,
      player: { ...fresh.player, ...data.player },
      flags: { ...fresh.flags, ...(data.flags || {}) },
      chests: data.chests && typeof data.chests === "object" ? data.chests : {},
      rocks: { ...fresh.rocks, ...(data.rocks || {}) },
      inventory: {},
      party: [],
      settings: { ...fresh.settings, ...(data.settings || {}) },
    };
    Object.entries(data.inventory || {}).forEach(([id, qty]) => {
      if (ITEMS[id] && Number.isFinite(qty) && qty > 0) safe.inventory[id] = Math.floor(qty);
    });
    (data.party || []).forEach((actor) => {
      if (!ACTORS[actor.id]) return;
      const clean = makeActor(actor.id, Math.max(1, Math.min(30, Number(actor.level) || 1)));
      clean.exp = Math.max(0, Number(actor.exp) || 0);
      clean.equip = { ...ACTORS[actor.id].start, ...(actor.equip || {}) };
      Object.entries(clean.equip).forEach(([slot, itemId]) => {
        const item = ITEMS[itemId];
        if (!item || item.type !== "equipment" || item.slot !== slot || !item.allowed.includes(actor.id)) clean.equip[slot] = ACTORS[actor.id].start[slot];
      });
      clean.hp = Math.max(0, Number(actor.hp) || 1);
      clean.mp = Math.max(0, Number(actor.mp) || 0);
      clean.status = {};
      Object.entries(actor.status || {}).forEach(([key, turns]) => {
        if (STATUS_LABEL[key] && Number.isFinite(turns) && turns > 0) clean.status[key] = Math.min(9, Math.floor(turns));
      });
      clampActor(clean);
      safe.party.push(clean);
    });
    if (!safe.party.length) safe.party = [makeActor("elna", 1)];
    safe.party = safe.party.slice(0, 3);
    safe.gold = Math.max(0, Math.floor(Number(safe.gold) || 0));
    safe.player.x = Math.max(0, Math.min(29, Math.floor(Number(safe.player.x) || fresh.player.x)));
    safe.player.y = Math.max(0, Math.min(19, Math.floor(Number(safe.player.y) || fresh.player.y)));
    if (!DIRS[safe.player.dir]) safe.player.dir = "down";
    safe.trail = Array.isArray(data.trail) ? data.trail.slice(0, 4) : fresh.trail;
    return safe;
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        audioOn: Boolean(parsed.audioOn),
        volume: Number.isFinite(parsed.volume) ? Math.max(0, Math.min(1, parsed.volume)) : 0.35,
        reducedMotion: Boolean(parsed.reducedMotion),
      };
    } catch {
      return { audioOn: false, volume: 0.35, reducedMotion: false };
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.warn("Settings save failed", err);
    }
  }

  function reducedMotion() {
    return Boolean(settings.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function showDataMessage(message) {
    console.log(message);
    return message;
  }

  function exposeDebug() {
    window.__akariDebug = {
      state: () => game,
      setCorruptSave: () => localStorage.setItem(SAVE_KEY, "{broken"),
      clearSave: () => localStorage.removeItem(SAVE_KEY),
      grant: () => {
        if (!game) newGame();
        ["kai", "mio"].forEach((id) => {
          if (!game.party.some((actor) => actor.id === id)) joinActor(id, id === "mio" ? 5 : 4);
        });
        game.party.forEach((actor) => {
          actor.level = Math.max(actor.level, 6);
          actor.exp = 0;
          const stats = calcActorStats(actor);
          actor.hp = stats.hp;
          actor.mp = stats.mp;
        });
        game.gold += 999;
        ["highHerb", "tonic", "antidote", "wakeBell", "starEdge", "emberSpear", "moonRod", "chain", "robe"].forEach((id) => addInventory(id, 2));
        updateHud();
        return showDataMessage("granted");
      },
      warp: (map, x, y) => {
        if (!game) newGame();
        if (!MAPS[map]) return "unknown map";
        battle = null;
        dialogue = null;
        game.player.map = map;
        game.player.x = Number(x) || 0;
        game.player.y = Number(y) || 0;
        game.trail = [{ x: game.player.x, y: game.player.y }, { x: game.player.x, y: game.player.y }, { x: game.player.x, y: game.player.y }];
        mode = "field";
        hideAllPanels();
        renderField();
        return `${map}:${game.player.x},${game.player.y}`;
      },
      startBattle: (encounterId = "field") => {
        if (!game) newGame();
        startBattle(encounterId);
        return encounterId;
      },
      runSelfTest,
    };
  }

  function runSelfTest() {
    const oldGame = game ? JSON.parse(JSON.stringify(game)) : null;
    const oldSave = localStorage.getItem(SAVE_KEY);
    const results = [];
    try {
      game = initialState();
      joinActor("kai", 3);
      joinActor("mio", 4);
      results.push(assert(game.party.length === 3, "party joins"));
      const gold = game.gold;
      game.gold = 500;
      addInventory("ironBlade", 1);
      const actor = game.party[0];
      const before = calcActorStats(actor).atk;
      equipItemSilent(actor, "weapon", "ironBlade");
      results.push(assert(calcActorStats(actor).atk > before, "equipment raises stats"));
      addInventory("herb", 1);
      actor.hp = 1;
      const used = applyItemEffect(ITEMS.herb, actor, false);
      removeInventory("herb", 1);
      results.push(assert(used && actor.hp > 1, "item heals"));
      actor.status.poison = 2;
      actor.status.sleep = 1;
      const poisonBefore = actor.hp;
      battle = { enemies: [makeEnemy("dew", 0)], log: [], queue: [], active: { kind: "actor", index: 0 }, phase: "busy", round: 1, boss: false, finalAura: "ice", finalCharge: 0 };
      applyTurnStatus({ kind: "actor", index: 0 }, actor);
      results.push(assert(actor.hp < poisonBefore && !actor.status.sleep, "statuses tick"));
      battle = null;
      game.gold = gold;
      game.flags.metElder = true;
      game.flags.kaiJoined = true;
      game.flags.caveSwitch = true;
      game.flags.caveDoor = true;
      game.flags.caveCleared = true;
      game.flags.portChoice = true;
      game.flags.mioJoined = true;
      game.flags.sharedLight = true;
      game.player.map = "tower";
      saveGame();
      const loaded = sanitizeSave(JSON.parse(localStorage.getItem(SAVE_KEY)));
      results.push(assert(loaded.player.map === "tower" && loaded.party.length === 3 && loaded.flags.sharedLight, "save/load restores progress"));
      localStorage.setItem(SAVE_KEY, "{bad json");
      results.push(assert(loadGame() === false, "broken save does not crash"));
      if (oldSave === null) localStorage.removeItem(SAVE_KEY);
      else localStorage.setItem(SAVE_KEY, oldSave);
      if (oldGame) game = sanitizeSave(oldGame);
      else game = null;
      if (game) renderField();
      return { ok: results.every(Boolean), results };
    } catch (err) {
      console.error(err);
      if (oldSave === null) localStorage.removeItem(SAVE_KEY);
      else localStorage.setItem(SAVE_KEY, oldSave);
      if (oldGame) game = sanitizeSave(oldGame);
      return { ok: false, results, error: String(err) };
    }
  }

  function equipItemSilent(actor, slot, itemId) {
    removeInventory(itemId, 1);
    const old = actor.equip[slot];
    if (old && !ITEMS[old]?.starter) addInventory(old, 1);
    actor.equip[slot] = itemId;
    clampActor(actor);
  }

  function assert(value, label) {
    if (!value) console.error(`SelfTest failed: ${label}`);
    return Boolean(value);
  }
})();
