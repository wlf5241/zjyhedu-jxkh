import Mock from 'mockjs'
import { param2Obj } from '../src/utils'
import store from '../src/store'

const clList = []

// 过滤一级分类
console.log(store.getters.lbzbAllList)
const lbzbList = store.getters.lbzbAllList.filter(item => {
  if (item.parentid === 0) return false
  return true
})

// console.log(lbzbList)

for (let i = 1; i <= 100; i++) {
  const radNum = Math.floor(Math.random() * lbzbList.length - 1) + 1
  clList.push(Mock.mock({
    id: i,
    classid: lbzbList[radNum].classid,
    classmc: lbzbList[radNum].mc,
    xxid: 1,
    mc: '@first',
    hjsj: '@datetime',
    bjdw: '@first',
    zz: '@first',
    'hjdj|1-4': 4,
    'km|1-8': 8,
    'fj|1-5': [
      {
        'id|+1': [
          1,
          2,
          3
        ],
        'name|+1': [
          '@title(1,2)',
          '@title(1,2)',
          '@title(1,2)'
        ],
        'url|+1': [
          '@url()',
          '@url()',
          '@url()'
        ]
      }
    ],
    'zt|1': [{
      type: 0,
      strtype: '未上报',
      msg: ''
    },
    {
      type: 1,
      strtype: '已上报',
      msg: ''
    },
    {
      type: 2,
      strtype: '退回',
      msg: '被退回的原因'
    },
    {
      type: 3,
      strtype: '通过',
      msg: ''
    }],
    bz: '@title(1,2)',
    sbsj: '@datetime',
    gxsj: '@datetime',
    'ordernum|1-100': 100
  }))
}

export default [
  {
    url: '/ksglapi/getcllist',
    type: 'get',
    response: config => {
      const { mc, classid, page = 1, limit = 20, sort } = param2Obj(config.url)
      let mockList = clList.filter(item => {
        if (mc && item.mc.indexOf(mc) < 0) return false
        if (classid && item.classid !== Number(classid)) return false
        return true
      })
      // console.log(mockList)
      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      // console.log(mockList)
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/ksglapi/createcl',
    type: 'get',
    response: config => {
      const data = JSON.parse(config.body)
      clList.push(data)
      return {
        code: 20000,
        data
      }
    }
  },
  {
    url: '/ksglapi/updatecl',
    type: 'get',
    response: config => {
      // const { id } = param2Obj(config.url)
      const data = JSON.parse(config.body)
      for (const d of clList) {
        if (d.id === Number(data.id)) {
          for (const key in data) {
            d[key] = data[key]
          }
          return {
            code: 20000
          }
        }
      }
      return {
        code: 90000
      }
    }
  },
  {
    url: '/ksglapi/getcl',
    type: 'get',
    response: config => {
      const { id } = param2Obj(config.url)
      for (const d of clList) {
        if (d.id === Number(id)) {
          return {
            code: 20000,
            data: d
          }
        }
      }
      return {
        code: 90000
      }
    }
  },
  {
    url: '/ksglapi/delcl',
    type: 'get',
    response: config => {
      const { id } = param2Obj(config.url)
      for (const d of clList) {
        if (d.id === Number(id)) {
          clList.splice(clList.indexOf(d), 1)
          return {
            code: 20000
          }
        }
      }
      return {
        code: 90000
      }
    }
  }
]
