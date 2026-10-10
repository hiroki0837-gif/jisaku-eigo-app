# 自作英語学習アプリ — Claude Code 用メモ

## このプロジェクトについて
- 日本語話者（循環器内科医・研究者）向けの英語学習 Web アプリ。**スマホ（iPhone Safari）で使う前提**。
- UI・説明文・コミットメッセージ以外のユーザー向け文言はすべて日本語。
- 本体は **1ファイル**：`app/index.html`（約1.8MB、データも JS 定数として埋め込み）。ビルド不要の vanilla JS。
- `app/index.html` は claude.ai の Artifact 形式の「断片」（`<title>` から始まり、`<!doctype>`/`<head>` が無い）。
  オフライン版は `scripts/build_pwa.py` が `<head>` を付け、manifest・Service Worker・アイコンと一緒に `dist/` に出力する。

## よく使うコマンド
```bash
npm install                 # jsdom（テスト用）。playwright は test:offline のみ
npm test                    # tests/*.js のスモークテスト（jsdom）を全部実行
npm run build               # dist/（オフライン版 PWA）と jisaku-eigo-offline.zip を作る
npm run serve               # build して http://localhost:8000 で確認
npm run test:offline        # Chromium でオフライン動作を確認（playwright が必要）
```
`main` に push すると `.github/workflows/pages.yml` がテスト → ビルド → GitHub Pages 公開を行う。

## 画面（下のタブ）と主な関数
| タブ | data-tab | 描画関数 | 内容 |
|---|---|---|---|
| フレーズ | learn | `learnView` | `Q` の4段階（カジュアル→フォーマル）ラダー |
| 似た言葉 | pos | `posView`→`uniView` | `UNI`（4段階ラダー＋似ている言葉＋言い換え＋時の表現を統合） |
| 単語帳 | toeic | `cardView` (`tList`,`tCard`,`clusterCard`) | デッキ: mix(TOEIC＋TOEFL＋論文) / toeic / idiom(TOEFL熟語) / med(医学論文) / kobun(構文)。英→日・日→英。日→英は似た語を1枚に（クラスター） |
| 例文・会話 | example | `exampleView` (`wordExView`,`convView`) | 例文の日→英クイズ（`EXPOOL`）、TOEIC Part3/4風会話 |
| 復習 | review | `reviewView` | まちがえた問題 / わからない表現（例文の日本語をタップしてメモ） |
| 記録 | stats | `statsView` | 概要 / 苦手な単語 / フレーズ一覧 / 設定（明るさ・音声・バックアップ・リセット） |

- 描画は `render()` が `app.innerHTML` を毎回作り直す方式。クリックは `document` への委譲で `data-act` 属性を見て処理（同じ `data-act` を複数のリスナーが見るので、新しい act 名は既存と重複させない）。
- ページ移動後のスクロールは `toQ()`（設定ボタン群の直下＝問題の頭へ）。タブ切替は `S.scr[tab]` で位置を復元。

## 状態と保存
- 状態はグローバル `S`。`saveLocal()` が localStorage（キー `nuance-ladder-v1`）へ、`save()` は加えて claude.ai 上ではアカウント DB にも保存。
- `window.claude`（claude.ai Artifact のランタイム: `db`,`user`,`sample`）は **claude.ai 上でだけ存在**。必ず存在チェックして、無い場合（オフライン版・ローカル）でも全機能が動くこと。`sample`（「Claudeに聞く」）は無ければボタンを出さない。
- 記録のキー（`S.rec`）:
  - `<qid>-<level>` フレーズ／品詞ラダー（`key(q,l)`）
  - `T:<word>:<ej|je>` 単語帳（`tkey`）
  - `S:<groupId>:<i>` 似た言葉グループ（`skey`）
  - `X:<exampleId>` 例文クイズ（`L:`/`N:`/`T:`/`I:`/`M:`/`K:` + id）
  - `D:`/`H:` 会話（英訳/書き取り）
  - 値は `{o,x,last,t}`（正解数・不正解数・最後・時刻）
- その他: `S.marks`（付箋）, `S.unk`（わからない表現、削除は `del:true` の墓標）, `S.my`（マイ例文）, `S.hideDone`（全問正解を出さない）, `S.tdb`（全問正解の条件 `w`=単語だけ / `b`=単語と例文）, `S.exq`（例文を英訳クイズで出す）, `S.theme`（light/dark/auto）。
- 記録の移行は「記録 → 設定 → 記録をコピー / 貼り付けて復元」（`bkJSON`/`bkRestore`、新しい方を残してマージ）。

