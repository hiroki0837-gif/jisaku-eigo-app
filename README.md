# 自作英語学習アプリ

ニュアンス別（カジュアル〜フォーマル）の英語フレーズ、似た言葉、TOEIC・TOEFL熟語・医学論文の単語帳、例文の英訳、会話のリスニングを、スマホで学習するアプリです。

## はじめに（GitHub に置いてスマホで使う）
1. このフォルダで Git を始めて GitHub に push します。
   ```bash
   git init
   git add .
   git commit -m "最初の版"
   git branch -M main
   git remote add origin https://github.com/<あなたのユーザー名>/jisaku-eigo-app.git
   git push -u origin main
   ```
   （GitHub で先に空のリポジトリ `jisaku-eigo-app` を作っておきます）
2. GitHub のリポジトリで **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にします。
3. 数分後、Actions タブの処理が緑になったら `https://<ユーザー名>.github.io/jisaku-eigo-app/` が使えます。
4. iPhone の Safari でそのURLを開き、共有ボタン → **ホーム画面に追加**。一度開けば電波がなくても動きます。

※ リポジトリを非公開（Private）にすると、無料プランでは GitHub Pages が使えない場合があります。

## Claude Code で続きを開発する
```bash
cd jisaku-eigo-app
npm install
claude
```
Claude Code は `CLAUDE.md` を読んで、アプリの構造・データ・内容のルールを把握します。たとえば「単語帳に○○を追加して」「例文を再チェックして」と頼めます。変更後は `npm test` で確認し、push すると GitHub Pages のアプリも更新されます。

## フォルダ構成
- `app/index.html` … アプリ本体（データ込みの1ファイル）
- `app/icons/` … ホーム画面アイコン
- `scripts/build_pwa.py` … オフライン版（`dist/`）を作る
- `scripts/datalib.py` / `export_for_check.py` / `export_ladders.js` / `apply_fixes.py` … データの読み書き・内容チェック用
- `prompts/` … 内容チェック・追加のときに使う指示文
- `tests/` … 動作確認（`npm test`）
- `data/raw/` … 医学論文デッキ・追加フレーズの元データ

## 記録の引き継ぎ
アプリの「記録 → 設定 → 記録をコピー」で記録を文字としてコピーし、移したい先のアプリの「貼り付けて復元」に貼ると移せます（claude.ai 版 ⇄ GitHub 版、端末間など）。
