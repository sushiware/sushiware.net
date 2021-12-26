+++
title = "ebiten memo2"
date = 2021-12-26
[taxonomies]
tags = ["go", "ebiten"]
+++

[前回](./../ebiten-memo/)の続き

## 透明度

```go
func (g *Game) Draw(screen *ebiten.Image) {
	op := &ebiten.DrawImageOptions{}
	alpha := 0.5
	op.ColorM.Scale(1, 1, 1, alpha)

	screen.DrawImage(gopherImage, op)
}
```

## モノクロ

```go
func (g *Game) Draw(screen *ebiten.Image) {
	op := &ebiten.DrawImageOptions{}
	op.ColorM.ChangeHSV(0, 0, 1)

	screen.DrawImage(gopherImage, op)
}
```

`ChangeHSV`の2番目の引数が彩度調整。なので0にするとモノクロになる。

## 部分描画

```go
func (g *Game) Draw(screen *ebiten.Image) {
	screen.DrawImage(image.SubImage(image.Rect(0, 0, 160, 120)).(*ebiten.Image), &ebiten.DrawImageOptions{})
}
```

`image.Rect`を使って、部分描画する。

## 入力

```go
func (g *Game) Draw(screen *ebiten.Image) {
	if !ebiten.IsKeyPressed(ebiten.KeyA) {
		return
	}

	ebitenutil.DebugPrint(screen, "A key is pressed!")
}
```

今入力していることしか認識できなので、ステートを自前で用意するのが良さそう。

```go
type Game struct {
	pressedA int
}

func (g *Game) Update() error {
	if ebiten.IsKeyPressed(ebiten.KeyA) {
		g.pressedA++
	} else {
		g.pressedA = 0
	}

	return nil
}

func (g *Game) Draw(screen *ebiten.Image) {
	if g.pressedA != 1 {
		return
	}

	ebitenutil.DebugPrint(screen, "A key is pressed!")
}
```

iOSでは使用できないっぽいので注意

結構端末ごとの実装をしないといけなさそう。

となると、アーキテクチャの作り方とかはWebをやっていてよかったと思えそう。

以上
