export default class OthelloBoard {
	/**
	 * new OthelloBoard() したときこの関数が呼ばれる
	 */
	constructor() {
		/**
		 * 盤面の情報をもつ配列. この変数には外からアクセスしない
		 */
		this._board = [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 2, 1, 0, 0, 0],
			[0, 0, 0, 1, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		];
	}
	/**
	 * その場所にある色
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	getColor(x, y) {
		assertOnBoard('getColor', x, y);
		return this._board[y][x];
	}
	/**
	 * その場所にある色と逆の色
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	getGyaku(x, y) {
		assertOnBoard('getGyaku', x, y);
		const color = this._board[y][x];
		switch (color) {
			case 1:
				return 2;
			case 2:
				return 1;
			default:
				return 0;
		}
	}
	/**
	 * 盤面のある位置から、指定された方向に向かって進んだときの色を配列で取得する
	 * 「空白」と「盤の外側」のマスは含まれない
	 * @param {Number} startX
	 * @param {Number} startY
	 * @param {Number} moveX
	 * @param {Number} moveY
	 * @example [{
	 *      x: 5,
	 *      y: 4,
	 *      color: 1,
	 *      susumi: 1
	 * }]
	 */
	getLine(startX, startY, moveX, moveY) {
		assertOnBoard('getLine', startX, startY);
		if (moveX === 0 && moveY === 0) return []; // 向きがないので空とみなす
		// [moveX, moveY] 方向にある各マスを配列に入れる
		const line = [];
		for (let susumi = 1; susumi < 8; susumi++) {
			const x = startX - susumi * moveX;
			const y = startY - susumi * moveY;
			if (!this.isOnBoard(x, y)) break; // 外に出た
			if (this.getColor(x, y) === 0) break; // 間に空白が入った
			line.push({
				x,
				y,
				color: this.getColor(x, y),
				gyaku: this.getGyaku(x, y),
				susumi
			});
		}
		return line;
	}
	/**
	 * その場所がボード内かどうかを調べる
	 * @param {Number} x X
	 * @param {Number} y Y
	 * @returns {Boolean} ボード内なら true, そうでないなら false
	 */
	isOnBoard(x, y) {
		// [0][0] ~ [7][7] の中にある
		if (0 <= x && x < 8 && 0 <= y && y < 8) return true;
		return false;
	}
	/**
	 * 指定したマスに指定した色が置けるかどうかを調べる
	 * @param {Number} x X
	 * @param {Number} y Y
	 * @param {Number} color 置きたい色 (1|2)
	 * @return {Boolean} 置けるかどうか（true|false)
	 */
	isOkeru(x, y, color) {
		if (!this.isOnBoard(x, y)) return false; // そのマスは盤の外にある
		if (this._board[y][x] !== 0) return false; // そのマスが 0 でなければ置けない

		// [-1, -1] ~ [1, 1] までの全ての向きで置けるかどうかしらべる
		for (let mukiX = -1; mukiX <= 1; mukiX++) {
			for (let mukiY = -1; mukiY <= 1; mukiY++) {
				// [mukiX, mukiY] 方向のラインを調べる
				for (const masu of this.getLine(x, y, mukiX, mukiY)) {
					if (masu.susumi === 1 && masu.color === color) {
						// 隣接マスが同じ色だった => NG
						break;
					}
					if (masu.susumi > 1 && masu.gyaku === color) {
						// その後に逆の色(自分の色)があった => OK!
						return true;
					}
				}
			}
		}
		return false; // どの向きもダメだった
	}
	/**
	 * 指定したマスに指定した色を置く
	 * @param {Number} x X
	 * @param {Number} y Y
	 * @param {Number} color 置きたい色 (1|2)
	 */
	oku(x, y, color) {
		assertOnBoard('oku', x, y);
		// TODO: ここに色を置いた時の処理を書く
	}
	/**
	 * 指定したマスの色を裏返す
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	uragaesu(x, y) {
		assertOnBoard('uragaesu', x, y);
		const gyaku = this.getGyaku(x, y);
		if (gyaku === 0) {
			Hack.log('エラー: そのマスには何もないので、裏返せません'); // この警告は消してもいい
		}
		this._board[y][x] = gyaku;
	}
	/**
	 * 現在の盤面をコピーして返す
	 */
	clone() {
		const newBoard = new OthelloBoard();
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				newBoard._board[y][x] = this._board[y][x];
			}
		}
		return newBoard;
	}
}

/**
 * （デバッグ用）ある座標が盤面の外なら、Hack.logで知らせる
 * @param {String} funcName 関数の名前
 * @param {Number} x X
 * @param {Number} y Y
 */
function assertOnBoard(funcName, x, y) {
	if (x > 7 || x < 0) {
		Hack.log('エラー:' + funcName + 'に盤面外の指定(x=' + x + ')がありました');
	}
	if (y > 7 || y < 0) {
		Hack.log('エラー:' + funcName + 'に盤面外の指定(y=' + y + ')がありました');
	}
}
