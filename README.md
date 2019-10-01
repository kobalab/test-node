# test-node

**[Node](https://nodejs.org)** でサーバアプリを書いてみる

## Hello, world!

まずは、何はともあれ **Hello, world** から。[(参照)](https://github.com/kobalab/test-node/blob/hello/server.js)

Node標準のモジュール **[http](https://nodejs.org/dist/latest-v12.x/docs/api/http.html)** でHTTPプロトコルを受け付けるサーバを作成できる。

```JavaScript
const http = require('http');

http.createServer((req, res)=>{
    res.writeHead(200);
    res.write('<h1>Hello, world.</h1>');
    res.end();
}).listen(8000);
```
``http.createSrever()`` を呼び出すと ``http.Server``のインスタンスが生成される。生成したサーバのメソッド ``.listen()`` を呼び出すと、呼出しのときに指定したポート番号で接続を待機するHTTPサーバが起動する。

``http.createServer()``の引数は接続時に起動するコールバック関数である。コールバック関数の引数 ``req`` はHTTPリクエストを表現したオブジェクトで以下のインスタンス変数を持つ。

|変数           |内容                                                  |
|:--------------|:----------------------------------------------------|
|``method``     | リクエストメソッド(GET/POST/PUT/DELETE...)。          |
|``url``        | リクエストされたURL。GETのパラメータも含む。            |
|``headers``    | リクエストヘッダ名をkey、ヘッダ値をvalueとするハッシュ。 |

``res`` はHTTPレスポンスの生成をサポートするオブジェクトで以下のインスタンスメソッドを持つ。

|メソッド         |内容                                                  |
|:---------------|:-----------------------------------------------------|
|``writeHead()`` | ステータスコード、レスポンスヘッダなどを出力する。        |
|``write()``     | レスポンスボディを出力する。                            |
|``end()``       | レスポンス出力を完了する。                              |

NodeのHTTPサービスはすべてこの単純な仕組みの上に成り立っているのだが、サーバ上の全てのサービスをこの単一のコールバック関数で処理するのは煩雑すぎる。ApacheやTomcatのようにメソッドとURLの組に基づいて実行するサービスを選択したい。その要望に応えるのがExpressである。

## Express

**[Express](http://expressjs.com)** は Node.js でWebサービスを構築するフレームワークである。Expressで Hello, world を実現すると以下のようになる。

```JavaScript
const express = require('express');
const app = express();

app.get('/', (req, res, next)=>{
    res.send('<h1>Hello, world.</h1>');
});
app.listen(8000);
```
`app.get('/', ……)` で、`GET /` のリクエストを受けたときに第2引数で設定したコールバック関数が起動するようになる。ExpressではこのようにメソッドとURL(path)の組み合わせで呼び出すコールバック関数を設定していく。

コールバック関数の引数`req`, `res`の役割は`http.Server`と同様だが、後述する **ミドルウェア関数** によりメソッドやプロパティが追加される。例えば express-session を使用すると、req.session を通してセッションデータにアクセスできるようになる。引数`next`はミドルウェア関数の連鎖を指示するコールバック関数で、`next()`を呼び出すと後続のミドルウェア関数に処理が遷移する。

よく使用されるミドルウェア関数は以下。元々は express にバンドルされ、`express.middleware`のように参照するものが多かったようだが、今はそれぞれ別モジュールに分離される傾向にある。

|モジュール名          |機能                  | 旧名             |
|:-------------------|:---------------------|:----------------|
|morgan              |ログ出力               |express.logger   |
|express-session     |セッションデータ保存     |express.session  |
|(body-parser)       |POSTパラメータ解析      |express.urlencoded|
|(serve-static)      |静的コンテンツ応答       |express.static   |
|serve-index         |ディレクトリインデックス  |express.directory|
|compression         |出力圧縮(gzip/deflate) |express.compress |

(body-parser と serve-static は旧名のインタフェースも残っている)

ミドルウェア関数を追加にするには ``app.use()``を使う。以下はカレントディレクトリをドキュメントルートとするWebサーバの例である。[(参照)](https://github.com/kobalab/test-node/blob/express/server.js)

```JavaScript
const express = require('express');
const index   = require('serve-index');
const logger  = require('morgan');
const session = require('express-session');

const app = express();

app.use(logger('dev'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('./'));
app.use(index('./', {icons: true, view: 'details'}));

app.listen(8000, ()=>console.log('Server listening on http://127.0.0.1:8000'));
```

ミドルウェア関数の引数も同様に `(req, res, next)` である。つまりアプリケーションも構造上はミドルウェア関数と区別がない。これらの関数は`app.use()`や`app.METHOD()`で追加した順に連鎖される。`next()`が呼ばれたが連鎖が末尾まできており実行すべき関数がない場合は **`404 Not Found`** で応答する。

`app` は実は `http.createServer()` の引数に渡されるコールバック関数であり、
```JavaScript
app.listen(8000);
```
は
```JavaScript
http.createServer(app).listen(8000);
```
の意味である(この事実は **socket.io** を使用するときに意味を持つ)。`app.use()`や`app.METHOD()`は`app()` 自身に機能を追加する処理だった訳だ。

[[最新情報へ](https://github.com/kobalab/test-node#readme)]
