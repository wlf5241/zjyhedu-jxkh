import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

const xsList = []
const count = 100

for (let i = 0; i < count; i++) {
  xsList.push(Mock.mock({
    id: '@increment',
    'xxid|1': [1, 2, 3],
    'xxmc|1': ['莲都区碧湖中学', '莲都区花园中学', '莲都区实验小学'],
    'xb|1': ['男', '女'],
    xm: '@first',
    zjbh: '@id()',
    xjfh: '@id()',
    'njbh|1': '@integer(1, 2)',
    'bjmc|1': ['初中二年级(01)班', '初中二年级(02)班'],
    'bjbh|1': '@integer(1, 2)',
    zt: 1
  }))
}

export default [
  {
    url: '/ksglapi/kslist',
    type: 'get',
    response: config => {
      const { xm, xxid, njbh, bjbh, page = 1, limit = 30, sort } = param2Obj(config.url)
      let mockList = xsList.filter(item => {
        if (xm && item.xm.indexOf(xm) < 0) return false
        if (xxid && item.xxid !== Number(xxid)) return false
        if (njbh && item.njbh !== Number(njbh)) return false
        if (bjbh && item.bjbh !== Number(bjbh)) return false
        return true
      })
      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      // console.log(mockList)

      return {
        code: 20000,
        total: mockList.length,
        items: pageList
      }
    }
  }
]
