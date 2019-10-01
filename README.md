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

[[最新情報へ](https://github.com/kobalab/test-node#readme)]
