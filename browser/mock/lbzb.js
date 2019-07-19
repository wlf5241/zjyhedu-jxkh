import Mock from 'mockjs'
import { param2Obj } from '../src/utils'
import store from '../src/store'

const lbList = []
const xmList = []
const jbList = []
const allList = []

const count = 5

let did = 1

for (let i = 0; i <= count; i++) {
  lbList.push(Mock.mock({
    classid: did,
    parentid: 0,
    mc: '@first',
    fz: '@integer(10, 50)',
    qz: '@integer(1, 50)',
    ordernum: '@integer(1, 10)',
    dj: 0,
    djtags: [],
    ty: 0,
    addtime: '@datetime',
    updatetime: '@datetime'
  }))
  did++

  allList.push(lbList[i])
}
for (let i = 1; i <= 10; i++) {
  xmList.push(Mock.mock({
    classid: did,
    parentid: 0,
    mc: '@first',
    fz: '@integer(10, 50)',
    qz: '@integer(1, 50)',
    ordernum: '@integer(1, 10)',
    dj: 0,
    djtags: [],
    ty: 0,
    addtime: '@datetime',
    updatetime: '@datetime'
  }))
  did++
}
for (let i = 1; i <= 10; i++) {
  jbList.push(Mock.mock({
    classid: did,
    parentid: 0,
    mc: '@first',
    fz: '@integer(10, 50)',
    qz: '@integer(1, 50)',
    ordernum: '@integer(1, 10)',
    'dj|1': ['0', '1'],
    djtags: [{
      id: 1,
      mc: '发表',
      fz: 30,
      ordernum: 1
    }, {
      id: 2,
      mc: '一等奖',
      fz: 20,
      ordernum: 2
    }, {
      id: 3,
      mc: '二等奖',
      fz: 10,
      ordernum: 3
    }, {
      id: 4,
      mc: '三等奖',
      fz: 5,
      ordernum: 3
    }],
    'ty|1': ['0', '1'],
    addtime: '@datetime',
    updatetime: '@datetime'
  }))
  did++
}

xmList.forEach(item => {
  item.parentid = lbList[Math.floor(Math.random() * lbList.length - 1) + 1].classid
  allList.push(item)
})

jbList.forEach(item => {
  item.parentid = xmList[Math.floor(Math.random() * xmList.length - 1) + 1].classid
  if (item.dj === '0') item.djtags.length = 0
  allList.push(item)
})

// 添加进store
console.log(lbList)
store.dispatch('setLbzbList', allList, lbList, xmList, jbList)

export default [
  {
    url: '/ksglapi/getclasslist',
    type: 'get',
    response: config => {
      const { mc, parentid, sort } = param2Obj(config.url)

      let mockList = allList.filter(item => {
        if (parentid && item.parentid !== Number(parentid)) return false
        if (mc && item.mc.indexOf(mc) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      // const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      // console.log(mockList)
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  },
  {
    url: '/ksglapi/createclass',
    type: 'post',
    response: config => {
      const data = JSON.parse(config.body)
      // 增加id
      data.classid = did
      data.classid = did
      did++

      allList.push(data)
      return {
        code: 20000,
        data
      }
    }
  },
  {
    url: '/ksglapi/updateclass',
    type: 'post',
    response: config => {
      // const { id } = param2Obj(config.url)
      const data = JSON.parse(config.body)
      for (const d of allList) {
        if (d.classid === Number(data.classid)) {
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
    url: '/ksglapi/getclass',
    type: 'get',
    response: config => {
      const { classid } = param2Obj(config.url)
      for (const d of allList) {
        if (d.classid === Number(classid)) {
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
    url: '/ksglapi/delclass',
    type: 'get',
    response: config => {
      const { classid } = param2Obj(config.url)
      for (const d of allList) {
        if (d.classid === Number(classid)) {
          allList.splice(allList.indexOf(d), 1)
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
    url: '/ksglapi/allclassbyrenametree',
    type: 'get',
    response: config => {
      // const { ty } = param2Obj(config.url)
      const mockList = []
      let tempObj = {}
      let xmtempObj = {}
      let jbtempObj = {}
      lbList.forEach((key1, index1) => {
        tempObj = {}
        tempObj.lbid = key1.classid
        tempObj.lbmc = key1.mc
        tempObj.xmlist = []
        xmList.forEach((key2, index2) => {
          xmtempObj = {}

          if (key2.parentid === key1.classid) {
            xmtempObj.xmid = key2.classid
            xmtempObj.xmmc = key2.mc
            xmtempObj.fz = key2.fz
            xmtempObj.jblist = []
            jbList.forEach((key3, index3) => {
              jbtempObj = {}
              if (key3.parentid === key2.classid) {
                jbtempObj.jbid = key3.classid
                jbtempObj.jbmc = key3.mc
                jbtempObj.fz = key3.fz
                xmtempObj.jblist.push(jbtempObj)
              }
            })

            if (xmtempObj.jblist.length < 1)xmtempObj.jblist.push({})
            tempObj.xmlist.push(xmtempObj)
          }
        })
        if (tempObj.xmlist.length < 1)tempObj.xmlist.push({})
        mockList.push(tempObj)
      })
      // const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      // console.log(mockList)

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  },
  {
    url: '/ksglapi/updateblockup',
    type: 'get',
    response: config => {
      // 更新停用
      const { jbid } = param2Obj(config.url)
      return {
        code: 20000,
        data: jbid
      }
    }
  },
  // 类别树
  {
    url: '/ksglapi/allclassbytree',
    type: 'get',
    response: config => {
      // const { ty } = param2Obj(config.url)
      const mockList = []
      let tempObj = {}
      let tempObj2 = {}
      let tempObj3 = {}

      // 查找第一级
      const parentList = allList.filter(item => {
        if (item.parentid !== 0) return false
        return true
      })
      parentList.forEach((key, index) => {
        tempObj = {}
        tempObj.classid = key.classid
        tempObj.label = key.mc
        tempObj.children = []

        allList.forEach((key2, index2) => {
          tempObj2 = {}
          if (key2.parentid === key.classid) {
            tempObj2.classid = key2.classid
            tempObj2.label = key2.mc
            tempObj2.children = []
            allList.forEach((key3, index3) => {
              tempObj3 = {}
              if (key3.parentid === key2.classid) {
                tempObj3.classid = key3.classid
                tempObj3.label = key3.mc
                tempObj3.djtags = key3.djtags
                tempObj2.children.push(tempObj3)
              }
            })
            tempObj.children.push(tempObj2)
          }
        })
        mockList.push(tempObj)
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  }
]
