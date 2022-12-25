# 自作 MVU フレームワーク

## 開発ツールの導入

[asdf](https://asdf-vm.com/) を利用しています。

```bash
# asdf プラグインの導入
$ asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
$ asdf plugin add pnpm https://github.com/jonathanmorley/asdf-pnpm.git
$ asdf plugin add task https://github.com/particledecay/asdf-task.git

# .tool-versions に列挙しているツールをインストールする
$ asdf install
```

## 依存パッケージのインストール

```bash
$ task prepare
```

## ビルド

```bash
$ task build
```

## サンプル

### カウンターアプリ

```bash
$ task dev-counter
```

### `input` 要素の入力内容を取得して別途表示するやつ

```bash
$ task dev-hello-world
```

### ランダムで猫の画像を取得・表示するアプリ

```bash
$ task dev-random-cat
```
