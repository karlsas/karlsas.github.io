/**
 * 游戏模型
 */
function Game(row, col, mine) {
  let params = {
    state: 0, // 0-游戏中 1-失败 2-胜利
    row,
    col,
    mine
  };
  // 初始化数据
  params.count = params.row * params.col - params.mine

  let map = []
  for (let i = 0; i < params.row; i++) {
    map[i] = []
    for (let j = 0; j < params.col; j++)
      map[i][j] = 10
  }

  // 判断坐标是否在地图里
  function inMap(i, j) {
    return i >= 0 && j >= 0 && i < params.row && j < params.col
  }

  // 布雷
  for (let i = 0; i < params.mine;) {
    let x = parseInt(Math.random() * params.row)
    let y = parseInt(Math.random() * params.col)
    if (map[x][y] == 19) continue

    ++i
    map[x][y] = 19
    for (let m = x - 1; m <= x + 1; ++m)
      for (let n = y - 1; n <= y + 1; ++n)
        if (inMap(m, n) && map[m][n] != 19)
          ++map[m][n]
  }

  let result = []

  /**
   * 获取操作结果集
   */
  function get() {
    let r = result
    result = []
    return r
  }

  /**
   * 翻开
   */
  function open(i, j) {
    if (params.state === 0 && inMap(i, j) && map[i][j] >= 10) {
      map[i][j] %= 10
      result.push([i, j, map[i][j]])

      if (map[i][j] == 9) {
        params.state = 1
        return
      }

      if (--params.count == 0) {
        params.state = 2
        return
      }

      if (map[i][j] == 0)
        for (let m = i - 1; m <= i + 1; ++m)
          for (let n = j - 1; n <= j + 1; ++n)
            open(m, n)
    }
  }

  /**
   * 快捷翻开
   */
  function autoDisposeRoundBlock(i, j) {
    let count = 0
    let noOpenCount = 0
    for (let m = i - 1; m <= i + 1; ++m)
      for (let n = j - 1; n <= j + 1; ++n)
        if (inMap(m, n)) {
          if (map[m][n] >= 20)
            ++count
          if (map[m][n] >= 10)
            ++noOpenCount
        }


    if (map[i][j] != count && map[i][j] != noOpenCount) return

    for (let m = i - 1; m <= i + 1; ++m)
      for (let n = j - 1; n <= j + 1; ++n)
        if (inMap(m, n))
          if (count == map[i][j]) {
            if (map[m][n] < 20)
              open(m, n)
          } else {
            if (map[m][n] >= 10 && map[m][n] < 20) {
              flagBlock(m, n)
            }
          }
  }

  /**
   * 标记|取消标记
   */
  function flag(i, j) {
    if (map[i][j] < 10) return

    if (map[i][j] < 20) {
      flagBlock(i, j)
    } else {
      map[i][j] -= 10
      result.push([i, j, 10])
    }
  }

  /**
   * 标记方块
   */
  function flagBlock(i, j) {
    map[i][j] += 10
    result.push([i, j, 11])
  }

  /**
   * 提示
   */
  function tip(i, j) {
    if (map[i][j] >= 10 && map[i][j] < 20) {
      map[i][j] == 19 ? flag(i, j) : open(i, j)
    }
  }

  /**
   * 翻开
   */
  function openBlock(i, j, easy) {
    if (map[i][j] < 10) {
      if (easy) autoDisposeRoundBlock(i, j)
    } else if (map[i][j] < 20) {
      open(i, j)
    }
  }

  /**
   * 游戏结束
   */
  function gameover() {
    for (let i = 0; i < params.row; i++) {
      for (let j = 0; j < params.col; j++) {
        // 过滤已翻开的和标记正确的
        if (map[i][j] < 10 || map[i][j] == 29) continue;

        map[i][j] %= 10
        if (map[i][j] == 9 && params.state == 2) {
          map[i][j] = 29
          result.push([i, j, 11])
        } else {
          result.push([i, j, map[i][j]])
        }
      }
    }
  }

  return {
    params,
    get,
    flag,
    tip,
    openBlock,
    gameover,
  }
}