+++
title = "ebiten memo"
date = 2021-12-25
[taxonomies]
tags = ["go", "ebiten"]
+++

クリスマスに急にゲーム作りたいという気持ちが行動に移った。

個人で作るには2Dのゲームがベストかと思い、一番書けるGo製エンジンの`ebiten`を使ってみることにした。

とりあえず触ったメモ

## 基本のキ

```go
package main

type Game struct {}
func (g *Game) Update() error { return nil }
func (g *Game) Draw(screen *ebiten.Image) {}
func (g *Game) Layout(outsideWidth, outsideHeight int) (screenWidth, screenHeight int) { return 640, 480 }

func main() {
	game := &Game{}
	ebiten.SetWindowSize(640, 480)
	ebiten.SetWindowTitle("title")

	if err := ebiten.RunGame(game); err != nil {
		log.Fatal(err)
	}
}
```

これが最もシンプルな構成

`Update`でステートの更新、`Draw`で描画、`Layout`で画面サイズの設定を行う。

めっちゃわかりやすい。

## 画像の描画

```go
var (
	//go:embed image.png
	imageBytes []byte
	image      = MustDecode(bytes.NewBuffer(imageBytes))
)

func MustDecode(r io.Reader) *ebiten.Image {
	img, _, err := image.Decode(r)
	if err != nil {
		panic(err)
	}

	return ebiten.NewImageFromImage(img)
}

func (g *Game) Draw(screen *ebiten.Image) {
	screen.DrawImage(image, op)
}
```

上記の感じでできる

## 画像の移動

```go
func (g *Game) Draw(screen *ebiten.Image) {
	op := &ebiten.DrawImageOptions{}
	x, y := 100, 100
	op.GeoM.Translate(x, y)
	screen.DrawImage(image, op)
}
```

シンプルな移動

## 画像の変形

```go
func (g *Game) Draw(screen *ebiten.Image) {
	op := &ebiten.DrawImageOptions{}
	x, y := 2, 2
	op.GeoM.Scale(2, 2)
	screen.DrawImage(image, op)
}
```

これで2倍に拡大される

## 移動と変形の順番

APIがシンプルなので、外からだとわからないが、内部では行列演算がなされている。

移動 -> 変形の順番に行うと、移動した後に変形してしまう。

## フィルタ

```go
func (g *Game) Draw(screen *ebiten.Image) {
	op := &ebiten.DrawImageOptions{Filter: ebiten.FilterLinear}
	screen.DrawImage(image, op)
}
```

こんな感じで設定する

縁取り線をぼやっとしてくれる`ebiten.FilterLinear`と普通に描画する`ebiten.FilterNearest`がある

何も設定しないとデフォルトの`ebiten.FilterNearest`が使われる。

## 回転

```go
func (g *Game) Draw(screen *ebiten.Image) {
	op := &ebiten.DrawImageOptions{}
	op.GeoM.Rotate(math.Pi / 4)
	screen.DrawImage(image, op)
}
```

45度回転。これ以上ないほどわかりやすいAPI。

```go
func (g *Game) Draw(screen *ebiten.Image) {
	w, h := image.Size()
	op := &ebiten.DrawImageOptions{}
	op.GeoM.Translate(-float64(w)/2, -float64(h)/2)
	op.GeoM.Rotate(math.Pi / 4)
	op.GeoM.Translate(float64(w)/2, float64(h)/2)
	screen.DrawImage(image, op)
}
```

画像を中心に45度回転。

## オフスクリーンレンダリング

```go
var (
	//go:embed gopher.png
	imageBytes     []byte
	image          = MustDecode(bytes.NewBuffer(gopherImageBytes))
	offscreenImage = ebiten.NewImage(640, 480)
)

func (g *Game) Draw(screen *ebiten.Image) {
	offscreenImage.Clear()

	// オフスクリーンバッファに描画
	op1 := &ebiten.DrawImageOptions{}
	offscreenImage.DrawImage(image, op1)

	// オフスクリーンバッファをレンダリング
	op2 := &ebiten.DrawImageOptions{}
	screen.DrawImage(offscreenImage, op3)
	// 同じオフスクリーンバッファを拡大してレンダリング
	op3 := &ebiten.DrawImageOptions{}
	op3.GeoM.Scale(2, 2)
	op3.GeoM.Translate(100, 100)
	screen.DrawImage(offscreenImage, op4)
}
```

画面には描画されないパレット的なバッファをオフスクリーンバッファというらしい。

使いまわして、一人だけ色の違うキャラクターを立たせたりができそう。

`ebiten.Image`の生成は重いようなので毎回生成するのはNG。

`offscreenImage.Clear()`でオフスクリーンバッファをクリアするのを忘れない。

`Clear`しないで、キャッシュ的に使うこともできるので、`ebiten`が勝手に呼んでくれるようにしてないのだと思う。

毎回絶対呼びたいようであれば`defer offscreenImage.Clear`が良さそう。

## モザイク

```go
var (
	//go:embed gopher.png
	gopherImageBytes []byte
	gopherImage      = MustDecode(bytes.NewBuffer(gopherImageBytes))
	tmpImage         = ebiten.NewImage(320, 240)
)

func (g *Game) Draw(screen *ebiten.Image) {
	const scale = 8.0
	tmpImage.Clear()

	op1 := &ebiten.DrawImageOptions{}
	op1.GeoM.Scale(1/scale, 1/scale)

	tmpImage.DrawImage(gopherImage, op1)

	op2 := &ebiten.DrawImageOptions{}
	op2.GeoM.Scale(scale, scale)

	screen.DrawImage(tmpImage, op2)
}
```

画像を一旦小さくしてから拡大する。するとモザイクのようにできる。

---

今日は一旦こんなもんで。

2Dゲームは`ebiten`を使うのが良刺そうと実感した。

問題は絵と音だとも思った。

以上

[次](./../ebiten-memo2/)