## データ定数（app/index.html 内）
| 定数 | 中身 |
|---|---|
| `Q` | フレーズ60問 `{id,jp,scene,a:[[英語,解説(<b>可)]×4]}` ※JSリテラル（キーに引用符なし） |
| `POS` | 品詞別（動詞・形容詞・副詞・名詞・句動詞・熟語）同形式。`WORDS=POS.flatMap(...)`, `ALL=Q.concat(WORDS)` |
| `EX` | ラダー例文 `{"<qid>-<l>":[英,日]}`。`Object.assign(EX,{...})` の追記ブロックもある |
| `LINK` | 聞こえ方 `{"<qid>-<l>":[カナ,説明]}`（追記ブロックあり） |
| `TOEIC`,`USD` | ラダー段のタグ（Set） |
| `TW` | TOEIC 2445語 `{w,m(1=メイン),p(品詞),ja,ex,exja}` |
| `IDM` | TOEFL熟語 699 `{w,ja,ex,exja,us,old,dk:"i"}` |
| `MED` | 医学論文 352 `{w,ja,ex,exja,note,src:"en"|"ja",dk:"m"}` |
| `KOB` | 構文 80 `{w,ja,lv,note,ex,exja,ex2,exja2,dk:"k"}` |
| `MIXD` | TW∪IDM∪MED（mixデッキ） |
| `SG`,`NG`,`PARA`,`TIMEG` | 似た言葉グループ。NG/PARA/TIMEG の item は `[w,ニュアンス,意味,例文,訳(,REG)]` |
| `MERGES` | 似た言葉の重複グループ統合指示 |
| `CLS`,`CROSS`,`CMERGES`,`MEDCL`,`MIXMED` | 単語帳 日→英 のクラスター（デッキ別・横断・医学・mix追加） → `ALLCL`,`WCL` |
| `REG` | `{word: "C"|"N"|"F"}` カジュアル/ふつう/フォーマル |
| `PAPER` | 論文タグの語（小文字Set、MEDは自動追加） |
| `DLG` | 会話23本 `{id,t,lines:[[話者,英,日]],kp}` |

- JSON で書かれている定数は `scripts/datalib.py` の `load()/save()` で安全に読み書きできる（`</` は `<\/` にエスケープして保存）。`Q`/`POS` は JS リテラルなので文字列置換で編集する。

## 内容のルール（重要）
- **著作権**: 市販の単語帳・参考書からは見出し語・索引のみを使う。例文・解説・会話はすべてオリジナルで書く。本の例文や本文を写さない。
- 英語はアメリカ英語。例文は自然で短め。和訳は自然な日本語で英文と対応させる。
- 「論文」「医学論文」の例文は**循環器の論文調**（HF, AF, PCI, ACS, CMR/LGE, RCT, コホート, HR/CI表記など）。医学的・統計的に正しいこと（ガイドラインと矛盾しない、有意なのにCIが1をまたがない等）。
- 4段階ラダーは本当にカジュアル→フォーマルの順に。似た語の並びは強弱・硬さの軸が分かるように。
- 内容を大量に追加・修正したら、`prompts/` のチェック用プロンプトでサブエージェントに分担チェックさせる:
  1. `python3 scripts/export_for_check.py` と `node scripts/export_ladders.js` → `work/check/` に分割ファイル
  2. 各ファイルを `prompts/check_*.txt` に従ってチェック → 結果を `work/check/fa*.tsv`（例文）`fb*.tsv`（意味）`fc*.tsv`（似た言葉）`fl.tsv`（ラダー）に
  3. `python3 scripts/apply_fixes.py` で反映 → `npm test`
  - ラダーの英語を変えたら、その段の `EX` 例文と `LINK` も合わせて直すこと。

## 変更したら
1. `npm test`（全部「OK」になること）
2. 必要なら `npm run serve` でスマホ幅（390px）表示を確認
3. コミットして push（GitHub Pages に自動反映。端末側は次回起動時に Service Worker が新版を取得）

## 既知の点・TODO
- 医学論文の見出し語は本の表記どおり（例: "be candidate for", "be followed-up"）。正しい形は例文とメモで示している。
- 記録タブのアイコン「◔」は端末フォントによって表示されないことがある。
- claude.ai の Artifact 版（オンライン版）は claude.ai 側で別管理。こちらの変更は自動では反映されない。
